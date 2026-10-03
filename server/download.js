// Entrega do PDF depois de o pagamento ser confirmado na Stripe.
//
// Variáveis de ambiente (Railway → serviço → Variables):
//   STRIPE_SECRET_KEY     chave restrita da Stripe com leitura de Checkout Sessions
//   PDF_URL_PROTOCOLO     link privado do PDF "Protocolo Nórdico" (opcional)
//   PDF_URL_EBOOK         link privado do PDF "Controlo Total" (opcional)
//   PDF_DIR               pasta privada com <produto>.pdf (volume do Railway, padrão /data)
//
// Se houver ficheiro em PDF_DIR, é usado; senão usa o link PDF_URL_*.
// Os links dos PDFs nunca chegam ao browser: o servidor vai buscá-los e
// reenvia o ficheiro só a quem tem uma sessão de checkout paga.

import { createReadStream, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { emailBonusApplies } from "./emails.js";

export const PRODUCTS = {
  // Aceita o preço atual e o anterior (compras feitas antes da mudança de preço)
  protocolo: { productId: "prod_VL9OoIQKgcymf0", amounts: [998, 1649], envVar: "PDF_URL_PROTOCOLO", filename: "Protocolo-Nordico.pdf" },
  ebook: { productId: "prod_VL9OH1nRlGOd6V", amounts: [499, 659, 997], envVar: "PDF_URL_EBOOK", filename: "Controlo-Total.pdf" },
};

// Produtos comprados numa sessão: pelos itens (inclui o order bump do checkout,
// em que o mesmo pagamento traz os dois produtos), identificados pelo produto
// da Stripe ou pelo preço unitário (se o link usar uma cópia do produto) e, para
// compras antigas sem itens expandidos, pelo valor total. 499 = order bump.
export function productsInSession(session) {
  if (session.currency !== "eur") return [];
  const items = session.line_items?.data || [];
  const found = Object.keys(PRODUCTS).filter((k) =>
    items.some(
      (li) =>
        (li.price?.product?.id || li.price?.product) === PRODUCTS[k].productId ||
        PRODUCTS[k].amounts.includes(li.price?.unit_amount)
    )
  );
  if (found.length) return found;
  return Object.keys(PRODUCTS).filter((k) => PRODUCTS[k].amounts.includes(session.amount_subtotal));
}

const json = (status, error) => ({
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  body: JSON.stringify({ error }),
});

// Links de partilha do Google Drive / Dropbox → link de download direto
function directLink(url) {
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return `https://drive.google.com/uc?export=download&id=${drive[1]}`;
  if (url.includes("dropbox.com")) return url.replace(/([?&])dl=0/, "$1dl=1");
  return url;
}

export async function handleDownload(searchParams, env = process.env) {
  const sessionId = searchParams.get("session_id") || "";
  const product = PRODUCTS[searchParams.get("produto")];

  if (!product || !/^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId)) {
    return json(400, "Pedido inválido.");
  }
  if (!env.STRIPE_SECRET_KEY) return json(500, "Pagamento ainda não configurado no servidor.");

  const stripeRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items`,
    { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
  );
  if (!stripeRes.ok) return json(404, "Compra não encontrada.");
  const session = await stripeRes.json();

  const paid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  const bought = productsInSession(session);
  // Oferta do email de recuperação: Controlo Total grátis até 48 h depois do envio
  if (bought.includes("protocolo") && !bought.includes("ebook") && emailBonusApplies(session.customer_details?.email, session.created, env)) {
    bought.push("ebook");
  }
  const rightProduct = bought.includes(searchParams.get("produto"));
  if (!rightProduct) return json(403, "Pagamento não confirmado para este produto.");
  // Multibanco: o checkout fecha com a referência por pagar; a Stripe marca a
  // sessão como paga quando o banco confirma (pode demorar horas).
  if (!paid && session.status === "complete") {
    return { status: 202, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, body: JSON.stringify({ pending: true }) };
  }
  if (!paid) return json(403, "Pagamento não confirmado para este produto.");
  // Só confirmar o estado (a página de obrigado usa isto ao abrir)
  if (searchParams.get("check")) {
    return { status: 200, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, body: JSON.stringify({ paid: true, produtos: bought }) };
  }

  const localPdf = join(env.PDF_DIR || "/data", `${searchParams.get("produto")}.pdf`);
  const hasLocal = existsSync(localPdf) && statSync(localPdf).size > 0;
  const pdfUrl = env[product.envVar];
  if (!hasLocal && !pdfUrl) {
    return json(503, "Ficheiro ainda não disponível. Entraremos em contacto por email.");
  }

  let body;
  if (hasLocal) {
    body = Readable.toWeb(createReadStream(localPdf));
  } else {
    const pdfRes = await fetch(directLink(pdfUrl), { redirect: "follow" });
    if (!pdfRes.ok || !pdfRes.body) return json(502, "Não foi possível obter o ficheiro. Tente novamente.");
    body = pdfRes.body;
  }

  return {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${product.filename}"`,
      "Cache-Control": "no-store",
    },
    body,
  };
}

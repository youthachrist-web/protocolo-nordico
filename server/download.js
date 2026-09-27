// Entrega do PDF depois de o pagamento ser confirmado na Stripe.
//
// Variáveis de ambiente (Railway → serviço → Variables):
//   STRIPE_SECRET_KEY     chave restrita da Stripe com leitura de Checkout Sessions
//   PDF_URL_PROTOCOLO     link privado do PDF "Protocolo Nórdico"
//   PDF_URL_EBOOK         link privado do PDF "Controlo Total" (upsell)
//
// Os links dos PDFs nunca chegam ao browser: o servidor vai buscá-los e
// reenvia o ficheiro só a quem tem uma sessão de checkout paga.

const PRODUCTS = {
  protocolo: { amount: 1649, envVar: "PDF_URL_PROTOCOLO", filename: "Protocolo-Nordico.pdf" },
  ebook: { amount: 997, envVar: "PDF_URL_EBOOK", filename: "Controlo-Total.pdf" },
};

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
  if (!env.STRIPE_SECRET_KEY) return json(503, "Pagamento ainda não configurado no servidor.");
  const pdfUrl = env[product.envVar];
  if (!pdfUrl) return json(503, "Ficheiro ainda não disponível. Entraremos em contacto por email.");

  const stripeRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
  );
  if (!stripeRes.ok) return json(404, "Compra não encontrada.");
  const session = await stripeRes.json();

  const paid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  const rightProduct = session.currency === "eur" && session.amount_subtotal === product.amount;
  if (!paid || !rightProduct) return json(403, "Pagamento não confirmado para este produto.");

  const pdfRes = await fetch(directLink(pdfUrl), { redirect: "follow" });
  if (!pdfRes.ok || !pdfRes.body) return json(502, "Não foi possível obter o ficheiro. Tente novamente.");

  return {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${product.filename}"`,
      "Cache-Control": "no-store",
    },
    body: pdfRes.body,
  };
}

// Recuperar o acesso pelo email da compra (POST /api/acesso).
// Serve sobretudo o Multibanco: o cliente paga a referência horas depois e
// pode já não ter a página de obrigado aberta. Também ajuda quem fechou a página.
// Devolve só as compras pagas desse email, com o link para a página de download.

import { productsInSession } from "./download.js";
import { emailBonusApplies } from "./emails.js";

const MAX_BODY = 2 * 1024;
const LIMIT_PER_HOUR = 10;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3600_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT_PER_HOUR;
}

async function readEmail(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error("too large");
    chunks.push(chunk);
  }
  const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  return String(data?.email || "").trim().toLowerCase();
}

const reply = (status, body) => ({ status, body });

export async function recoverAccess(req, ip, env = process.env) {
  if (req.method !== "POST") return reply(405, { error: "Método não permitido." });
  if (rateLimited(ip)) return reply(429, { error: "Demasiadas tentativas. Tente daqui a uma hora." });
  let email;
  try {
    email = await readEmail(req);
  } catch {
    return reply(400, { error: "Pedido inválido." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(400, { error: "Indique um e-mail válido." });
  if (!env.STRIPE_SECRET_KEY) return reply(500, { error: "Serviço indisponível." });

  const res = await fetch(
    `https://api.stripe.com/v1/checkout/sessions?limit=20&status=complete&customer_details[email]=${encodeURIComponent(email)}&expand[]=data.line_items`,
    { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
  );
  if (!res.ok) return reply(502, { error: "Não foi possível verificar agora. Tente novamente." });
  const { data = [] } = await res.json();

  const compras = [];
  let pendentes = 0;
  for (const s of data) {
    const produtos = productsInSession(s);
    if (produtos.includes("protocolo") && !produtos.includes("ebook") && emailBonusApplies(s.customer_details?.email, s.created, env)) {
      produtos.push("ebook");
    }
    if (!produtos.length) continue;
    if (s.payment_status !== "paid") {
      pendentes++;
      continue;
    }
    for (const produto of produtos) {
      if (!compras.some((c) => c.produto === produto)) compras.push({ produto, session_id: s.id });
    }
  }
  return reply(200, { compras, pendentes });
}

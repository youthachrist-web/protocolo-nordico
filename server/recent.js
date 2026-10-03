// Compras reais recentes, lidas da Stripe, para os pop-ups de prova social.
// Anónimas: só produto, país e há quantos minutos (nada de nomes nem emails).

import { productsInSession } from "./download.js";

const COUNTRIES = { PT: "Portugal", BR: "Brasil", IT: "Itália", ES: "Espanha", FR: "França", DE: "Alemanha", CH: "Suíça", LU: "Luxemburgo", BE: "Bélgica", GB: "Reino Unido", US: "EUA" };
const WINDOW_HOURS = 72;
let cache = { at: 0, data: [] };

export async function recentPurchases(env = process.env) {
  if (!env.STRIPE_SECRET_KEY) return [];
  if (Date.now() - cache.at < 60_000) return cache.data;

  const since = Math.floor(Date.now() / 1000) - WINDOW_HOURS * 3600;
  const res = await fetch(
    `https://api.stripe.com/v1/checkout/sessions?limit=20&status=complete&created[gte]=${since}&expand[]=data.line_items`,
    { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
  );
  if (!res.ok) return cache.data;
  const { data = [] } = await res.json();

  const out = data
    .filter((s) => s.payment_status === "paid" && s.currency === "eur")
    .map((s) => {
      const produto = productsInSession(s)[0];
      if (!produto) return null;
      const cc = s.customer_details?.address?.country;
      return {
        produto,
        country: COUNTRIES[cc] || null,
        minutesAgo: Math.max(1, Math.round((Date.now() / 1000 - s.created) / 60)),
      };
    })
    .filter(Boolean);

  cache = { at: Date.now(), data: out };
  return out;
}

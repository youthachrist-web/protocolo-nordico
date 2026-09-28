// Mesma rota /api/recent-purchases para quando o site corre na Vercel.
import { recentPurchases } from "../server/recent.js";

export default async function handler(req, res) {
  const data = await recentPurchases().catch(() => []);
  res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" });
  res.end(JSON.stringify(data));
}

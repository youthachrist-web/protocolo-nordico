// Mesma rota /api/download para quando o site corre na Vercel.
import { Readable } from "node:stream";
import { handleDownload } from "../server/download.js";

export default async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  try {
    const out = await handleDownload(url.searchParams);
    res.writeHead(out.status, out.headers);
    if (typeof out.body === "string") return res.end(out.body);
    Readable.fromWeb(out.body).pipe(res);
  } catch (err) {
    console.error("download error", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Erro interno." }));
  }
}

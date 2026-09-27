// Servidor de produção (Railway): serve o site (dist/) e a rota /api/download.
import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { Readable } from "node:stream";
import { handleDownload } from "./server/download.js";

const DIST = join(process.cwd(), "dist");
const PORT = process.env.PORT || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain",
};

function sendFile(res, file) {
  const isAsset = file.startsWith(join(DIST, "assets"));
  res.writeHead(200, {
    "Content-Type": TYPES[extname(file)] || "application/octet-stream",
    "Cache-Control": isAsset ? "public, max-age=31536000, immutable" : "no-cache",
  });
  createReadStream(file).pipe(res);
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/download") {
    try {
      const out = await handleDownload(url.searchParams);
      res.writeHead(out.status, out.headers);
      if (typeof out.body === "string") return res.end(out.body);
      return Readable.fromWeb(out.body).pipe(res);
    } catch (err) {
      console.error("download error", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Erro interno." }));
    }
  }

  let file;
  try {
    file = normalize(join(DIST, decodeURIComponent(url.pathname)));
  } catch {
    file = "";
  }
  if (file.startsWith(DIST) && existsSync(file) && statSync(file).isFile()) {
    return sendFile(res, file);
  }
  // SPA: qualquer outra rota devolve o index.html
  sendFile(res, join(DIST, "index.html"));
}).listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));

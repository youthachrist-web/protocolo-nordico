// Servidor de produção (Railway): serve o site (dist/) e a rota /api/download.
import http from "node:http";
import { createReadStream, createWriteStream, existsSync, mkdirSync, renameSync, statSync } from "node:fs";
import { timingSafeEqual } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { extname, join, normalize } from "node:path";
import { Readable } from "node:stream";
import { handleDownload, PRODUCTS } from "./server/download.js";
import { recentPurchases } from "./server/recent.js";
import { leadsCsv, saveLead } from "./server/leads.js";

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

// Carregar o PDF para o disco privado: PUT /api/admin/upload?produto=protocolo
// com o cabeçalho "Authorization: Bearer <ADMIN_TOKEN>".
// Também aceita ?token= para descarregar a lista de contactos no browser.
function isAdmin(req, url) {
  const token = process.env.ADMIN_TOKEN || "";
  const given = (req.headers.authorization || "").replace(/^Bearer /, "") || url?.searchParams.get("token") || "";
  if (token.length < 32 || given.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(token));
}

async function handleUpload(req, res, url) {
  const produto = url.searchParams.get("produto");
  if (req.method !== "PUT" || !isAdmin(req) || !PRODUCTS[produto]) {
    res.writeHead(403, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Proibido." }));
  }
  const dir = process.env.PDF_DIR || "/data";
  mkdirSync(dir, { recursive: true });
  const tmp = join(dir, `${produto}.pdf.tmp`);
  await pipeline(req, createWriteStream(tmp));
  renameSync(tmp, join(dir, `${produto}.pdf`));
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, bytes: statSync(join(dir, `${produto}.pdf`)).size }));
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/recent-purchases") {
    const data = await recentPurchases().catch(() => []);
    res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" });
    return res.end(JSON.stringify(data));
  }

  if (url.pathname === "/api/lead") {
    try {
      const out = await saveLead(req);
      res.writeHead(out.status, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(out.body));
    } catch (err) {
      console.error("lead error", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Erro interno." }));
    }
  }

  if (url.pathname === "/api/admin/leads") {
    if (req.method !== "GET" || !isAdmin(req, url)) {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Proibido." }));
    }
    res.writeHead(200, {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="contactos-quiz.csv"',
      "Cache-Control": "no-store",
    });
    return res.end(leadsCsv());
  }

  if (url.pathname === "/api/admin/upload") {
    try {
      return await handleUpload(req, res, url);
    } catch (err) {
      console.error("upload error", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Erro interno." }));
    }
  }

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

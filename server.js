// Servidor de produção (Railway): serve o site (dist/) e a rota /api/download.
import http from "node:http";
import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, statSync } from "node:fs";
import { brotliCompressSync, gzipSync, constants as zlibConstants } from "node:zlib";
import { timingSafeEqual } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { extname, join, normalize } from "node:path";
import { Readable } from "node:stream";
import { handleDownload, PRODUCTS } from "./server/download.js";
import { recentPurchases } from "./server/recent.js";
import { leadsCsv, saveLead } from "./server/leads.js";
import { recoverAccess } from "./server/acesso.js";

const DIST = join(process.cwd(), "dist");
const PORT = process.env.PORT || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain",
};

// Compressão (brotli/gzip) dos ficheiros de texto, guardada em memória:
// o código do site passa de ~870 KB para ~100 KB no telemóvel.
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".svg", ".txt"]);
const compressed = new Map();

function pickEncoding(req) {
  const accept = String(req.headers["accept-encoding"] || "");
  if (/\bbr\b/.test(accept)) return "br";
  if (/\bgzip\b/.test(accept)) return "gzip";
  return null;
}

function compressedBody(file, encoding) {
  const key = `${encoding}:${file}`;
  const mtime = statSync(file).mtimeMs;
  const hit = compressed.get(key);
  if (hit && hit.mtime === mtime) return hit.body;
  const raw = readFileSync(file);
  const body =
    encoding === "br"
      ? brotliCompressSync(raw, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 9 } })
      : gzipSync(raw, { level: 9 });
  compressed.set(key, { mtime, body });
  return body;
}

function sendFile(req, res, file) {
  const isAsset = file.startsWith(join(DIST, "assets"));
  const ext = extname(file);
  const headers = {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Cache-Control": isAsset
      ? "public, max-age=31536000, immutable"
      : file.startsWith(join(DIST, "img"))
        ? "public, max-age=604800"
        : "no-cache",
  };
  const encoding = COMPRESSIBLE.has(ext) ? pickEncoding(req) : null;
  if (encoding) {
    const body = compressedBody(file, encoding);
    res.writeHead(200, { ...headers, "Content-Encoding": encoding, Vary: "Accept-Encoding", "Content-Length": body.length });
    return res.end(body);
  }
  res.writeHead(200, headers);
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

// Domínio próprio: quem chega pelo endereço antigo do Railway (anúncios,
// links da Stripe) é reencaminhado para o mesmo caminho em protocolonordico.com,
// mantendo as UTMs e o session_id. As rotas /api ficam como estão.
const CANONICAL_HOST = process.env.CANONICAL_HOST || "protocolonordico.com";

function redirectToCanonical(req, res, url) {
  const host = String(req.headers.host || "").toLowerCase();
  if (!CANONICAL_HOST || !host.endsWith(".up.railway.app")) return false;
  if (req.method !== "GET" && req.method !== "HEAD") return false;
  if (url.pathname.startsWith("/api/")) return false;
  res.writeHead(301, { Location: `https://${CANONICAL_HOST}${url.pathname}${url.search}`, "Cache-Control": "no-cache" });
  res.end();
  return true;
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (redirectToCanonical(req, res, url)) return;

  if (url.pathname === "/api/recent-purchases") {
    const data = await recentPurchases().catch(() => []);
    res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" });
    return res.end(JSON.stringify(data));
  }

  if (url.pathname === "/api/acesso") {
    try {
      const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
      const out = await recoverAccess(req, ip);
      res.writeHead(out.status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
      return res.end(JSON.stringify(out.body));
    } catch (err) {
      console.error("acesso error", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Erro interno." }));
    }
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
    return sendFile(req, res, file);
  }
  // SPA: qualquer outra rota devolve o index.html
  sendFile(req, res, join(DIST, "index.html"));
}).listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));

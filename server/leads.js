// Contactos do quiz: guardados no disco privado do Railway (PDF_DIR, /data),
// nunca no repositório (é público). Um contacto por linha em leads.jsonl.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MAX_BODY = 16 * 1024;
const FIELDS = ["nome", "email", "ddi", "telefone", "cidade", "desafio"];

function leadsFile(env = process.env) {
  const dir = env.PDF_DIR || "/data";
  mkdirSync(dir, { recursive: true });
  return join(dir, "leads.jsonl");
}

function clean(v, max = 200) {
  return String(v ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error("too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

// POST /api/lead
export async function saveLead(req, env = process.env) {
  if (req.method !== "POST") return { status: 405, body: { error: "Método não permitido." } };
  let data;
  try {
    data = await readJson(req);
  } catch {
    return { status: 400, body: { error: "Pedido inválido." } };
  }
  const lead = { data: new Date().toISOString() };
  for (const f of FIELDS) lead[f] = clean(data?.[f]);
  if (!lead.email.includes("@") && lead.telefone.replace(/\D/g, "").length < 6) {
    return { status: 400, body: { error: "Contacto em falta." } };
  }
  const answers = {};
  for (const [k, v] of Object.entries(data?.answers || {}).slice(0, 20)) answers[clean(k, 40)] = clean(v, 100);
  lead.respostas = answers;
  // Prova do consentimento explícito (respostas com dados de saúde)
  lead.consentimento = data?.consent === true;
  for (const k of ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term"]) {
    if (data?.utms?.[k]) lead[k] = clean(data.utms[k]);
  }
  appendFileSync(leadsFile(env), JSON.stringify(lead) + "\n");
  return { status: 200, body: { ok: true } };
}

function csvCell(v) {
  const s = String(v ?? "");
  // Evita fórmulas ao abrir no Excel
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

// Oferta do diagnóstico: o checkout aberto até 15 minutos depois de deixar o
// email no quiz (com o mesmo email) recebe o guia Controlo Total grátis.
// O minuto extra cobre a diferença entre relógios.
export const QUIZ_OFFER_SECONDS = 15 * 60 + 60;

export function quizBonusApplies(email, createdSec, env = process.env) {
  const e = String(email || "").trim().toLowerCase();
  if (!e || !createdSec) return false;
  const file = leadsFile(env);
  if (!existsSync(file)) return false;
  return readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .some((l) => {
      try {
        const r = JSON.parse(l);
        if (String(r.email || "").trim().toLowerCase() !== e) return false;
        const at = Date.parse(r.data) / 1000;
        return createdSec >= at && createdSec <= at + QUIZ_OFFER_SECONDS;
      } catch {
        return false;
      }
    });
}

// GET /api/admin/leads → CSV com todos os contactos
export function leadsCsv(env = process.env) {
  const file = leadsFile(env);
  const rows = existsSync(file)
    ? readFileSync(file, "utf8").split("\n").filter(Boolean).map((l) => {
        try { return JSON.parse(l); } catch { return null; }
      }).filter(Boolean)
    : [];
  const cols = ["data", ...FIELDS, "utm_campaign", "utm_medium", "utm_content", "consentimento", "respostas"];
  const lines = [cols.join(";")];
  for (const r of rows) {
    lines.push(cols.map((c) => csvCell(c === "respostas" ? JSON.stringify(r.respostas || {}) : c === "consentimento" ? (r.consentimento ? "sim" : "") : r[c])).join(";"));
  }
  return "﻿" + lines.join("\n");
}

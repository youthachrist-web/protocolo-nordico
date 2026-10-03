// Email de recuperação automático para contactos do quiz que não compraram.
//
// Funciona só com RESEND_API_KEY definida (Railway → Variables). Sem a chave,
// não faz nada. Envia uma única vez, a quem deu consentimento no quiz, depois
// de EMAIL_DELAY_MIN minutos (padrão 120) e só se não houver compra paga na
// Stripe com esse email. Quem pedir para sair deixa de receber.
//
// Variáveis: RESEND_API_KEY, EMAIL_FROM (padrão Gonçalo <contacto@protocolonordico.com>),
// EMAIL_REPLY_TO, EMAIL_DELAY_MIN, SITE_URL (padrão https://protocolonordico.com).

import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createHmac, timingSafeEqual } from "node:crypto";
import { join } from "node:path";

const MAX_AGE_DAYS = 7;
const CHECK_EVERY_MS = 10 * 60 * 1000;

function dataDir(env) {
  const dir = env.PDF_DIR || "/data";
  mkdirSync(dir, { recursive: true });
  return dir;
}

function readJsonl(file) {
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

const norm = (e) => String(e || "").trim().toLowerCase();

function unsubToken(email, env) {
  return createHmac("sha256", env.ADMIN_TOKEN || "pn").update(norm(email)).digest("hex").slice(0, 32);
}

export function unsubscribeUrl(email, env = process.env) {
  const site = env.SITE_URL || "https://protocolonordico.com";
  return `${site}/api/sair?e=${encodeURIComponent(norm(email))}&t=${unsubToken(email, env)}`;
}

// ---- Copy (texto aprovado; só o link aponta para o domínio) ----

export function recoveryEmail(email, env = process.env) {
  const site = env.SITE_URL || "https://protocolonordico.com";
  const link = `${site}/vitalidade?utm_source=email&utm_medium=leads&utm_campaign=recuperacao-quiz`;
  const subject = "Há uma coisa nas suas respostas que me chamou a atenção";
  const preheader = "A maioria dos homens nunca liga estas duas coisas…";

  const text = `Há uma ligação entre a firmeza e o tempo que aguenta, e quase nenhum homem a conhece.

Vou explicar já. Primeiro:

Olá,

Obrigado por ter respondido à análise do Protocolo Nórdico. Li as suas respostas e quero ser direto consigo, porque sei que este não é um tema de que se fale à vontade.

Talvez reconheça algum destes momentos:

– Começa bem, mas a meio sente que está a perder firmeza, e a cabeça já não está ali, está a pensar "outra vez não".
– Ou acontece o contrário: termina antes do que queria, e fica aquele silêncio desconfortável a seguir.
– Começa a evitar a intimidade sem dar por isso. Um "estou cansado" aqui, um "amanhã" ali.
– E as ereções matinais, que antes eram certas, agora aparecem de vez em quando.

Se se reviu em pelo menos um, quero que saiba isto: não é falta de virilidade, e não é "da idade".

A ligação de que lhe falei

A firmeza e o controlo dependem dos mesmos músculos: o pavimento pélvico. É ele que mantém o sangue no sítio durante a ereção e que segura a ejaculação quando está perto do limite.

Quando esse músculo enfraquece (pouco movimento, stress, sono mau, anos sentado), acontecem as duas coisas ao mesmo tempo: perde firmeza e perde controlo. Por isso tantos homens têm os dois problemas e acham que são coisas separadas.

E aqui está a parte boa: este músculo treina-se, como qualquer outro.

Num estudo publicado em 2014 (Pastore et al.), 82,5% dos homens com ejaculação precoce ganharam controlo em 12 semanas, só com treino do pavimento pélvico. Sem comprimidos.

O que acontece se não fizer nada?

Raramente melhora sozinho. O mais comum é a ansiedade crescer: quanto mais medo de falhar, mais falha. E a distância na relação vai aumentando, em silêncio.

Não lhe digo isto para o assustar. Digo-o porque o momento mais fácil para mudar é agora, antes de se tornar um hábito.

O que fazer, passo a passo

Juntei tudo no Protocolo Nórdico: um plano de 28 dias, 15 minutos por dia, que trabalha as 3 coisas que mais pesam:

✔ Pavimento pélvico e técnicas de controlo (pausa, compressão, respiração)
✔ Circulação: alimentos, movimento e rotinas que apoiam a firmeza
✔ Sono e recuperação: a base da energia e da testosterona

É um PDF que lê no telemóvel, em privado. Sem consultas embaraçosas, sem caixas em casa, sem ninguém saber.

Quanto custa

Menos do que um almoço: €9,98, pagamento único (antes €16,49). Paga por MB WAY, Multibanco ou cartão.
No checkout pode ainda juntar o guia Controlo Total, dedicado à ejaculação precoce, por mais €4,99.

E se não resultar consigo?

Tem 30 dias de garantia. Faça o protocolo. Se não sentir diferença, escreva-me e devolvo-lhe o dinheiro todo. Sem perguntas.
O risco é todo meu.

👉 Quero começar hoje:
${link}

Daqui a 28 dias pode estar exatamente como está hoje, ou pode olhar para trás e perceber que foi aqui que mudou.

A decisão é sua.

Um abraço,
Gonçalo
Protocolo Nórdico

P.S. Se tiver alguma dúvida, responda a este email. Leio todas as mensagens pessoalmente.

Recebeu este email porque fez a análise no nosso site. Se não quiser receber mais, responda "sair".
`;

  // HTML: o mesmo texto, parágrafo a parágrafo, com os destaques e o botão.
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const bold = new Set([
    "A ligação de que lhe falei",
    "O que acontece se não fizer nada?",
    "O que fazer, passo a passo",
    "Quanto custa",
    "E se não resultar consigo?",
  ]);
  const blocks = text.trim().split(/\n\n+/);
  const html = `<!doctype html><html lang="pt"><body style="margin:0;background:#f6f3ec;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<div style="max-width:560px;margin:0 auto;padding:28px 22px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.6;color:#22211d;background:#ffffff;">
${blocks
  .map((b, i) => {
    if (b.startsWith("👉")) {
      return `<p style="margin:28px 0;text-align:center;"><a href="${link}" style="display:inline-block;background:#c9a24d;color:#1b1a17;text-decoration:none;font-family:Arial,sans-serif;font-weight:bold;font-size:16px;padding:15px 26px;border-radius:999px;">👉 Quero começar hoje</a></p>`;
    }
    const inner = esc(b).replace(/\n/g, "<br>");
    if (i === 0) return `<p style="margin:0 0 18px;font-size:20px;font-weight:bold;">${inner}</p>`;
    if (bold.has(b)) return `<p style="margin:26px 0 8px;font-weight:bold;">${inner}</p>`;
    if (b.startsWith("Recebeu este email")) {
      return `<p style="margin:28px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#8a8780;">${inner}<br><a href="${unsubscribeUrl(email, env)}" style="color:#8a8780;">Deixar de receber</a></p>`;
    }
    return `<p style="margin:0 0 16px;">${inner}</p>`;
  })
  .join("\n")}
</div></body></html>`;

  return { subject, text, html };
}

// ---- Envio ----

async function hasPaidPurchase(email, env) {
  if (!env.STRIPE_SECRET_KEY) return false;
  const res = await fetch(
    `https://api.stripe.com/v1/checkout/sessions?limit=10&status=complete&customer_details[email]=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
  );
  if (!res.ok) throw new Error(`stripe ${res.status}`);
  const { data = [] } = await res.json();
  return data.some((s) => s.payment_status === "paid");
}

async function sendWithResend(email, env) {
  const { subject, text, html } = recoveryEmail(email, env);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM || "Gonçalo · Protocolo Nórdico <contacto@protocolonordico.com>",
      to: [email],
      reply_to: env.EMAIL_REPLY_TO || "contacto@protocolonordico.com",
      subject,
      text,
      html,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl(email, env)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });
  if (!res.ok) throw new Error(`resend ${res.status} ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).id;
}

let running = false;

export async function processRecoveryEmails(env = process.env, now = Date.now()) {
  if (!env.RESEND_API_KEY || running) return { skipped: true };
  running = true;
  const dir = dataDir(env);
  const sentFile = join(dir, "emails-enviados.jsonl");
  const out = { sent: 0, bought: 0, errors: 0 };
  try {
    const leads = readJsonl(join(dir, "leads.jsonl"));
    const done = new Set(readJsonl(sentFile).map((r) => norm(r.email)));
    const unsub = new Set(readJsonl(join(dir, "sair.jsonl")).map((r) => norm(r.email)));
    const delay = Number(env.EMAIL_DELAY_MIN || 120) * 60 * 1000;

    for (const lead of leads) {
      const email = norm(lead.email);
      const age = now - Date.parse(lead.data);
      if (!lead.consentimento || !/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)) continue;
      if (done.has(email) || unsub.has(email)) continue;
      if (!(age >= delay && age <= MAX_AGE_DAYS * 86400000)) continue;
      done.add(email);
      try {
        if (await hasPaidPurchase(email, env)) {
          appendFileSync(sentFile, JSON.stringify({ email, data: new Date(now).toISOString(), estado: "comprou" }) + "\n");
          out.bought++;
          continue;
        }
        const id = await sendWithResend(email, env);
        appendFileSync(sentFile, JSON.stringify({ email, data: new Date(now).toISOString(), estado: "enviado", id }) + "\n");
        out.sent++;
      } catch (err) {
        done.delete(email); // tenta outra vez na próxima volta
        out.errors++;
        console.error("email de recuperação falhou", email.replace(/^(.{2}).*@/, "$1***@"), err.message);
      }
    }
  } finally {
    running = false;
  }
  return out;
}

export function startRecoveryEmails(env = process.env) {
  if (!env.RESEND_API_KEY) {
    console.log("Emails de recuperação: desligados (falta RESEND_API_KEY)");
    return;
  }
  console.log("Emails de recuperação: ligados");
  setTimeout(() => processRecoveryEmails(env).catch((e) => console.error(e)), 30_000);
  setInterval(() => processRecoveryEmails(env).catch((e) => console.error(e)), CHECK_EVERY_MS);
}

// GET/POST /api/sair?e=…&t=… → deixa de receber emails
export function unsubscribe(url, env = process.env) {
  const email = norm(url.searchParams.get("e"));
  const given = String(url.searchParams.get("t") || "");
  const want = unsubToken(email, env);
  const ok = email && given.length === want.length && timingSafeEqual(Buffer.from(given), Buffer.from(want));
  if (ok) appendFileSync(join(dataDir(env), "sair.jsonl"), JSON.stringify({ email, data: new Date().toISOString() }) + "\n");
  const msg = ok
    ? "Pronto. Não voltará a receber emails do Protocolo Nórdico."
    : "Link inválido. Responda ao email com a palavra \"sair\" e tratamos disso.";
  return {
    status: ok ? 200 : 400,
    html: `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:Arial,sans-serif;background:#f6f3ec;color:#22211d;display:flex;min-height:90vh;align-items:center;justify-content:center;padding:20px"><p style="max-width:420px;text-align:center;font-size:17px">${msg}</p></body>`,
  };
}

// Resumo para o painel de administração
export function emailStatus(env = process.env) {
  const dir = dataDir(env);
  const sent = readJsonl(join(dir, "emails-enviados.jsonl"));
  return {
    ligado: Boolean(env.RESEND_API_KEY),
    enviados: sent.filter((r) => r.estado === "enviado").length,
    ja_tinham_comprado: sent.filter((r) => r.estado === "comprou").length,
    sairam: readJsonl(join(dir, "sair.jsonl")).length,
  };
}

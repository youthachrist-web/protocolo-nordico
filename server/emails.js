// Email de recuperação automático para contactos do quiz que não compraram.
//
// Funciona só com RESEND_API_KEY definida (Railway → Variables). Sem a chave,
// não faz nada. Envia uma única vez a cada contacto do quiz (que não recusou), depois
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

const OFFER_HOURS = 48;

function lisbonDeadline(ms) {
  return new Intl.DateTimeFormat("pt-PT", { timeZone: "Europe/Lisbon", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
    .format(new Date(ms))
    .replace(",", " às");
}

export function recoveryEmail(email, env = process.env, sentAt = Date.now()) {
  const deadlineMs = sentAt + OFFER_HOURS * 3600 * 1000;
  const deadline = lisbonDeadline(deadlineMs);
  const site = env.SITE_URL || "https://protocolonordico.com";
  const link = `${site}/vitalidade?utm_source=email&utm_medium=leads&utm_campaign=recuperacao-quiz`;
  const subject = "🚨 Há uma coisa nas suas respostas que me chamou a atenção";
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
Só através deste email, até ${deadline}, o guia Controlo Total, dedicado à ejaculação precoce, vai de oferta (em vez de €4,99). Não precisa de o juntar no checkout: pague com este mesmo email e recebe os dois PDFs.

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

  // HTML com a identidade do site: Lora nos títulos, Poppins no texto,
  // fundo creme, cabeçalho escuro com etiqueta dourada e botão dourado.
  // O texto é o mesmo da versão simples, bloco a bloco.
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const SERIF = "Lora,Georgia,'Times New Roman',serif";
  const SANS = "Poppins,'Helvetica Neue',Helvetica,Arial,sans-serif";
  const DARK = "#1b1b16";
  const GOLD = "#cba655";
  const GOLD_DARK = "#b68940";
  const LIGHT = "#faf7f0";
  const INK = "#2a2a24";
  const MUTED = "#6f6d66";
  const avatar = `${site}/img/goncalo-avatar.jpg`;
  const cover = `${site}/stripe/capa-protocolo.jpg`;
  const headings = new Set([
    "A ligação de que lhe falei",
    "O que acontece se não fizer nada?",
    "O que fazer, passo a passo",
    "Quanto custa",
  ]);
  const p = (inner, extra = "") =>
    `<p style="margin:0 0 18px;font-family:${SANS};font-size:16px;line-height:1.75;color:${INK};${extra}">${inner}</p>`;
  const button = (label) =>
    `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0;"><tr><td align="center">
<a href="${link}" style="display:inline-block;background:${GOLD};color:${DARK};text-decoration:none;font-family:${SANS};font-weight:600;font-size:16px;padding:16px 34px;border-radius:999px;">${label}</a>
</td></tr></table>`;
  const list = (lines, marker) =>
    `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;">${lines
      .map(
        (l) =>
          `<tr><td style="width:30px;vertical-align:top;padding:9px 0 9px 2px;">${marker}</td><td style="font-family:${SANS};font-size:15px;line-height:1.65;color:${INK};padding:6px 0;">${esc(l)}</td></tr>`
      )
      .join("")}</table>`;
  const dot = `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${GOLD};margin-top:8px;"></span>`;
  const check = `<span style="display:inline-block;width:18px;height:18px;line-height:18px;text-align:center;border-radius:50%;border:1px solid ${GOLD};color:${GOLD_DARK};font-family:${SANS};font-size:11px;margin-top:3px;">✓</span>`;

  const blocks = text.trim().split(/\n\n+/);
  const body = blocks
    .map((b, i) => {
      const inner = esc(b).replace(/\n/g, "<br>");
      if (i === 0) {
        return `<p style="margin:0 0 22px;font-family:${SERIF};font-size:26px;line-height:1.3;color:${DARK};">${inner}</p>`;
      }
      if (headings.has(b)) {
        return `<p style="margin:34px 0 12px;font-family:${SERIF};font-size:21px;line-height:1.35;color:${DARK};">${inner}</p>`;
      }
      if (b.startsWith("– ")) {
        return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;background:${LIGHT};border-radius:14px;"><tr><td style="padding:10px 18px;">${list(b.split("\n").map((l) => l.replace(/^–\s*/, "")), dot)}</td></tr></table>`;
      }
      if (b.startsWith("✔")) {
        return list(b.split("\n").map((l) => l.replace(/^✔\s*/, "")), check);
      }
      if (b.startsWith("Se se reviu")) {
        return `<p style="margin:8px 0 0;padding-left:16px;border-left:2px solid ${GOLD};font-family:${SERIF};font-size:19px;line-height:1.5;color:${DARK};">${inner}</p>${button("Quero começar hoje →")}`;
      }
      if (b.startsWith("Num estudo")) {
        return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:6px 0 20px;background:${DARK};border-radius:16px;"><tr><td style="padding:24px 22px;text-align:center;">
<div style="font-family:${SERIF};font-size:44px;line-height:1;color:${GOLD};">82,5%</div>
<div style="margin-top:12px;font-family:${SANS};font-size:14px;line-height:1.65;color:#e9e4d8;">${inner}</div></td></tr></table>`;
      }
      if (b.startsWith("Menos do que um almoço")) {
        return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;border:1px solid #e6dcc4;border-radius:16px;background:#ffffff;"><tr>
<td style="width:104px;padding:16px;vertical-align:middle;"><img src="${cover}" width="88" alt="Protocolo Nórdico" style="display:block;width:88px;border-radius:8px;"></td>
<td style="padding:16px 16px 16px 0;vertical-align:middle;font-family:${SANS};font-size:15px;line-height:1.65;color:${INK};">${inner.replace("€9,98", `<span style="font-family:${SERIF};font-size:24px;color:${DARK};">€9,98</span>`)}</td></tr></table>`;
      }
      if (b.startsWith("E se não resultar consigo?")) {
        // Cartão da oferta com temporizador, antes da garantia
        return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:6px 0 8px;background:${DARK};border-radius:18px;"><tr><td style="padding:24px 20px;text-align:center;">
<div style="font-family:${SANS};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};">Oferta só para si</div>
<div style="margin-top:10px;font-family:${SERIF};font-size:22px;line-height:1.35;color:${LIGHT};">Protocolo Nórdico <span style="color:${GOLD};">€9,98</span><br>+ guia Controlo Total <span style="color:${GOLD};">grátis</span></div>
<div style="margin-top:6px;font-family:${SANS};font-size:13px;color:#b9b4a6;"><s>€16,49 + €4,99</s> · poupa €11,50</div>
<img src="${site}/api/timer.gif?ate=${Math.floor(deadlineMs / 1000)}" width="300" height="76" alt="Termina ${deadline}" style="display:block;margin:18px auto 4px;width:300px;max-width:100%;height:auto;">
<div style="font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8f8a7c;">horas · minutos · segundos</div>
<div style="margin-top:10px;font-family:${SANS};font-size:13px;color:#d9d3c4;">Termina ${deadline} (hora de Lisboa)</div>
</td></tr></table>${button("Quero a oferta →")}
<p style="margin:34px 0 12px;font-family:${SERIF};font-size:21px;line-height:1.35;color:${DARK};">${inner}</p>`;
      }
      if (b.startsWith("Tem 30 dias de garantia")) return p(inner, `background:${LIGHT};border-radius:14px;padding:16px 18px;`);
      if (b.startsWith("👉")) return button("Quero começar hoje →");
      if (b.startsWith("Um abraço")) {
        return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:8px 0 22px;"><tr>
<td style="padding-right:14px;vertical-align:middle;"><img src="${avatar}" width="56" height="56" alt="Gonçalo" style="display:block;width:56px;height:56px;border-radius:50%;object-fit:cover;"></td>
<td style="vertical-align:middle;font-family:${SANS};font-size:15px;line-height:1.55;color:${INK};">${inner.replace("Gonçalo", `<span style="font-family:${SERIF};font-size:17px;color:${DARK};">Gonçalo</span>`)}</td></tr></table>`;
      }
      if (b.startsWith("P.S.")) return p(inner, `font-size:14px;color:${MUTED};`);
      if (b.startsWith("Recebeu este email")) {
        return `<p style="margin:26px 0 0;padding-top:18px;border-top:1px solid #ece6d8;font-family:${SANS};font-size:11px;line-height:1.6;color:#9a978e;">${inner}<br><a href="${unsubscribeUrl(email, env)}" style="color:#9a978e;">Deixar de receber</a></p>`;
      }
      return p(inner);
    })
    .join("\n");

  const html = `<!doctype html><html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light">
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=Poppins:wght@400;600&display=swap" rel="stylesheet"></head>
<body style="margin:0;padding:0;background:${LIGHT};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${LIGHT};"><tr><td align="center" style="padding:20px 10px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
<tr><td style="background:${DARK};padding:22px 24px;border-radius:18px 18px 0 0;">
<table role="presentation" cellspacing="0" cellpadding="0"><tr>
<td style="padding-right:14px;vertical-align:middle;"><img src="${avatar}" width="48" height="48" alt="Gonçalo" style="display:block;width:48px;height:48px;border-radius:50%;object-fit:cover;border:1px solid ${GOLD};"></td>
<td style="vertical-align:middle;"><div style="font-family:${SANS};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};">Lembrete · a sua análise</div>
<div style="margin-top:3px;font-family:${SERIF};font-size:18px;color:${LIGHT};">Gonçalo · Protocolo Nórdico</div></td></tr></table></td></tr>
<tr><td style="background:#ffffff;padding:28px 24px 10px;border-radius:0 0 18px 18px;">
${body}
</td></tr></table></td></tr></table></body></html>`;

  return { subject, text, html };
}

// ---- Bónus do email: Controlo Total grátis para quem compra até 48 h depois ----

export function emailBonusApplies(email, createdSec, env = process.env) {
  const e = norm(email);
  if (!e || !createdSec) return false;
  const file = join(dataDir(env), "emails-enviados.jsonl");
  return readJsonl(file).some((r) => {
    if (r.estado !== "enviado" || norm(r.email) !== e) return false;
    const sent = Date.parse(r.data) / 1000;
    return createdSec >= sent && createdSec <= sent + OFFER_HOURS * 3600;
  });
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
  const { subject, text, html } = recoveryEmail(email, env, Date.now());
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
      // Contactos do formulário antigo (sem a caixa) não têm o campo e recebem
      // um único email; nos novos, a caixa de consentimento é obrigatória.
      if (lead.consentimento === false || !/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)) continue;
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

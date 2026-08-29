import { secrets } from "base44:runtime";
import nodemailer from "npm:nodemailer@6.9.8";

export default async function (req) {
  try {
    const body = await req.json();
    const { nome, email, ddi, telefone, cidade, desafio, answers } = body;

    if (!nome || !email) {
      return Response.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 }
      );
    }

    // Limpa os valores (o utilizador pode ter incluído prefixos ou caminhos extra)
    const rawUrl = secrets.get("SUPABASE_URL") || "";
    const supabaseUrl = rawUrl.includes("supabase.co")
      ? rawUrl.split("supabase.co")[0] + "supabase.co"
      : rawUrl.replace(/\/$/, "");
    const supabaseKey = (secrets.get("SUPABASE_KEY") || "").replace(/^SUPABASE_KEY=/, "");
    const smtpUser = (secrets.get("SMTP_USER") || "").replace(/^SMTP_USER=/, "");
    const smtpPass = (secrets.get("SMTP_PASS") || "").replace(/^SMTP_PASS=/, "");

    let supabaseOk = false;
    let emailOk = false;
    let supabaseError = null;
    let emailError = null;

    // 1. Guardar no Supabase (tabela "produtos")
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/produtos`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          nome,
          email,
          telefone: `${ddi} ${telefone}`,
          cidade,
          desafio,
          respostas: JSON.stringify(answers || {}),
          created_at: new Date().toISOString(),
        }),
      });
      supabaseOk = res.ok;
      if (!res.ok) {
        const errText = await res.text();
        supabaseError = `Status ${res.status}: ${errText}`;
      }
    } catch (e) {
      supabaseError = e.message;
    }

    // 2. Enviar email de notificação via Gmail SMTP
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPass },
      });

      const respostasText = Object.entries(answers || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");

      await transporter.sendMail({
        from: smtpUser,
        to: smtpUser,
        subject: `🔥 Novo lead — ${nome}`,
        text: `Novo lead recebido!\n\nNome: ${nome}\nEmail: ${email}\nTelefone: ${ddi} ${telefone}\nCidade: ${cidade}\nMaior desafio: ${desafio}\n\nRespostas do quiz:\n${respostasText}`,
      });
      emailOk = true;
    } catch (e) {
      emailError = e.message;
    }

    return Response.json({ success: true, supabaseOk, emailOk, supabaseError, emailError });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
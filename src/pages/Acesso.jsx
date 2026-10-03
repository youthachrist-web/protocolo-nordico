import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import Footer from "@/components/protocolo/Footer";
import { pixelProducts } from "@/lib/quizData";

// Recuperar a compra pelo email (útil no Multibanco, que é pago mais tarde,
// ou para quem fechou a página de obrigado).
export default function Acesso() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Não foi possível verificar agora.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-pn-light">
      <section className="bg-pn-dark pn-grain min-h-[70dvh] px-5 py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <div className="pn-eyebrow mb-3">A minha compra</div>
          <h1 className="pn-serif text-3xl text-pn-light">Descarregar o seu PDF</h1>
          <p className="mt-4 text-sm leading-relaxed text-pn-light/60">
            Indique o email que usou no pagamento. Se pagou por Multibanco, a
            confirmação pode demorar algumas horas depois de pagar a referência.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="o.seu@email.com"
              autoComplete="email"
              inputMode="email"
              className="w-full rounded-lg border border-white/20 bg-white px-4 py-3 text-[0.95rem] text-pn-ink outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-pn-gold px-6 py-4 text-sm font-semibold text-pn-dark transition-transform active:scale-95 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Procurar a minha compra
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

          {result && (
            <div className="mt-8 space-y-3">
              {result.compras.map((c) => (
                <Link
                  key={c.session_id}
                  to={`/obrigado?produto=${c.produto}&session_id=${encodeURIComponent(c.session_id)}`}
                  className="flex items-center justify-between rounded-2xl border border-pn-gold/30 bg-white/5 p-5 text-pn-light"
                >
                  <span className="text-sm font-semibold">{pixelProducts[c.produto]?.name || c.produto}</span>
                  <span className="flex items-center gap-1 text-xs text-pn-gold">
                    <Download className="h-4 w-4" /> Descarregar
                  </span>
                </Link>
              ))}
              {result.compras.length === 0 && result.pendentes > 0 && (
                <p className="text-sm text-pn-gold">
                  Encontrámos a sua encomenda, mas o pagamento Multibanco ainda não foi
                  confirmado. Volte a tentar daqui a algumas horas.
                </p>
              )}
              {result.compras.length === 0 && !result.pendentes && (
                <p className="text-sm text-pn-light/70">
                  Não encontrámos nenhuma compra com este email. Confirme se é o
                  mesmo email que usou no pagamento.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer variant="dark" />
    </div>
  );
}

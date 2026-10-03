import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, Mail, ArrowLeft, Download, Loader2 } from "lucide-react";
import Footer from "@/components/protocolo/Footer";
import UpsellSection from "@/components/protocolo/UpsellSection";
import { pixelProducts } from "@/lib/quizData";

// Página de retorno do Stripe após o pagamento.
// Configurar no Stripe (Payment Link → After payment → Redirect) para:
//   /obrigado?produto=protocolo&session_id={CHECKOUT_SESSION_ID}
//   /obrigado?produto=ebook&session_id={CHECKOUT_SESSION_ID}
export default function Obrigado() {
  const [params] = useSearchParams();
  const productKey = params.get("produto") === "ebook" ? "ebook" : "protocolo";
  const sessionId = params.get("session_id");
  const product = pixelProducts[productKey];
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [pendingNotice, setPendingNotice] = useState("");
  // "paid" | "pending" (Multibanco por pagar) | "unknown"
  const [status, setStatus] = useState(sessionId ? "checking" : "unknown");
  const [copied, setCopied] = useState(false);

  async function checkStatus() {
    if (!sessionId) return;
    setStatus("checking");
    try {
      const res = await fetch(
        `/api/download?check=1&produto=${productKey}&session_id=${encodeURIComponent(sessionId)}`
      );
      setStatus(res.status === 202 ? "pending" : res.ok ? "paid" : "unknown");
    } catch {
      setStatus("unknown");
    }
  }

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, productKey]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  // O servidor confirma o pagamento na Stripe antes de devolver o PDF
  async function downloadPdf() {
    setDownloading(true);
    setDownloadError("");
    setPendingNotice("");
    try {
      const res = await fetch(
        `/api/download?produto=${productKey}&session_id=${encodeURIComponent(sessionId)}`
      );
      if (res.status === 202) {
        setStatus("pending");
        return;
      }
      if (res.status === 503) {
        // Ficheiro ainda não carregado: a compra está confirmada, o envio é por email
        setPendingNotice(
          "Compra confirmada. O seu ebook será enviado para o email que usou no pagamento nas próximas horas."
        );
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Não foi possível descarregar o ficheiro.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = productKey === "ebook" ? "Controlo-Total.pdf" : "Protocolo-Nordico.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError(err.message);
    } finally {
      setDownloading(false);
    }
  }

  // A compra é enviada à Meta pela UTMify (webhook da Stripe + API de Conversões).

  return (
    <div className="bg-pn-light">
      <section className="bg-pn-dark pn-grain px-6 py-16 text-center md:py-24">
        <div className="mx-auto max-w-2xl">
          {status === "pending" ? (
            <>
              <Clock className="mx-auto h-14 w-14 text-pn-gold" />
              <h1 className="pn-serif mt-6 text-3xl text-pn-light md:text-4xl">
                Encomenda registada. Falta pagar a referência Multibanco.
              </h1>
              <div className="mx-auto mt-6 max-w-md space-y-3 rounded-2xl border border-pn-gold/30 bg-white/5 p-5 text-left text-sm text-pn-light/75">
                <p>1. Pague a referência Multibanco que recebeu no pagamento (entidade, referência e valor) num multibanco ou no homebanking.</p>
                <p>2. Depois de pagar, a confirmação pode demorar algumas horas.</p>
                <p>
                  3. Volte a esta página para descarregar o PDF, ou entre em{" "}
                  <Link to="/acesso" className="text-pn-gold underline">a minha compra</Link>{" "}
                  com o email que usou.
                </p>
              </div>
              <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={checkStatus}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-pn-gold px-6 py-4 text-sm font-semibold text-pn-dark transition-transform active:scale-95"
                >
                  Já paguei, verificar
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-pn-gold/40 px-6 py-4 text-sm font-semibold text-pn-light transition-transform active:scale-95"
                >
                  {copied ? "Link copiado" : "Copiar link desta página"}
                </button>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 className="mx-auto h-14 w-14 text-pn-gold" />
              <h1 className="pn-serif mt-6 text-3xl text-pn-light md:text-4xl">
                {status === "paid" || status === "checking"
                  ? `Pagamento confirmado. Bem-vindo ao ${product.name}.`
                  : `Obrigado pela sua compra do ${product.name}.`}
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm text-pn-light/60">
                Obrigado pela sua confiança. O seu acesso começa agora.
              </p>
            </>
          )}

          {sessionId && status !== "pending" && (
            <div className="mx-auto mt-8 max-w-md">
              <button
                type="button"
                onClick={downloadPdf}
                disabled={downloading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-pn-gold px-6 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Descarregar {product.name} (PDF)
              </button>
              {pendingNotice && (
                <p className="mt-3 text-sm text-pn-gold">{pendingNotice}</p>
              )}
              {downloadError && (
                <p className="mt-3 text-xs text-red-300">{downloadError}</p>
              )}
            </div>
          )}

          {status !== "pending" && (
          <div className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-2xl border border-pn-gold/30 bg-white/5 p-5 text-left">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-pn-gold" />
            <p className="text-sm text-pn-light/75">
              Guarde o PDF no telemóvel ou no computador. O recibo do pagamento
              foi enviado para o email que usou na compra. Em caso de dúvida,
              responda a esse email.
            </p>
          </div>
          )}

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-1 text-xs text-pn-light/50 transition-colors hover:text-pn-gold"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar ao início
          </Link>
        </div>
      </section>

      {productKey === "protocolo" && <UpsellSection />}

      <Footer variant="dark" />
    </div>
  );
}

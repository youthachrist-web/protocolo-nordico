import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, ArrowLeft, Download, Loader2 } from "lucide-react";
import Footer from "@/components/protocolo/Footer";
import UpsellSection from "@/components/protocolo/UpsellSection";
import { pixelProducts } from "@/lib/quizData";
import { trackEvent, trackCustomEvent, productParams } from "@/lib/metaPixel";

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

  // O servidor confirma o pagamento na Stripe antes de devolver o PDF
  async function downloadPdf() {
    setDownloading(true);
    setDownloadError("");
    try {
      const res = await fetch(
        `/api/download?produto=${productKey}&session_id=${encodeURIComponent(sessionId)}`
      );
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

  useEffect(() => {
    // Evita contar a mesma compra duas vezes (refresh / voltar à página)
    const dedupeKey = `pn_purchase_${sessionId || productKey}`;
    try {
      if (localStorage.getItem(dedupeKey)) return;
      localStorage.setItem(dedupeKey, "1");
    } catch {
      // storage indisponível — envia na mesma
    }
    const options = sessionId ? { eventID: sessionId } : undefined;
    // Só o produto principal conta como Purchase (é o evento que a campanha
    // otimiza). O upsell vai num evento próprio para não baixar o CPA falsamente.
    if (productKey === "ebook") {
      trackCustomEvent("CompraUpsell", productParams(product), options);
    } else {
      trackEvent("Purchase", productParams(product), options);
    }
  }, [productKey, sessionId, product]);

  return (
    <div className="bg-pn-light">
      <section className="bg-pn-dark pn-grain px-6 py-16 text-center md:py-24">
        <div className="mx-auto max-w-2xl">
          <CheckCircle2 className="mx-auto h-14 w-14 text-pn-gold" />
          <h1 className="pn-serif mt-6 text-3xl text-pn-light md:text-4xl">
            Pagamento confirmado. Bem-vindo ao {product.name}.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-pn-light/60">
            Obrigado pela sua confiança. O seu acesso começa agora.
          </p>

          {sessionId && (
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
              {downloadError && (
                <p className="mt-3 text-xs text-red-300">{downloadError}</p>
              )}
            </div>
          )}

          <div className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-2xl border border-pn-gold/30 bg-white/5 p-5 text-left">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-pn-gold" />
            <p className="text-sm text-pn-light/75">
              Guarde o PDF no telemóvel ou no computador. O recibo do pagamento
              foi enviado para o email que usou na compra. Em caso de dúvida,
              responda a esse email.
            </p>
          </div>

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

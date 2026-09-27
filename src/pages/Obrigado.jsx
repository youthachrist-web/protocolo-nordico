import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, ArrowLeft } from "lucide-react";
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

          <div className="mx-auto mt-8 flex max-w-md items-start gap-3 rounded-2xl border border-pn-gold/30 bg-white/5 p-5 text-left">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-pn-gold" />
            <p className="text-sm text-pn-light/75">
              Enviámos o recibo e as instruções de acesso para o email que
              usou no pagamento. Se não o encontrar em alguns minutos,
              verifique a pasta de spam ou promoções.
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

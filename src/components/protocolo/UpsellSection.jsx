import React from "react";
import { Check, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { upsellProduct, STRIPE_UPSELL_URL, pixelProducts } from "@/lib/quizData";
import { trackEvent, productParams } from "@/lib/metaPixel";
import { withTracking } from "@/lib/utm";

export default function UpsellSection() {
  return (
    <section className="bg-pn-light py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-pn-gold/30 bg-pn-gold/10 px-4 py-1.5">
            <span className="pn-label text-[10px] text-pn-gold-dark">
              Só nesta página · não volta a aparecer
            </span>
          </div>
          <h2 className="pn-serif mt-4 text-2xl text-pn-ink md:text-3xl">
            {upsellProduct.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-pn-ink/60">
            {upsellProduct.description}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-stretch">
          {/* Conteúdo */}
          <div className="rounded-2xl border border-pn-ink/10 bg-white p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-pn-gold-dark" />
              <span className="pn-label text-xs text-pn-gold-dark">
                Ebook digital
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {upsellProduct.bullets.map((b) => (
                <div key={b} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-pn-gold-dark" />
                  <span className="text-sm text-pn-ink/75">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Oferta */}
          <div className="flex flex-col justify-center rounded-2xl border-2 border-pn-gold bg-pn-dark p-6 text-center pn-grain">
            <div className="pn-label text-[10px] text-pn-light/40">
              Preço de lançamento
            </div>
            <div className="mt-2 flex items-end justify-center gap-3">
              {upsellProduct.oldPrice && (
                <span className="pb-2 text-lg text-pn-light/40 line-through">
                  {upsellProduct.oldPrice}
                </span>
              )}
              <span className="pn-serif text-5xl text-pn-gold">
                {upsellProduct.price}
              </span>
            </div>
            <div className="mt-1 text-xs text-pn-light/40">
              Pagamento único · acesso imediato
            </div>

            <a
              href={withTracking(STRIPE_UPSELL_URL)}
              onClick={() =>
                trackEvent("InitiateCheckout", productParams(pixelProducts.ebook))
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-pn-gold px-6 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
            >
              Sim, quero durar mais por {upsellProduct.price} <ArrowRight className="h-4 w-4" />
            </a>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-pn-light/50">
              <ShieldCheck className="h-3.5 w-3.5 text-pn-gold" />
              Pagamento seguro via Stripe
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-center text-xs text-pn-ink/40">
          Conteúdo educativo. Não substitui acompanhamento médico ou
          psicológico especializado. Consulte um profissional de saúde antes de
          iniciar qualquer protocolo.
        </p>
      </div>
    </section>
  );
}
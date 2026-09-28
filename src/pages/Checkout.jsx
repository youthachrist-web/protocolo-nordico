import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Star,
  ArrowLeft,
} from "lucide-react";
import Footer from "@/components/protocolo/Footer";
import SocialProofPopup from "@/components/protocolo/SocialProofPopup";
import UpsellSection from "@/components/protocolo/UpsellSection";
import CountdownBanner from "@/components/protocolo/CountdownBanner";
import {
  STRIPE_CHECKOUT_URL,
  PRODUCT_PRICE,
  PRODUCT_OLD_PRICE,
  offerPromises,
  whatsIncluded,
  pixelProducts,
} from "@/lib/quizData";
import { trackEvent, productParams } from "@/lib/metaPixel";
import { withTracking } from "@/lib/utm";

export default function Checkout() {
  useEffect(() => {
    trackEvent("ViewContent", productParams(pixelProducts.protocolo));
  }, []);

  return (
    <div className="bg-pn-light">
      <SocialProofPopup />
      <CountdownBanner />

      {/* Voltar */}
      <div className="bg-pn-dark px-6 pt-6">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/resultado"
            className="inline-flex items-center gap-1 text-xs text-pn-light/50 transition-colors hover:text-pn-gold"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar ao meu resultado
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-pn-dark pn-grain px-6 pb-12 pt-4 text-center md:pb-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="pn-serif text-3xl text-pn-light md:text-4xl">
            🔥 Hoje à noite pode ser diferente.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-pn-light/60">
            Firmeza, controlo e vontade não voltam sozinhos. O Protocolo Nórdico
            dá-lhe o plano de 28 dias, passo a passo — por menos do que um jantar fora.
          </p>
        </div>
      </section>

      {/* O que está incluído */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-3">O que recebe hoje</div>
            <h2 className="pn-serif text-2xl text-pn-ink md:text-3xl">
              ✨ Tudo incluído no seu acesso
            </h2>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {whatsIncluded.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-pn-ink/10 bg-white p-4"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pn-gold/15">
                  <Check className="h-3.5 w-3.5 text-pn-gold-dark" />
                </div>
                <span className="text-sm text-pn-ink/75">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promessas */}
      <section className="bg-pn-light py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-3">A nossa promessa</div>
            <h2 className="pn-serif text-2xl text-pn-ink md:text-3xl">
              🛡️ Risco zero para si
            </h2>
          </div>
          <div className="mt-8 space-y-4">
            {offerPromises.map((p) => (
              <div
                key={p}
                className="flex items-center gap-3 rounded-xl border border-pn-gold/20 bg-white p-5"
              >
                <ShieldCheck className="h-5 w-5 shrink-0 text-pn-gold-dark" />
                <span className="text-sm font-medium text-pn-ink/80">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oferta principal / checkout */}
      <section className="bg-pn-dark py-16 md:py-24 pn-grain">
        <div className="mx-auto max-w-lg px-6 text-center">
          <div className="pn-eyebrow mb-4">⏰ A sua oferta</div>
          <div className="rounded-3xl border border-pn-gold/30 bg-white/5 p-8">
            <div className="pn-label text-[10px] text-pn-light/40">
              Oferta de lançamento · −39%
            </div>
            <div className="mt-3 flex items-end justify-center gap-3">
              <span className="pb-2 text-lg text-pn-light/40 line-through">
                {PRODUCT_OLD_PRICE}
              </span>
              <span className="pn-serif text-6xl text-pn-gold">
                {PRODUCT_PRICE}
              </span>
            </div>
            <div className="mt-1 text-xs text-pn-light/40">
              Pagamento único · acesso imediato
            </div>

            <div className="my-6 h-px bg-white/10" />

            <div className="space-y-2.5 text-left">
              {whatsIncluded.slice(0, 6).map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-pn-gold" />
                  <span className="text-xs text-pn-light/70">{item}</span>
                </div>
              ))}
            </div>

            <a
              href={withTracking(STRIPE_CHECKOUT_URL)}
              onClick={() =>
                trackEvent("InitiateCheckout", productParams(pixelProducts.protocolo))
              }
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-pn-gold px-6 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
            >
              Quero recuperar o controlo por {PRODUCT_PRICE}{" "}
              <ArrowRight className="h-4 w-4" />
            </a>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-pn-light/50">
              <ShieldCheck className="h-3.5 w-3.5 text-pn-gold" />
              Pagamento seguro via Stripe
            </div>

            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-pn-light/40">
              <Star className="h-3 w-3 fill-pn-gold text-pn-gold" />
              <span className="ml-1">
                Garantia de 30 dias · se não sentir diferença, devolvemos o dinheiro
              </span>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-sm text-xs leading-relaxed text-pn-light/40">
            Conteúdo educativo. Não substitui aconselhamento médico. Consulte um
            profissional de saúde antes de iniciar qualquer protocolo de
            treino, nutrição ou suplementação.
          </p>
        </div>
      </section>

      {/* Upsell — ebook */}
      <UpsellSection />

      <Footer variant="dark" />
    </div>
  );
}
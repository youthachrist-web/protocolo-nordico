import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Gift, ShieldCheck } from "lucide-react";
import {
  STRIPE_CHECKOUT_URL,
  PRODUCT_PRICE,
  PRODUCT_OLD_PRICE,
  whatsIncluded,
  howItWorks,
  bonuses,
  guaranteeText,
} from "@/lib/quizData";
import { withTracking } from "@/lib/utm";
import BuyButton from "@/components/protocolo/BuyButton";

// Bloco completo da oferta: como funciona → o que vem dentro → bónus →
// preço com âncora → garantia explicada. Usado na página inicial e na /vitalidade.
export default function OfferSection({ showBuy = false }) {
  const mainItems = whatsIncluded.filter(
    (i) => !bonuses.some((b) => i.toLowerCase().includes(b.title.split(" ")[0].toLowerCase()))
  );

  return (
    <>
      {/* Como funciona */}
      <section className="bg-pn-light py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-4">Como funciona</div>
            <h2 className="pn-serif text-3xl text-pn-ink md:text-4xl">Três passos. Começa hoje.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {howItWorks.map((s) => (
              <div key={s.step} className="rounded-2xl border border-pn-ink/10 bg-white p-6">
                <div className="pn-serif flex h-11 w-11 items-center justify-center rounded-full bg-pn-gold text-lg text-pn-dark">
                  {s.step}
                </div>
                <h3 className="pn-serif mt-4 text-lg text-pn-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pn-ink/60">{s.text}</p>
              </div>
            ))}
          </div>
          {showBuy && <BuyButton tone="light" className="mt-10" />}
          <div className={showBuy ? "mt-4 text-center" : "mt-10 text-center"}>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-pn-ink px-7 py-4 text-sm font-semibold text-pn-light transition-transform hover:scale-[1.02] active:scale-95"
            >
              Fazer o teste gratuito <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Oferta */}
      <section id="oferta" className="scroll-mt-4 bg-pn-dark py-16 md:py-24 pn-grain">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-4">O que recebe</div>
            <h2 className="pn-serif text-3xl text-pn-light md:text-4xl">
              Tudo o que precisa para os próximos 28 dias.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
            {/* Conteúdo + bónus */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="pn-label mb-4 text-[11px] text-pn-gold">Dentro do protocolo</div>
                <div className="space-y-3">
                  {mainItems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-pn-gold" />
                      <span className="text-sm text-pn-light/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-pn-gold/30 bg-pn-gold/10 p-6">
                <div className="pn-label mb-4 flex items-center gap-2 text-[11px] text-pn-gold">
                  <Gift className="h-4 w-4" /> Bónus incluídos
                </div>
                <div className="space-y-4">
                  {bonuses.map((b) => (
                    <div key={b.title}>
                      <div className="text-sm font-semibold text-pn-light">{b.title}</div>
                      <div className="text-sm text-pn-light/60">{b.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preço */}
            <div className="rounded-3xl border border-pn-gold/40 bg-white/5 p-8 text-center md:sticky md:top-6">
              <div className="pn-label text-[10px] text-pn-light/40">Oferta de lançamento · −39%</div>
              <div className="mt-3 text-sm text-pn-light/50">
                Preço normal <span className="line-through">{PRODUCT_OLD_PRICE}</span>
              </div>
              <div className="pn-serif mt-1 text-6xl text-pn-gold">{PRODUCT_PRICE}</div>
              <div className="mt-2 text-xs text-pn-light/50">
                Pagamento único · sem mensalidades · acesso imediato
              </div>

              <a
                href={withTracking(STRIPE_CHECKOUT_URL)}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-pn-gold px-6 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
              >
                Comprar o protocolo por {PRODUCT_PRICE} <ArrowRight className="h-4 w-4" />
              </a>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-pn-light/50">
                <ShieldCheck className="h-3.5 w-3.5 text-pn-gold" /> Pagamento seguro via Stripe
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-pn-dark/60 p-4 text-left">
                <div className="flex items-center gap-2 text-sm font-semibold text-pn-light">
                  <ShieldCheck className="h-4 w-4 text-pn-gold" /> Garantia de 30 dias
                </div>
                <p className="mt-2 text-xs leading-relaxed text-pn-light/60">{guaranteeText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

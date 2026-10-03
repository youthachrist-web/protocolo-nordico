import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { STRIPE_CHECKOUT_URL, PRODUCT_PRICE, PRODUCT_OLD_PRICE } from "@/lib/quizData";
import { withTracking } from "@/lib/utm";

// Botão de compra direto para a Stripe (com UTMs), com preço e âncora.
// tone="dark" para secções escuras, "light" para secções claras.
export default function BuyButton({ tone = "light", showPrice = true, label, className = "" }) {
  const dark = tone === "dark";
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {showPrice && (
        <div className={`flex items-baseline gap-2 text-sm ${dark ? "text-pn-light/50" : "text-pn-ink/50"}`}>
          <span className="line-through">{PRODUCT_OLD_PRICE}</span>
          <span className={`pn-serif text-2xl ${dark ? "text-pn-gold" : "text-pn-ink"}`}>{PRODUCT_PRICE}</span>
          <span className="text-xs">pagamento único</span>
        </div>
      )}
      <a
        href={withTracking(STRIPE_CHECKOUT_URL)}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-pn-gold px-8 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
      >
        {label || `Comprar por ${PRODUCT_PRICE}`} <ArrowRight className="h-4 w-4" />
      </a>
      <div className={`flex items-center justify-center gap-1.5 text-center text-xs ${dark ? "text-pn-light/40" : "text-pn-ink/40"}`}>
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-pn-gold" /> Pagamento seguro · MB WAY, Multibanco ou cartão · Garantia de 30 dias
      </div>
    </div>
  );
}

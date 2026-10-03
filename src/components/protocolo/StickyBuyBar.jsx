import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { STRIPE_CHECKOUT_URL, PRODUCT_PRICE, PRODUCT_OLD_PRICE } from "@/lib/quizData";
import { withTracking } from "@/lib/utm";

// Barra de compra fixa no fundo do ecrã (só telemóvel), visível depois de
// passar o topo da página.
export default function StickyBuyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-pn-gold/30 bg-pn-dark/95 px-4 py-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="leading-tight">
          <div className="text-[11px] text-pn-light/40 line-through">{PRODUCT_OLD_PRICE}</div>
          <div className="pn-serif text-xl text-pn-gold">{PRODUCT_PRICE}</div>
        </div>
        <a
          href={withTracking(STRIPE_CHECKOUT_URL)}
          tabIndex={visible ? 0 : -1}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-pn-gold px-5 py-3 text-sm font-semibold text-pn-dark active:scale-95"
        >
          Comprar agora <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

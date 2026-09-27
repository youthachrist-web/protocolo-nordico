import React from "react";
import { STRIPE_CHECKOUT_URL, pixelProducts } from "@/lib/quizData";
import { trackEvent, productParams } from "@/lib/metaPixel";

export default function Footer({ variant = "light" }) {
  const isDark = variant === "dark";
  return (
    <footer className={isDark ? "bg-pn-dark text-pn-light/70" : "bg-pn-ink text-pn-light/70"}>
      <div className="mx-auto max-w-3xl px-6 py-10 text-center">
        <div className="pn-serif text-lg text-pn-gold mb-4">Protocolo Nórdico</div>

        <div className={`
          mx-auto max-w-2xl rounded-lg border p-4 text-xs leading-relaxed
          ${isDark ? "border-white/10 bg-white/5" : "border-white/10 bg-white/5"}
        `}>
          <p className="text-pn-light/80">
            Este conteúdo é educativo e não substitui aconselhamento médico.
            Consulte um profissional de saúde antes de iniciar qualquer protocolo
            de treino, nutrição ou suplementação, especialmente em caso de
            condições pré-existentes.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-xs text-pn-light/50">
          <div className="flex gap-5">
            <a
              href={STRIPE_CHECKOUT_URL}
              onClick={() =>
                trackEvent("InitiateCheckout", productParams(pixelProducts.protocolo))
              }
              className="hover:text-pn-gold transition-colors">Começar o protocolo</a>
            <a href="/" className="hover:text-pn-gold transition-colors">Início</a>
          </div>
          <p>© {new Date().getFullYear()} Protocolo Nórdico. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
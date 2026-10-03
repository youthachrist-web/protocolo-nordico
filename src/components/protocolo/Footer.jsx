import React from "react";
import { STRIPE_CHECKOUT_URL } from "@/lib/quizData";
import { withTracking } from "@/lib/utm";
import { CONTACT_EMAIL, CONTROLLER_NAME } from "@/lib/legal";

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
              href={withTracking(STRIPE_CHECKOUT_URL)}
              className="hover:text-pn-gold transition-colors">Comprar o protocolo</a>
            <a href="/" className="hover:text-pn-gold transition-colors">Início</a>
            <a href="/acesso" className="hover:text-pn-gold transition-colors">A minha compra</a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <a href="/privacidade" className="hover:text-pn-gold transition-colors">Privacidade</a>
            <a href="/termos" className="hover:text-pn-gold transition-colors">Termos</a>
            <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noreferrer" className="hover:text-pn-gold transition-colors">Livro de Reclamações</a>
          </div>
          <p>
            Contacto: <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-pn-gold transition-colors">{CONTACT_EMAIL}</a>
          </p>
          <p>© {new Date().getFullYear()} Protocolo Nórdico · {CONTROLLER_NAME}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
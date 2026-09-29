import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { lifestyleImages } from "@/lib/quizData";

const COPY = {
  // Página inicial (tráfego orgânico / quiz)
  default: {
    eyebrow: "Para homens 28+ · Protocolo de 28 dias",
    title: "Chega de ereções fracas e de terminar cedo demais.",
    accent: "Recupere o controlo.",
    text: "O método nórdico que ataca as causas — circulação, pavimento pélvico, sono e testosterona — em vez de esconder os sintomas. Sem comprimidos. Sem consultas embaraçosas. Tudo em privado, no seu telemóvel.",
    badge: "+ firmeza · + controlo · + vontade",
  },
  // Página de tráfego pago (sem referências sexuais — políticas da Meta)
  vitalidade: {
    eyebrow: "Para homens 28+ · Protocolo de 28 dias",
    title: "Mais energia, mais força e um sono que recupera.",
    accent: "Com método, não com sorte.",
    text: "Um plano de 28 dias que organiza treino, sono, alimentação e rotina matinal — os hábitos que mais pesam na energia e no desempenho do dia a dia. Sem comprimidos, sem dietas extremas. Tudo no telemóvel.",
    badge: "+ energia · + força · + disposição",
  },
};

export default function Hero({ variant = "default" }) {
  const c = COPY[variant] || COPY.default;
  return (
    <section className="relative overflow-hidden bg-pn-dark pn-grain">
      {/* Soft gold radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 20%, hsl(41 53% 56.5% / 0.18), transparent 70%)"
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Texto */}
          <div className="pn-fade-up">
            <div className="pn-eyebrow mb-5">{c.eyebrow}</div>

            <h1 className="pn-serif text-4xl leading-[1.1] text-pn-light md:text-5xl lg:text-6xl">
              {c.title}
              <span className="block text-pn-gold">{c.accent}</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-pn-light/70 md:text-lg">
              {c.text}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/quiz"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-pn-gold px-7 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
              >
                Fazer o teste gratuito
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-xs text-pn-light/40">7 perguntas · 2 minutos · 100% anónimo</span>
            </div>

            <div className="mt-8 flex items-center gap-4 text-xs text-pn-light/50">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pn-gold" /> Garantia de 30 dias
              </span>
              <a href="#oferta" className="flex items-center gap-1.5 underline-offset-4 hover:text-pn-gold hover:underline">
                <span className="h-1.5 w-1.5 rounded-full bg-pn-gold" /> Ver preço e o que inclui
              </a>
            </div>
          </div>

          {/* Imagem */}
          <div className="relative pn-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-2xl">
              <Image
                src={lifestyleImages.hero}
                alt="Homem com físico definido, representando o resultado do Protocolo Nórdico"
                className="h-full w-full object-cover"
                fittingType="fill"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pn-dark/60 via-transparent to-transparent" />
            </div>
            {/* Cartão flutuante */}
            <div className="absolute -bottom-4 -left-2 rounded-xl border border-pn-gold/30 bg-pn-dark/90 px-4 py-3 backdrop-blur md:left-6">
              <div className="pn-label text-[10px] text-pn-gold">Resultado típico</div>
              <div className="pn-serif text-sm text-pn-light">{c.badge}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { lifestyleImages } from "@/lib/quizData";

export default function Hero() {
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
            <div className="pn-eyebrow mb-5">Protocolo Educativo · 28–40 dias</div>

            <h1 className="pn-serif text-4xl leading-[1.1] text-pn-light md:text-5xl lg:text-6xl">
              Recupere a sua energia
              <span className="block text-pn-gold">de 20 anos</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-pn-light/70 md:text-lg">
              Um protocolo simples de hábitos — sono, treino de força,
              alimentação, luz solar e desempenho sexual — pensado para homens a partir dos 35.
              Sem promessas milagrosas. Apenas disciplina e método.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/quiz"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-pn-gold px-7 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
              >
                Começar o meu diagnóstico
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-xs text-pn-light/40">10 perguntas · 2 minutos · gratuito</span>
            </div>

            <div className="mt-8 flex items-center gap-4 text-xs text-pn-light/50">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pn-gold" /> +12.000 homens
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pn-gold" /> BR · PT · IT
              </span>
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
              <div className="pn-serif text-sm text-pn-light">+ energia, + vontade, + confiança</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
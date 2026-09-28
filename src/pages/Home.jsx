import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Moon, Dumbbell, Sun, Utensils, Zap, Leaf } from "lucide-react";
import { Image } from "@/components/ui/image";
import Hero from "@/components/protocolo/Hero";
import BeforeAfterGallery from "@/components/protocolo/BeforeAfterGallery";
import Footer from "@/components/protocolo/Footer";
import SocialProofPopup from "@/components/protocolo/SocialProofPopup";
import SexualPerformanceSection from "@/components/protocolo/SexualPerformanceSection";
import { lifestyleImages, fruitImages } from "@/lib/quizData";

const pillars = [
  { icon: Moon, title: "😴 Sono e recuperação", desc: "Rotinas que ajudam a regular o seu ritmo e melhorar o descanso." },
  { icon: Dumbbell, title: "💪 Treino de força", desc: "Movimentos simples e eficazes, adaptados ao seu nível atual." },
  { icon: Utensils, title: "🥗 Alimentação", desc: "Organização prática das refeições, sem dietas extremas." },
  { icon: Sun, title: "☀️ Luz solar", desc: "Exposição matinal e noturna para apoiar o seu ciclo natural." },
  { icon: Zap, title: "⚡ Energia e disposição", desc: "Hábitos que sustentam energia ao longo do dia." },
  { icon: Leaf, title: "🌿 Lifestyle", desc: "Pequenos ajustes que se mantêm a longo prazo." }
];

export default function Home() {
  return (
    <div className="bg-pn-light">
      <SocialProofPopup />
      <Hero />

      {/* Problema */}
      <section className="bg-pn-light py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="pn-eyebrow mb-4">Por que tantos homens sentem o mesmo</div>
          <h2 className="pn-serif text-3xl text-pn-ink md:text-4xl">
            🔥 Ela repara. Mesmo quando não diz nada.
            <span className="block text-pn-ink/50">E cada mês que adia, custa mais voltar.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-pn-ink/60">
            O cansaço acumula. A barriga não sai. O sono deixa de restaurar.
            A vontade diminui e, na intimidade, o corpo já não responde como antes.
            Não é falta de vontade — é a ausência de um método claro.
            O Protocolo Nórdico organiza os hábitos que mais influenciam
            a sua energia, recuperação, disposição e desempenho sexual.
          </p>
          <Link
            to="/quiz"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-pn-ink px-7 py-4 text-sm font-semibold text-pn-light transition-transform hover:scale-[1.02] active:scale-95"
          >
            Quero recuperar o controlo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Desempenho sexual + validação */}
      <SexualPerformanceSection />

      {/* Antes e depois */}
      <BeforeAfterGallery />

      {/* Pilares */}
      <section className="bg-pn-dark py-16 md:py-24 pn-grain">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-4">O protocolo</div>
            <h2 className="pn-serif text-3xl text-pn-light md:text-4xl">
              Seis pilares. Um método simples.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-pn-gold/30"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-pn-gold/30 text-pn-gold">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="pn-serif text-lg text-pn-light">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pn-light/60">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alimentação */}
      <section className="bg-pn-light py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="pn-eyebrow mb-4">Alimentação sem extremos</div>
              <h2 className="pn-serif text-3xl text-pn-ink md:text-4xl">
                🥗 Comida real, organizada.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-pn-ink/60">
                Sem dietas impossíveis. O protocolo propõe refeições simples
                com ingredientes acessíveis — proteína, vegetais, boas gorduras
                e carboidratos na medida certa. Sustentável a longo prazo.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-pn-ink/70">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-pn-gold" /> Planilha de refeições práticas</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-pn-gold" /> Substituições flexíveis</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-pn-gold" /> Sem contagem obsessiva de calorias</li>
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={lifestyleImages.meals}
                  alt="Exemplos de refeições do protocolo"
                  className="h-full w-full object-cover"
                  fittingType="fill"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-xl shadow-md">
                  <Image
                    src={fruitImages.berries}
                    alt="Frutas vermelhas frescas — antioxidantes e energia natural"
                    className="h-full w-full object-cover"
                    fittingType="fill"
                  />
                </div>
                <div className="overflow-hidden rounded-xl shadow-md">
                  <Image
                    src={fruitImages.citrus}
                    alt="Frutas cítricas frescas — vitamina C e imunidade"
                    className="h-full w-full object-cover"
                    fittingType="fill"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle */}
      <section className="relative overflow-hidden bg-pn-dark py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(50% 50% at 30% 80%, hsl(41 53% 56.5% / 0.2), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="pn-eyebrow mb-4">Mais que um protocolo</div>
          <h2 className="pn-serif text-3xl text-pn-light md:text-4xl">
            Não é sobre voltar aos 20.
            <span className="block text-pn-gold">É sobre chegar aos 60 com método.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-pn-light/60">
            Disciplina simples, hábitos sustentáveis e clareza sobre o que
            realmente faz diferença. O resto é ruído.
          </p>
          <Link
            to="/quiz"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-pn-gold px-8 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
          >
            Começar o meu diagnóstico <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Timer, HeartPulse, BookOpen, Quote } from "lucide-react";
import { sexualPillars, scienceEvidence, sexualTestimonials } from "@/lib/quizData";

const icons = { ereccao: HeartPulse, controlo: Timer, desejo: Flame };

export default function SexualPerformanceSection() {
  return (
    <>
      {/* Desempenho sexual — o problema */}
      <section className="bg-pn-dark pn-grain py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="pn-eyebrow mb-4">Desempenho sexual masculino</div>
            <h2 className="pn-serif text-3xl text-pn-light md:text-4xl">
              Ereções mais fracas. Terminar cedo demais. Menos vontade.
              <span className="block text-pn-gold">Nada disto é "normal da idade".</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-pn-light/60">
              A ereção depende da circulação. O controlo depende dos músculos do
              pavimento pélvico e do sistema nervoso. O desejo depende do sono,
              do stress e das hormonas. Todos estes fatores respondem aos hábitos
              — e é exatamente isso que o protocolo trabalha, todos os dias.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {sexualPillars.map((p) => {
              const Icon = icons[p.key];
              return (
                <div
                  key={p.key}
                  className="rounded-2xl border border-pn-gold/20 bg-white/5 p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-pn-gold/30 text-pn-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="pn-serif text-xl text-pn-light">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-pn-light/60">{p.why}</p>
                  <ul className="mt-5 space-y-2">
                    {p.works.map((w) => (
                      <li key={w} className="flex items-start gap-2 text-sm text-pn-light/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pn-gold" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-pn-gold px-8 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
            >
              Descobrir o que está a travar o meu desempenho <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Validação — o que diz a ciência */}
      <section className="bg-pn-light py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-4">Validação científica</div>
            <h2 className="pn-serif text-3xl text-pn-ink md:text-4xl">
              Não é opinião. Está nos estudos.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-pn-ink/60">
              Os pilares do protocolo baseiam-se em investigação publicada sobre
              função erétil, controlo da ejaculação e testosterona.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {scienceEvidence.map((s) => (
              <div
                key={s.source}
                className="rounded-2xl border border-pn-ink/10 bg-white p-6"
              >
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-pn-gold-dark" />
                  <div>
                    <div className="text-base font-semibold text-pn-ink">{s.finding}</div>
                    <p className="mt-1 text-sm leading-relaxed text-pn-ink/60">{s.detail}</p>
                    <div className="mt-3 text-xs italic text-pn-ink/40">{s.source}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-pn-ink/40">
            Dificuldades de ereção persistentes podem ser um sinal precoce de
            problemas cardiovasculares. Se o problema é frequente, fale também
            com um médico ou urologista — o protocolo complementa, não substitui,
            o acompanhamento médico.
          </p>
        </div>
      </section>

      {/* Relatos reais de clientes (só aparece quando há relatos) */}
      {sexualTestimonials.length > 0 && (
        <section className="bg-pn-dark pn-grain py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <div className="pn-eyebrow mb-4">Quem já está no protocolo</div>
              <h2 className="pn-serif text-3xl text-pn-light md:text-4xl">
                Mais vontade. Mais controlo. Mais confiança.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {sexualTestimonials.map((t) => (
                <figure
                  key={t.name + t.quote}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <Quote className="h-5 w-5 text-pn-gold" />
                  <blockquote className="mt-3 text-sm leading-relaxed text-pn-light/80">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-4 text-xs text-pn-light/50">
                    {t.name}, {t.age} · {t.city}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

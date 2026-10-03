import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer
} from "recharts";
import { ArrowRight, Check, ShieldCheck, Zap, Moon, Flame, Dumbbell, Leaf, Target } from "lucide-react";
import Footer from "@/components/protocolo/Footer";
import SocialProofPopup from "@/components/protocolo/SocialProofPopup";
import CountdownBanner from "@/components/protocolo/CountdownBanner";
import {
  buildProfile, profileAreas, scienceEvidence,
  PRODUCT_PRICE,
  PRODUCT_OLD_PRICE,
  STRIPE_CHECKOUT_URL,
  sexualTestimonials
} from "@/lib/quizData";
import { withTracking } from "@/lib/utm";

const STORAGE_KEY = "pn_quiz_state";

const benefits = [
  "Ereções mais firmes: treino de circulação e do pavimento pélvico",
  "Mais controlo: técnicas para durar mais, passo a passo",
  "Mais vontade: sono e hábitos que protegem a testosterona",
  "Mais confiança na hora H",
  "Treino e alimentação adaptados ao seu nível",
  "Tudo em privado, no seu telemóvel"
];

const iconMap = { Zap, Moon, Flame, Dumbbell, Leaf, Target };

export default function Resultado() {
  const location = useLocation();
  const [data] = useState(() => {
    // Prioridade 1: estado passado pela navegação do quiz
    if (location.state && (location.state.answers || location.state.lead)) {
      return location.state;
    }
    // Prioridade 2: localStorage (backup)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  // Sem dados — volta ao quiz
  if (data === null) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center bg-pn-light px-6 text-center">
        <p className="pn-serif text-xl text-pn-ink">Ainda não respondeu ao diagnóstico.</p>
        <Link
          to="/quiz"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-pn-gold px-6 py-3 text-sm font-semibold text-pn-dark"
        >
          Começar o diagnóstico <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // data ainda a carregar
  if (data === undefined) return null;

  const nome = data.lead?.nome?.trim()?.split(" ")[0] || "";
  const profile = buildProfile(data.answers || {});

  const chartData = profileAreas.map((a) => ({
    area: a.label,
    value: profile[a.key] ?? 50,
    full: 100
  }));

  // Insights personalizados (educativos)
  const insights = buildInsights(profile, data.answers || {});

  return (
    <div className="bg-pn-light">
      <SocialProofPopup />
      <CountdownBanner />

      {/* Headline personalizada */}
      <section className="bg-pn-dark pn-grain px-6 py-14 text-center md:py-20">
        <div className="mx-auto max-w-2xl pn-fade-up">
          <div className="pn-eyebrow mb-4">📊 Diagnóstico personalizado</div>
          <h1 className="pn-serif text-3xl leading-snug text-pn-light md:text-4xl">
            {nome ? `${nome}, ` : ""}
            as suas respostas mostram o que está a travar a sua firmeza,
            o seu controlo e a sua confiança na intimidade.
          </h1>
          <p className="mt-5 text-sm text-pn-light/50">
            Esta análise é educativa e baseia-se apenas nas respostas que
            forneceu. Não substitui uma avaliação profissional.
          </p>
        </div>
      </section>

      {/* Resumo do perfil */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-3">Resumo do seu perfil</div>
            <h2 className="pn-serif text-2xl text-pn-ink md:text-3xl">
              🎯 Áreas que merecem atenção
            </h2>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-center">
            {/* Gráfico radar */}
            <div className="mx-auto w-full max-w-md">
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={chartData} outerRadius="72%">
                  <PolarGrid stroke="hsl(40 25% 80%)" />
                  <PolarAngleAxis
                    dataKey="area"
                    tick={{ fill: "hsl(60 8% 15.3%)", fontSize: 11, fontFamily: "Poppins" }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="hsl(41 53% 56.5%)"
                    fill="hsl(41 53% 56.5%)"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <p className="mt-2 text-center text-xs text-pn-ink/40">
                Quanto maior, mais atenção a área precisa · escala educativa 0–100
              </p>
            </div>

            {/* Cards de áreas */}
            <div className="grid grid-cols-2 gap-3">
              {profileAreas.map((a) => {
                const Icon = iconMap[a.icon] || Zap;
                const val = profile[a.key] ?? 50;
                return (
                  <div key={a.key} className="rounded-xl border border-pn-ink/10 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-pn-gold-dark" />
                      <span className="text-xs font-medium text-pn-ink/70">{a.label}</span>
                    </div>
                    <div className="pn-serif text-2xl text-pn-ink">{val}<span className="text-sm text-pn-ink/40">/100</span></div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-pn-ink/10">
                      <div className="h-full rounded-full bg-pn-gold" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Insights personalizados */}
      <section className="bg-pn-light py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="pn-eyebrow mb-3">O que identificámos</div>
          <h2 className="pn-serif text-2xl text-pn-ink md:text-3xl">
            💡 Pontos-chave do seu perfil
          </h2>
          <div className="mt-8 space-y-4">
            {insights.map((ins, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-pn-ink/10 bg-white p-5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pn-gold/15 text-pn-gold-dark">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-pn-ink/75">{ins}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios do protocolo */}
      <section className="bg-pn-dark py-16 md:py-24 pn-grain">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-4">Como o protocolo pode ajudar</div>
            <h2 className="pn-serif text-3xl text-pn-light md:text-4xl">
              🏆 Benefícios do Protocolo Nórdico
            </h2>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-pn-gold" />
                <span className="text-sm text-pn-light/80">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ereção e controlo: o que mostram os estudos (+ relatos reais, quando houver) */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-4">Ereção e ejaculação precoce</div>
            <h2 className="pn-serif text-3xl text-pn-ink md:text-4xl">
              O que acontece quando se treina o corpo certo
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-pn-ink/60">
              A firmeza e o controlo dependem dos mesmos músculos: o pavimento
              pélvico. É por isso que o protocolo começa por aí.
            </p>
          </div>
          {/* Relatos reais de clientes (quizData → sexualTestimonials), só com autorização */}
          {sexualTestimonials.length > 0 && (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {sexualTestimonials.map((t) => (
                <figure key={t.name + t.quote} className="rounded-2xl border border-pn-gold/30 bg-white p-6 shadow-sm">
                  <blockquote className="pn-serif text-base leading-relaxed text-pn-ink">“{t.quote}”</blockquote>
                  <figcaption className="mt-3 text-xs text-pn-ink/50">{t.name}, {t.age} · {t.city}</figcaption>
                </figure>
              ))}
            </div>
          )}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {scienceEvidence.slice(0, 3).map((e) => (
              <div key={e.source} className="rounded-2xl border border-pn-ink/10 bg-white p-6 shadow-sm">
                <p className="pn-serif text-lg leading-snug text-pn-ink">{e.finding}</p>
                <p className="mt-3 text-sm leading-relaxed text-pn-ink/60">{e.detail}</p>
                <p className="mt-4 text-xs italic text-pn-ink/40">{e.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oferta */}
      <section className="bg-pn-dark py-16 md:py-24 pn-grain">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="pn-eyebrow mb-4">⏰ A sua oferta</div>
          <h2 className="pn-serif text-3xl text-pn-light md:text-4xl">
            O seu perfil mostra: está na hora de agir.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-pn-light/60">
            Cada semana que passa, o problema instala-se mais. O plano de 28 dias
            ataca circulação, pavimento pélvico, sono e testosterona — em privado, no seu telemóvel.
          </p>

          <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-pn-gold/30 bg-white/5 p-6">
            <div className="pn-label text-[10px] text-pn-light/40">Oferta de lançamento · −39%</div>
            <div className="mt-2 flex items-end justify-center gap-3">
              <span className="pb-2 text-lg text-pn-light/40 line-through">{PRODUCT_OLD_PRICE}</span>
              <span className="pn-serif text-5xl text-pn-gold">{PRODUCT_PRICE}</span>
            </div>
            <div className="mt-1 text-xs text-pn-light/40">Pagamento único · acesso imediato</div>

            <a
              href={withTracking(STRIPE_CHECKOUT_URL)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-pn-gold px-6 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
            >
              Comprar agora por {PRODUCT_PRICE} <ArrowRight className="h-4 w-4" />
            </a>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-pn-light/50">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-pn-gold" />
              Pagamento seguro · MB WAY, Multibanco ou cartão · Garantia de 30 dias
            </div>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  );
}

function buildInsights(profile, answers) {
  const out = [];

  if (answers.ereccao === "Sim, bastante" || answers.ereccao === "Às vezes") {
    out.push("As suas ereções perderam firmeza. Isto quase sempre começa na circulação e no pavimento pélvico — e ambos respondem a treino. Quanto mais cedo começar, mais fácil é recuperar.");
  }

  if (answers.duracao === "Menos de 2 minutos" || answers.duracao === "2 a 5 minutos" || profile.controlo >= 60) {
    out.push("Termina mais cedo do que gostaria. A ejaculação é um reflexo, e reflexos treinam-se: pavimento pélvico, respiração e técnica de pausa. Num estudo, 82,5% dos homens ganharam controlo em 12 semanas.");
  }

  if (answers.manter === "Quase nunca" || answers.manter === "Às vezes") {
    out.push("Perde a ereção a meio. O sangue entra, mas não fica retido — e quem faz esse \"fecho\" são os músculos do pavimento pélvico, que se treinam em poucas semanas.");
  }

  if (answers.travar === "Nunca" || answers.travar === "Raramente") {
    out.push("Não sente o ponto de não retorno a chegar. O protocolo ensina a escala de excitação de 1 a 10, para travar antes de ser tarde.");
  }

  if (answers.matinal === "Quase nunca" || answers.matinal === "Menos do que antes") {
    out.push("Tem menos ereções matinais do que antes — um dos primeiros sinais de circulação ou testosterona em baixo. O protocolo trabalha os dois; se persistir, fale também com o seu médico.");
  }

  if (answers.idade === "45–54" || answers.idade === "55+") {
    out.push("Depois dos 45, a circulação e a testosterona caem mais depressa — mas também respondem bem ao treino e aos hábitos certos.");
  }

  if (out.length === 0) {
    out.push("O seu perfil está equilibrado. O protocolo ajuda a manter a firmeza, o controlo e a energia a longo prazo.");
  }

  return out.slice(0, 5);
}
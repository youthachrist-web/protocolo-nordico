import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer
} from "recharts";
import { ArrowRight, Check, ShieldCheck, Zap, Moon, Flame, Dumbbell, Leaf, Target } from "lucide-react";
import { Image } from "@/components/ui/image";
import Footer from "@/components/protocolo/Footer";
import SocialProofPopup from "@/components/protocolo/SocialProofPopup";
import CountdownBanner from "@/components/protocolo/CountdownBanner";
import {
  buildProfile, profileAreas, transformationImages,
  PRODUCT_PRICE
} from "@/lib/quizData";

const STORAGE_KEY = "pn_quiz_state";

const benefits = [
  "Mais consistência na rotina diária",
  "Melhoria dos hábitos relacionados ao sono",
  "Apoio à energia e disposição ao longo do dia",
  "Melhor estrutura de treino, adaptada ao seu nível",
  "Alimentação mais organizada e sustentável",
  "Recuperação e bem-estar geral"
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
            as suas respostas mostram alguns fatores que podem estar
            relacionados com a sua energia, disposição e recuperação.
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
                Situação atual estimada · escala educativa 0–100
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

      {/* Prova social */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-4">Quem já seguiu o protocolo</div>
            <h2 className="pn-serif text-3xl text-pn-ink md:text-4xl">
              ⭐ Histórias reais de transformação
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {transformationImages.slice(0, 3).map((t) => (
              <div key={t.url} className="overflow-hidden rounded-2xl border border-pn-ink/10 bg-white shadow-sm">
                <div className="aspect-square overflow-hidden">
                  <Image src={t.url} alt={`Transformação — ${t.name}`} className="h-full w-full object-cover" fittingType="fill" />
                </div>
                <div className="p-5">
                  <p className="pn-serif text-base leading-relaxed text-pn-ink">“{t.quote}”</p>
                  <p className="mt-3 text-xs text-pn-ink/50">{t.name}, {t.age} · {t.city}</p>
                </div>
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
            Comece o seu Protocolo Nórdico
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-pn-light/60">
            Acesso completo ao protocolo educativo de 28 a 40 dias.
            Hábitos, treino, sono, alimentação e recuperação — num só método.
          </p>

          <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-pn-gold/30 bg-white/5 p-6">
            <div className="pn-label text-[10px] text-pn-light/40">Preço de lançamento</div>
            <div className="mt-2 flex items-end justify-center gap-2">
              <span className="pn-serif text-5xl text-pn-gold">{PRODUCT_PRICE}</span>
            </div>
            <div className="mt-1 text-xs text-pn-light/40">Pagamento único · acesso imediato</div>

            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-pn-gold px-6 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
            >
              Quero começar o meu Protocolo Nórdico <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-pn-light/50">
              <ShieldCheck className="h-3.5 w-3.5 text-pn-gold" />
              Pagamento seguro via Stripe
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

  if (profile.energia >= 66) {
    out.push("O seu cansaço parece frequente. Hábitos relacionados a sono e exposição à luz podem estar a influenciar a sua energia diária.");
  } else if (profile.energia >= 33) {
    out.push("A sua energia oscila. Pequenos ajustes na rotina matinal e no descanso podem trazer mais estabilidade.");
  } else {
    out.push("A sua energia parece estável. O protocolo pode ajudar a manter e otimizar esse patamar.");
  }

  if (profile.sono >= 66) {
    out.push("A qualidade do seu sono merece atenção. O protocolo inclui rotinas noturnas e de exposição à luz para apoiar o seu ciclo natural.");
  } else if (profile.sono >= 33) {
    out.push("O seu sono é irregular. Hábitos simples à noite podem melhorar a recuperação.");
  }

  if (profile.motivacao >= 50) {
    out.push("Estes fatores parecem afetar o seu humor e motivação. Organizar a rotina costuma trazer clareza e disposição.");
  }

  if (answers.barriga && answers.barriga !== "Não é um problema") {
    out.push("A perda de barriga é uma prioridade para si. O treino de força e a organização alimentar do protocolo são desenhados para apoiar esse objetivo.");
  }

  if (answers.tentativas === "Sim, sem resultado" || answers.tentativas === "Sim, mas o resultado foi temporário") {
    out.push("Já tentou resolver isto antes sem resultado duradouro. O protocolo foca-se em hábitos sustentáveis, não em soluções rápidas.");
  }

  if (answers.disposicao === "Sim, aceito o desafio") {
    out.push("Está disposto a seguir um protocolo com disciplina durante 30 dias — o perfil ideal para tirar o máximo do método.");
  }

  if (out.length === 0) {
    out.push("O seu perfil está equilibrado. O protocolo ajuda a estruturar e sustentar bons hábitos a longo prazo.");
  }

  return out.slice(0, 5);
}
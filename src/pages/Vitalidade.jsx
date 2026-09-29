import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import Hero from "@/components/protocolo/Hero";
import Footer from "@/components/protocolo/Footer";
import SocialProofPopup from "@/components/protocolo/SocialProofPopup";
import OfferSection from "@/components/protocolo/OfferSection";
import FaqSection from "@/components/protocolo/FaqSection";
import { PillarsSection, FoodSection, ClosingSection } from "@/components/protocolo/SharedSections";
import { proofFactsVitalidade } from "@/lib/quizData";

// Página para tráfego pago (Meta Ads).
// Regras: sem referências sexuais, sem fotos de antes/depois, sem frases que
// afirmem ou sugiram uma condição de quem lê ("Você está cansado?").
// O tema de desempenho íntimo fica dentro do quiz.
const evidence = [
  {
    finding: "Uma semana a dormir 5 horas baixa a testosterona 10–15%",
    detail: "Em homens jovens e saudáveis, uma única semana de sono restrito reduziu a testosterona diurna para níveis equivalentes a 10–15 anos de envelhecimento.",
    source: "Leproult R. & Van Cauter E., JAMA, 2011",
  },
];

export default function Vitalidade() {
  return (
    <div className="bg-pn-light">
      <SocialProofPopup facts={proofFactsVitalidade} />
      <Hero variant="vitalidade" />

      {/* Problema — em termos gerais */}
      <section className="bg-pn-light py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="pn-eyebrow mb-4">Porque a energia cai com os anos</div>
          <h2 className="pn-serif text-3xl text-pn-ink md:text-4xl">
            Não é a idade. São os hábitos.
            <span className="block text-pn-ink/50">E os hábitos treinam-se.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-pn-ink/60">
            Sono que não recupera, pouco movimento, refeições desorganizadas e
            dias sem luz natural: é esta combinação que vai tirando energia,
            força e disposição. O Protocolo Nórdico organiza estes hábitos num
            plano simples de 28 dias, passo a passo.
          </p>
          <Link
            to="/quiz"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-pn-ink px-7 py-4 text-sm font-semibold text-pn-light transition-transform hover:scale-[1.02] active:scale-95"
          >
            Fazer o teste gratuito <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <PillarsSection />

      {/* Ciência */}
      <section className="bg-pn-light py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div className="pn-eyebrow mb-4">Validação científica</div>
            <h2 className="pn-serif text-3xl text-pn-ink md:text-4xl">O sono é o primeiro pilar.</h2>
          </div>
          {evidence.map((e) => (
            <div key={e.source} className="mt-10 flex gap-4 rounded-2xl border border-pn-ink/10 bg-white p-6">
              <BookOpen className="mt-1 h-5 w-5 shrink-0 text-pn-gold-dark" />
              <div>
                <div className="pn-serif text-lg text-pn-ink">{e.finding}</div>
                <p className="mt-2 text-sm leading-relaxed text-pn-ink/60">{e.detail}</p>
                <p className="mt-3 text-xs text-pn-ink/40">{e.source}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FoodSection />
      <OfferSection />
      <FaqSection />
      <ClosingSection />

      <Footer variant="dark" />
    </div>
  );
}

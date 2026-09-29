import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/protocolo/Hero";
import BeforeAfterGallery from "@/components/protocolo/BeforeAfterGallery";
import Footer from "@/components/protocolo/Footer";
import SocialProofPopup from "@/components/protocolo/SocialProofPopup";
import SexualPerformanceSection from "@/components/protocolo/SexualPerformanceSection";
import OfferSection from "@/components/protocolo/OfferSection";
import FaqSection from "@/components/protocolo/FaqSection";
import { PillarsSection, FoodSection, ClosingSection } from "@/components/protocolo/SharedSections";

export default function Home() {
  return (
    <div className="bg-pn-light">
      <SocialProofPopup />
      <Hero />

      {/* Problema */}
      <section className="bg-pn-light py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="pn-eyebrow mb-4">Porque é que tantos homens sentem o mesmo</div>
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

      <PillarsSection />
      <FoodSection />
      <OfferSection />
      <FaqSection />
      <ClosingSection />

      <Footer variant="dark" />
    </div>
  );
}
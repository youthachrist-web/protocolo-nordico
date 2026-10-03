import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/lib/quizData";
import BuyButton from "@/components/protocolo/BuyButton";

export default function FaqSection({ showBuy = false }) {
  return (
    <section className="bg-pn-light py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="pn-eyebrow mb-4">Perguntas frequentes</div>
          <h2 className="pn-serif text-3xl text-pn-ink md:text-4xl">Dúvidas antes de começar</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`} className="border-pn-ink/10">
              <AccordionTrigger className="pn-serif text-left text-base text-pn-ink hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-pn-ink/65">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10 text-center">
          {showBuy ? <BuyButton tone="light" /> : (
          <a
            href="#oferta"
            className="inline-flex items-center gap-2 rounded-full bg-pn-gold px-7 py-4 text-sm font-semibold text-pn-dark transition-transform hover:scale-[1.02] active:scale-95"
          >
            Ver a oferta <ArrowRight className="h-4 w-4" />
          </a>
          )}
          <div className="mt-3">
            <Link to="/quiz" className="text-xs text-pn-ink/50 underline-offset-4 hover:underline">
              ou fazer primeiro o teste gratuito
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

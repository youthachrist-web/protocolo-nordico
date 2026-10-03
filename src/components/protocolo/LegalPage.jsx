import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/protocolo/Footer";
import { CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/legal";

// Moldura comum das páginas legais (privacidade, termos).
export function LegalPage({ title, children }) {
  return (
    <div className="bg-pn-light">
      <main className="mx-auto max-w-2xl px-5 py-12 md:py-16">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-pn-ink/50 hover:text-pn-gold-dark">
          <ArrowLeft className="h-3 w-3" /> Protocolo Nórdico
        </Link>
        <h1 className="pn-serif mt-6 text-3xl text-pn-ink md:text-4xl">{title}</h1>
        <p className="mt-2 text-xs text-pn-ink/40">Última atualização: {LEGAL_UPDATED}</p>
        <div className="mt-8 space-y-8 text-[0.95rem] leading-relaxed text-pn-ink/75">{children}</div>
      </main>
      <Footer variant="dark" />
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <section>
      <h2 className="pn-serif mb-3 text-xl text-pn-ink">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function ContactEmail() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-pn-gold-dark underline underline-offset-2">
      {CONTACT_EMAIL}
    </a>
  );
}

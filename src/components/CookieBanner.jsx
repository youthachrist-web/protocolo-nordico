import React, { useEffect, useState } from "react";
import { CONSENT_EVENT, getConsent, initConsent, setConsent } from "@/lib/consent";

// Aviso de cookies compacto no fundo do ecrã. Aceitar e recusar com o mesmo
// destaque visual de tamanho (exigência da CNPD), sem bloquear a página.
export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initConsent();
    const sync = () => setOpen(!getConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-pn-gold/30 bg-pn-dark/95 px-4 py-3 backdrop-blur"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 text-xs leading-relaxed text-pn-light/70">
          Usamos cookies para medir os anúncios e melhorar o site.{" "}
          <a href="/privacidade" className="underline">Saber mais</a>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="flex-1 rounded-full border border-pn-light/25 px-5 py-2.5 text-xs font-semibold text-pn-light/80 sm:flex-none"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="flex-1 rounded-full bg-pn-gold px-5 py-2.5 text-xs font-semibold text-pn-dark sm:flex-none"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}

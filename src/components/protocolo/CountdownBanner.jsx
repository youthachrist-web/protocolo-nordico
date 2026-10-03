import React, { useState } from "react";
import CountdownTimer from "./CountdownTimer";

// Faixa fixa com o prazo real da oferta do diagnóstico. Desaparece quando
// a oferta termina ou se não houver oferta.
export default function CountdownBanner({ offer, onExpire }) {
  const [expired, setExpired] = useState(() => !offer || offer.deadline <= Date.now());
  if (expired) return null;

  return (
    <div className="sticky top-0 z-50 border-b border-pn-gold/20 bg-pn-dark px-4 py-2">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
        <span className="pn-label text-[10px] text-pn-light/80">
          Controlo Total grátis termina em
        </span>
        <CountdownTimer
          deadline={offer.deadline}
          compact
          onExpire={() => {
            setExpired(true);
            onExpire?.();
          }}
        />
      </div>
    </div>
  );
}

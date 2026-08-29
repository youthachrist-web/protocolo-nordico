import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { socialProofData } from "@/lib/quizData";

export default function SocialProofPopup() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    const tick = (show) => {
      if (!mounted) return;
      setVisible(show);
      if (show) {
        setTimeout(() => tick(false), 5000);
      } else {
        setIndex((prev) => (prev + 1) % socialProofData.length);
        setTimeout(() => tick(true), 4000);
      }
    };

    const initial = setTimeout(() => tick(true), 3000);

    return () => {
      mounted = false;
      clearTimeout(initial);
    };
  }, []);

  const item = socialProofData[index];

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl border border-pn-gold/20 bg-white p-3 shadow-lg max-w-[280px]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pn-gold/15">
          <Check className="h-5 w-5 text-pn-gold-dark" />
        </div>
        <div className="text-xs leading-relaxed">
          <p className="font-semibold text-pn-ink">
            {item.name} de {item.city}
          </p>
          <p className="text-pn-ink/60">acabou de comprar o {item.product}</p>
          <p className="text-pn-ink/40">há {item.minutesAgo} min · ✓ Verificado</p>
        </div>
      </div>
    </div>
  );
}
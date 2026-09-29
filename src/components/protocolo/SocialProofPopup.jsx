import React, { useState, useEffect } from "react";
import { Check, BookOpen } from "lucide-react";
import { proofFacts, pixelProducts } from "@/lib/quizData";

// Alterna compras REAIS das últimas 72h (vindas da Stripe, anónimas)
// com factos de estudos publicados. Nada é inventado.
function formatAgo(min) {
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  return h < 24 ? `há ${h} h` : `há ${Math.round(h / 24)} d`;
}

// Só mostramos compras das últimas 6 horas: uma compra "há 18 h" passa a
// ideia de pouca venda. Sem compras recentes, aparecem só os factos.
const MAX_MINUTES = 6 * 60;

export default function SocialProofPopup({ facts = proofFacts }) {
  const [items, setItems] = useState(() => facts.map((f) => ({ type: "fact", ...f })));
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/recent-purchases")
      .then((r) => (r.ok ? r.json() : []))
      .then((purchases) => {
        if (!Array.isArray(purchases)) return;
        const recent = purchases.filter((p) => p.minutesAgo <= MAX_MINUTES);
        if (recent.length === 0) return;
        const buys = recent.map((p) => ({ type: "purchase", ...p }));
        // intercala: compra, facto, compra, facto…
        const mixed = [];
        const factItems = facts.map((f) => ({ type: "fact", ...f }));
        for (let i = 0; i < Math.max(buys.length, factItems.length); i++) {
          if (buys[i]) mixed.push(buys[i]);
          if (factItems[i]) mixed.push(factItems[i]);
        }
        setItems(mixed);
      })
      .catch(() => {});
  }, [facts]);

  useEffect(() => {
    let mounted = true;
    const timers = [];
    const tick = (show) => {
      if (!mounted) return;
      setVisible(show);
      if (show) {
        timers.push(setTimeout(() => tick(false), 6000));
      } else {
        setIndex((prev) => prev + 1);
        timers.push(setTimeout(() => tick(true), 5000));
      }
    };
    timers.push(setTimeout(() => tick(true), 3000));
    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  const item = items[index % items.length];
  if (!item) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-20 opacity-0"
      }`}
    >
      <div className="flex max-w-[290px] items-center gap-3 rounded-xl border border-pn-gold/20 bg-white p-3 shadow-lg">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pn-gold/15">
          {item.type === "purchase" ? (
            <Check className="h-5 w-5 text-pn-gold-dark" />
          ) : (
            <BookOpen className="h-5 w-5 text-pn-gold-dark" />
          )}
        </div>
        <div className="text-xs leading-relaxed">
          {item.type === "purchase" ? (
            <>
              <p className="font-semibold text-pn-ink">
                Nova compra{item.country ? ` · ${item.country}` : ""}
              </p>
              <p className="text-pn-ink/60">{pixelProducts[item.produto]?.name}</p>
              <p className="text-pn-ink/40">{formatAgo(item.minutesAgo)} · compra real</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-pn-ink">{item.title}</p>
              <p className="text-pn-ink/60">{item.text}</p>
              <p className="text-pn-ink/40">{item.source}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

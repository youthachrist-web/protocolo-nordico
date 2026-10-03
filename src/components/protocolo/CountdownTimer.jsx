import React, { useState, useEffect } from "react";

// Contagem decrescente até um prazo real (deadline em ms). Pára no zero.
export default function CountdownTimer({ deadline, compact = false, onExpire }) {
  const left = () => Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  const [timeLeft, setTimeLeft] = useState(left);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = left();
      setTimeLeft(next);
      if (next === 0) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const sizeClasses = compact
    ? "px-2 py-0.5 text-sm"
    : "px-3 py-2 text-2xl sm:text-3xl";
  const colonClasses = compact ? "text-sm" : "text-2xl sm:text-3xl";

  return (
    <div className="flex items-center justify-center gap-1">
      <span className={`rounded-md bg-pn-dark/80 pn-serif text-pn-gold tabular-nums ${sizeClasses}`}>
        {String(mins).padStart(2, "0")}
      </span>
      <span className={`pn-serif text-pn-gold ${colonClasses}`}>:</span>
      <span className={`rounded-md bg-pn-dark/80 pn-serif text-pn-gold tabular-nums ${sizeClasses}`}>
        {String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}

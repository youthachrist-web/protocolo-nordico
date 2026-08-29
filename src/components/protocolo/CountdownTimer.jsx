import React, { useState, useEffect } from "react";

export default function CountdownTimer({ minutes = 14, seconds = 59, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60 + seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return minutes * 60 + seconds; // reinicia ao chegar a zero
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes, seconds]);

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
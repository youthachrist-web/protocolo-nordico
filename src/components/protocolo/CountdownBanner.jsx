import React from "react";
import CountdownTimer from "./CountdownTimer";

export default function CountdownBanner() {
  return (
    <div className="sticky top-0 z-50 border-b border-pn-gold/20 bg-pn-dark px-4 py-2">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
        <span className="text-sm">⏰</span>
        <span className="pn-label text-[10px] text-pn-light/80">
          Oferta expira em
        </span>
        <CountdownTimer minutes={14} seconds={59} compact />
      </div>
    </div>
  );
}
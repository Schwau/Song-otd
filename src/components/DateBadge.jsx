"use client";

import { useEffect, useState } from "react";

const MONTHS_DE = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"
];

export default function DateBadge({ className = "" }) {
  const [day, setDay] = useState("01");
  const [month, setMonth] = useState("Jan");

  useEffect(() => {
    const d = new Date();
    setDay(String(d.getDate()).padStart(2, "0"));
    setMonth(MONTHS_DE[d.getMonth()]);
  }, []);

  return (
    <div
      className={
        "relative inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur " +
        "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_50px_-30px_rgba(255,255,255,0.18)] " +
        "transition hover:bg-white/7 " +
        className
      }
    >
      {/* subtle shine */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />

      <span className="text-xs uppercase tracking-widest text-white/60">
        Heute
      </span>

      <div className="flex items-center gap-2 font-mono text-2xl">
        <span className="w-[3ch] text-right tabular-nums">
          {day}
        </span>
        <span className="text-white/50">·</span>
        <span className="w-[4ch]">
          {month}
        </span>
      </div>
    </div>
  );
}

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
      className={[
        "relative inline-flex items-center gap-3 rounded-2xl px-4 py-3",
        "border backdrop-blur transition",
        // Light
        "bg-white/80 border-black/10 text-black",
        // Dark
        "dark:bg-white/5 dark:border-white/10 dark:text-white",
        // Shadow
        "shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)] dark:shadow-[0_18px_50px_-30px_rgba(255,255,255,0.18)]",
        className,
      ].join(" ")}
    >
      {/* Shine */}
      <div className="
        pointer-events-none absolute inset-0 rounded-2xl
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        opacity-0 hover:opacity-100 transition-opacity
      " />

      <span className="text-xs uppercase tracking-widest text-black/60 dark:text-white/60">
        Heute
      </span>

      <div className="flex items-center gap-2 font-mono text-2xl">
        <span className="w-[3ch] text-right tabular-nums">{day}</span>
        <span className="opacity-40">·</span>
        <span className="w-[4ch]">{month}</span>
      </div>
    </div>
  );
}

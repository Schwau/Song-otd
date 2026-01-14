"use client";

import { useEffect, useRef, useState } from "react";

const MONTHS_DE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

export default function DateSpinner() {
  const [targetDay, setTargetDay] = useState(null);
  const [targetMonth, setTargetMonth] = useState(null);

  const [day, setDay] = useState(1);
  const [monthIdx, setMonthIdx] = useState(0);

  const startRef = useRef(null);

  useEffect(() => {
    const d = new Date();
    setTargetDay(d.getDate());
    setTargetMonth(d.getMonth());
  }, []);

  useEffect(() => {
    if (targetDay === null) return;

    const duration = 1300;
    const start = performance.now();
    startRef.current = start;

    const animate = (time) => {
      const p = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      const daySteps = 3 * 31 + (targetDay - 1);
      const monthSteps = 4 * 12 + targetMonth;

      setDay((Math.floor(eased * daySteps) % 31) + 1);
      setMonthIdx(Math.floor(eased * monthSteps) % 12);

      if (p < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [targetDay, targetMonth]);

  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
      <span className="text-xs uppercase tracking-widest text-white/60">Heute</span>
      <div className="flex gap-2 font-mono text-2xl">
        <span className="w-[3ch] text-right tabular-nums">{String(day).padStart(2, "0")}</span>
        <span className="text-white/50">·</span>
        <span className="w-[4ch]">{MONTHS_DE[monthIdx]}</span>
      </div>
    </div>
  );
}

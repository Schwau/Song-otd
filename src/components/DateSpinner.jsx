"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const MONTHS_DE = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
];

function buildSequence(values, cycles, targetIndex) {
  const seq = [];
  for (let c = 0; c < cycles; c++) seq.push(...values);
  seq.push(...values.slice(0, targetIndex + 1));
  return seq;
}

export default function DateSpinner({ size = "lg", onNearEnd, onDone }) {
  const [targetDay, setTargetDay] = useState(null);
  const [targetMonth, setTargetMonth] = useState(null);
  const [dayIndex, setDayIndex] = useState(0);
  const [monthIndex, setMonthIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  const startedRef = useRef(false);
  const nearEndCalledRef = useRef(false);
  const doneCalledRef = useRef(false);

  useEffect(() => {
    const d = new Date();
    setTargetDay(d.getDate());
    setTargetMonth(d.getMonth());
  }, []);

  const { daySeq, monthSeq, finalDayIndex, finalMonthIndex } = useMemo(() => {
    const days = Array.from({ length: 31 }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );

    const tDay = targetDay ?? 1;
    const tMonth = targetMonth ?? 0;

    const daySeqBuilt = buildSequence(days, 3, tDay - 1);
    const monthSeqBuilt = buildSequence(MONTHS_DE, 4, tMonth);

    return {
      daySeq: daySeqBuilt,
      monthSeq: monthSeqBuilt,
      finalDayIndex: daySeqBuilt.length - 1,
      finalMonthIndex: monthSeqBuilt.length - 1,
    };
  }, [targetDay, targetMonth]);

  const itemH = size === "lg" ? 56 : 40;
  const fontCls = size === "lg" ? "text-4xl" : "text-2xl";
  const pillCls =
    size === "lg" ? "rounded-3xl px-6 py-5" : "rounded-2xl px-4 py-3";

  const durationMs = 1500;
  const nearEndMs = 260;
  const easing = "cubic-bezier(0.12, 0.9, 0.12, 1)";

  useEffect(() => {
    if (targetDay == null || targetMonth == null) return;
    if (startedRef.current) return;
    startedRef.current = true;

    setAnimate(false);
    setDayIndex(0);
    setMonthIndex(0);

    const t = setTimeout(() => {
      setAnimate(true);
      setDayIndex(finalDayIndex);
      setMonthIndex(finalMonthIndex);

      setTimeout(() => {
        if (!nearEndCalledRef.current) {
          nearEndCalledRef.current = true;
          onNearEnd && onNearEnd();
        }
      }, Math.max(0, durationMs - nearEndMs));

      setTimeout(() => {
        if (!doneCalledRef.current) {
          doneCalledRef.current = true;
          onDone && onDone();
        }
      }, durationMs);
    }, 30);

    return () => clearTimeout(t);
  }, [targetDay, targetMonth, finalDayIndex, finalMonthIndex, onNearEnd, onDone]);

  return (
    <div
      className={[
        "inline-flex items-center gap-3",
        "border backdrop-blur transition-colors",
        // Light mode
        "bg-white/80 border-black/10 text-black",
        // Dark mode
        "dark:bg-white/5 dark:border-white/10 dark:text-white",
        pillCls,
      ].join(" ")}
    >
      <span className="text-xs uppercase tracking-widest text-black/60 dark:text-white/60">
        Heute
      </span>

      <div className={`flex items-center gap-2 font-mono ${fontCls}`}>
        {/* DAY */}
        <div
          className={`relative overflow-hidden text-right tabular-nums ${
            size === "lg" ? "h-14 w-[3ch]" : "h-10 w-[3ch]"
          }`}
        >
          <div
            style={{
              transform: `translateY(${-dayIndex * itemH}px)`,
              transition: animate
                ? `transform ${durationMs}ms ${easing}`
                : "none",
            }}
          >
            {daySeq.map((v, i) => (
              <div
                key={`d-${i}-${v}`}
                style={{ height: itemH, lineHeight: `${itemH}px` }}
              >
                {v}
              </div>
            ))}
          </div>
        </div>

        <span className="opacity-40">·</span>

        {/* MONTH */}
        <div
          className={`relative overflow-hidden ${
            size === "lg" ? "h-14 w-[4ch]" : "h-10 w-[4ch]"
          }`}
        >
          <div
            style={{
              transform: `translateY(${-monthIndex * itemH}px)`,
              transition: animate
                ? `transform ${durationMs}ms ${easing}`
                : "none",
            }}
          >
            {monthSeq.map((v, i) => (
              <div
                key={`m-${i}-${v}`}
                style={{ height: itemH, lineHeight: `${itemH}px` }}
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

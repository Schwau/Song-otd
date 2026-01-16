"use client";

import { useCallback, useState } from "react";

// Background + UI
import Background from "../components/Background";
import TopNav from "../components/TopNav";

// Date UI
import DateSpinner from "../components/DateSpinner";
import DateBadge from "../components/DateBadge";

import { useEffect } from "react";

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Home() {
  /**
   * PHASES:
   * - "spin":  Fullscreen DateSpinner overlay is visible and spinning.
   * - "reveal": Spinner overlay fades out, DateBadge + Landing content fades in.
   */
  const [phase, setPhase] = useState("init");
  useEffect(() => {
    try {
      const last = localStorage.getItem("songotd_spinner_lastSeen");
      setPhase(last === todayKey() ? "reveal" : "spin");
    } catch {
      setPhase("spin");
    }
  }, []);
   

  /**
   * Spinner calls onDone() when it finishes.
   * We keep it on screen a short moment so the user can "read" the result.
   */
  const handleDone = useCallback(() => {
    setTimeout(() => {
      try {
        localStorage.setItem("songotd_spinner_lastSeen", todayKey());
      } catch {}
      setPhase("reveal");
    }, 550);
  }, []);

  // Convenience flags for readability
  const showBadge = phase === "reveal";
  const showContent = phase === "reveal";

  return (
    <main className="relative min-h-screen text-white pt-20">
      {/* 1) BACKGROUND LAYER (always visible) */}
      <Background />

      {/* 2) TOP NAV (fixed bar) */}
      <TopNav />

      {/* Date badge – aligned with hero text */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-6">
        <div
          className={[
            "transition-all duration-700 ease-out",
            showBadge ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
          ].join(" ")}
        >
          <DateBadge />
        </div>
      </div>


      {/* 4) FULLSCREEN SPINNER OVERLAY */}
      {phase === "spin" && (
        <div className="fixed inset-0 z-20 pointer-events-none">
          {/* 4a) Vignette */}
          <div
            className={[
              "absolute inset-0 transition-opacity duration-700 ease-out",
              "bg-gradient-to-b from-black/30 via-black/20 to-black/40",
            ].join(" ")}
          />

          {/* 4b) Spinner container */}
          <div className="flex h-full w-full items-center justify-center">
            <div
              className={[
                "relative transition-all duration-700 ease-out will-change-transform",
                "opacity-100 scale-100 blur-0 animate-[floaty_2.8s_ease-in-out_infinite]",
              ].join(" ")}
            >
              {/* Glow */}
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-white/10 blur-2xl" />
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-emerald-400/10 blur-3xl" />

              {/* Spinner */}
              <DateSpinner size="lg" onDone={handleDone} />
            </div>
          </div>
        </div>
      )}


      {/* 5) HERO CONTENT (appears only after spinner is done) */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-6 pb-10">
        {/* 5a) Headline */}
        <div
          className={[
            "transition-all duration-700 ease-out",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
            Song <span className="text-white/70">des Tages</span>
          </h1>
        </div>

        {/* 5b) Claim / Subtitle */}
        <div
          className={[
            "transition-all duration-700 ease-out delay-150",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <p className="mt-4 max-w-xl text-white/70 md:text-lg">
            Dein Highlight des Tages – zum Teilen mit der Welt.
          </p>
        </div>

        {/* 5c) CTA Buttons */}
        <div
          className={[
            "transition-all duration-700 ease-out delay-300",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1DB954] px-5 py-3 text-sm font-semibold text-black
                         hover:brightness-110 active:brightness-95 transition
                         shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_18px_50px_-18px_rgba(29,185,84,0.45)]"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-black/70 transition-transform group-hover:scale-125" />
              Mit Spotify verbinden
            </a>

            <a
              href="#funktion"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white
                         hover:bg-white/10 transition"
            >
              So funktioniert’s
            </a>
          </div>
        </div>
      </section>

      {/* 6) OPTIONAL: Sections below (anchors for nav)
          Add your #funktion / #roadmap sections here later */}
    </main>
  );
}

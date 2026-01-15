"use client";

import { useCallback, useState } from "react";

// Background + UI
import Background from "../components/Background";
import TopNav from "../components/TopNav";

// Date UI
import DateSpinner from "../components/DateSpinner";
import DateBadge from "../components/DateBadge";

export default function Home() {
  /**
   * PHASES:
   * - "spin":  Fullscreen DateSpinner overlay is visible and spinning.
   * - "reveal": Spinner overlay fades out, DateBadge + Landing content fades in.
   */
  const [phase, setPhase] = useState("spin");

  /**
   * Spinner calls onDone() when it finishes.
   * We keep it on screen a short moment so the user can "read" the result.
   */
  const handleDone = useCallback(() => {
    setTimeout(() => setPhase("reveal"), 550);
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


      {/* 4) FULLSCREEN SPINNER OVERLAY (only visible while phase === "spin") */}
      <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
        {/* 4a) Vignette behind the spinner (fades out after spin) */}
        <div
          className={[
            "absolute inset-0 transition-opacity duration-700 ease-out",
            phase === "spin" ? "opacity-100" : "opacity-0",
            "bg-gradient-to-b from-black/30 via-black/20 to-black/40",
          ].join(" ")}
        />

        {/* 4b) Spinner container (floats while spinning, fades out on reveal)
               NOTE: Glow is kept EXACTLY like your version. */}
        <div
          className={[
            "relative transition-all duration-700 ease-out will-change-transform",
            phase === "spin"
              ? "opacity-100 scale-100 blur-0 animate-[floaty_2.8s_ease-in-out_infinite]"
              : "opacity-0 scale-[0.92] blur-sm",
          ].join(" ")}
        >
          {/* Glow (unchanged, as requested) */}
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-white/10 blur-2xl" />
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-emerald-400/10 blur-3xl" />

          {/* The actual spinning date component */}
          <DateSpinner size="lg" onDone={handleDone} />
        </div>
      </div>

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

"use client";

import { useState } from "react";
import Background from "../components/Background";
import DateSpinner from "../components/DateSpinner";

export default function Home() {
  // stages:
  // "intro" -> spinner big centered
  // "snap"  -> spinner moves to final position
  // "show"  -> rest fades in
  const [stage, setStage] = useState("intro");

  return (
    <main className="relative min-h-screen text-white">
      <Background />

      {/* Spinner layer */}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div
          className={[
            "transition-all duration-700 ease-out",
            stage === "intro"
              ? "min-h-[70vh] flex items-center justify-center"
              : "pt-20 pb-2",
          ].join(" ")}
        >
          <div
            className={[
              "transition-all duration-700 ease-out will-change-transform",
              stage === "intro"
                ? "scale-110"
                : "scale-100",
            ].join(" ")}
          >
            <DateSpinner
              size={stage === "intro" ? "lg" : "md"}
              onNearEnd={() => setStage("snap")}
              onDone={() => setStage("show")}
            />
          </div>
        </div>
      </div>

      {/* Content layer (fades in after spinner) */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-10">
        <div
          className={[
            "transition-all duration-700 ease-out",
            stage === "show" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
            Song <span className="text-white/70">des Tages</span>
          </h1>

          <p className="mt-4 max-w-xl text-white/70 md:text-lg">
            Dein Highlight des Tages – zum Teilen mit der Welt.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1DB954] px-5 py-3 text-sm font-semibold text-black hover:brightness-110 active:brightness-95"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-black/70" />
              Mit Spotify verbinden
            </a>

            <a
              href="#funktion"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              So funktioniert’s
            </a>
          </div>

          <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      </section>

      <section id="funktion" className="relative z-10 mx-auto max-w-6xl px-6 py-14">
        <div
          className={[
            "transition-all duration-700 ease-out delay-150",
            stage === "show" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <h2 className="text-2xl font-semibold md:text-3xl">So funktioniert’s</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: "Täglich", d: "Jeden Tag erscheint ein neuer Song als Highlight." },
              { t: "Entdecken", d: "Finde neue Tracks passend zu deinem Geschmack." },
              { t: "Teilen", d: "Später optional: Close Circle oder öffentlich." },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="text-lg font-semibold">{x.t}</div>
                <div className="mt-2 text-sm text-white/70">{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

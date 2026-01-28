"use client";

import { useState } from "react";
import Background from "../components/Background";
import DateSpinner from "../components/DateSpinner";

export default function Home() {
  const [stage, setStage] = useState("intro");

  return (
    <main className="relative min-h-screen text-black dark:text-white">
      <Background />

      {/* Spinner */}
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
              stage === "intro" ? "scale-110" : "scale-100",
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

      {/* Content */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-10">
        <div
          className={[
            "transition-all duration-700 ease-out",
            stage === "show"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
            Song{" "}
            <span className="text-black/60 dark:text-white/70">
              des Tages
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-black/70 dark:text-white/70 md:text-lg">
            Dein Highlight des Tages – zum Teilen mit der Welt.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {/* Primary */}
            <a
              href="/login"
              className="
                inline-flex items-center justify-center gap-2
                rounded-2xl px-5 py-3
                text-sm font-semibold
                bg-[#1DB954] text-black
                hover:brightness-110 active:brightness-95
              "
            >
              <span className="inline-block h-2 w-2 rounded-full bg-black/70" />
              Mit Spotify verbinden
            </a>

            {/* Secondary */}
            <a
              href="#funktion"
              className="
                inline-flex items-center justify-center
                rounded-2xl px-5 py-3
                text-sm font-semibold transition
                border border-black/10 bg-black/[0.04] text-black
                hover:bg-black/[0.08]
                dark:border-white/15 dark:bg-white/5 dark:text-white
                dark:hover:bg-white/10
              "
            >
              So funktioniert’s
            </a>
          </div>

          <div className="
            mt-12 h-px w-full
            bg-gradient-to-r
            from-transparent
            via-black/15 dark:via-white/15
            to-transparent
          " />
        </div>
      </section>

      {/* How it works */}
      <section
        id="funktion"
        className="relative z-10 mx-auto max-w-6xl px-6 py-14"
      >
        <div
          className={[
            "transition-all duration-700 ease-out delay-150",
            stage === "show"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          <h2 className="text-2xl font-semibold md:text-3xl">
            So funktioniert’s
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: "Täglich", d: "Jeden Tag erscheint ein neuer Song als Highlight." },
              { t: "Entdecken", d: "Finde neue Tracks passend zu deinem Geschmack." },
              { t: "Teilen", d: "Später optional: Close Circle oder öffentlich." },
            ].map((x) => (
              <div
                key={x.t}
                className="
                  rounded-2xl p-6 backdrop-blur transition
                  border border-black/10 bg-white/70 text-black
                  hover:bg-white
                  dark:border-white/10 dark:bg-white/5 dark:text-white
                  dark:hover:bg-white/10
                "
              >
                <div className="text-lg font-semibold">{x.t}</div>
                <div className="mt-2 text-sm text-black/70 dark:text-white/70">
                  {x.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

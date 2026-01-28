"use client";

import { useEffect, useState } from "react";

export default function Background() {
  const noiseSvg = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/>
      </filter>
      <rect width='120' height='120' filter='url(#n)' opacity='.25'/>
    </svg>
  `);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base background */}
      <div
        className="
          absolute inset-0
          bg-[#f6f7f8]
          dark:bg-gradient-to-b dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900
        "
      />

      {/* Color Blurs */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(900px 520px at 50% -10%, rgba(99,102,241,0.35) 0%, rgba(0,0,0,0) 72%),
            radial-gradient(800px 520px at 0% 60%, rgba(16,185,129,0.28) 0%, rgba(0,0,0,0) 75%),
            radial-gradient(820px 620px at 110% 110%, rgba(236,72,153,0.25) 0%, rgba(0,0,0,0) 78%)
          `,
          filter: "blur(18px)",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />

      {/* Dark mode vignette */}
      <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-black/30 dark:via-transparent dark:to-black/40" />

      {/* Micro noise (very subtle) */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,${noiseSvg}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "120px 120px",
        }}
      />
    </div>
  );
}

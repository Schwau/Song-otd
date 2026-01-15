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
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(900px 520px at 50% -10%, rgba(99,102,241,0.20) 0%, rgba(0,0,0,0) 72%),
            radial-gradient(700px 520px at 0% 55%, rgba(16,185,129,0.16) 0%, rgba(0,0,0,0) 74%),
            radial-gradient(820px 620px at 110% 110%, rgba(236,72,153,0.12) 0%, rgba(0,0,0,0) 76%)
          `,
          filter: "blur(6px)",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* micro-dither: praktisch unsichtbar */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,${noiseSvg}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "120px 120px",
        }}
      />
    </div>
  );
}

export default function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900" />

      {/* High-quality blob layer (radial gradients in ONE background) */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            radial-gradient(900px 500px at 50% -10%, rgba(99,102,241,0.22) 0%, rgba(0,0,0,0) 60%),
            radial-gradient(650px 450px at 0% 55%, rgba(16,185,129,0.18) 0%, rgba(0,0,0,0) 62%),
            radial-gradient(750px 520px at 110% 110%, rgba(236,72,153,0.14) 0%, rgba(0,0,0,0) 62%)
          `,
          filter: "blur(12px)",
          transform: "translateZ(0)",
        }}
      />

      {/* Optional: super weiche Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
    </div>
  );
}

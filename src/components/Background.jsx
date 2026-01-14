export default function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900" />

      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 45%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 45%, transparent 75%)",
        }}
      />

      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="absolute top-40 -left-32 h-[420px] w-[420px] rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute bottom-[-180px] right-[-180px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
    </div>
  );
}

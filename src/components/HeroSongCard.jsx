"use client";

export default function HeroSongCard({
  trackName,
  artistName,
  coverUrl,
}) {
  return (
    <div className="
      relative overflow-hidden rounded-[2.5rem] p-8
      border backdrop-blur
      bg-white/85 border-black/10 text-black
      dark:bg-black/30 dark:border-white/10 dark:text-white
      shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]
    ">
      {/* Glow */}
      <div className="
        absolute inset-0 -z-10
        bg-gradient-to-br
        from-emerald-500/20 via-transparent to-transparent
        dark:from-emerald-500/10
      " />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* COVER */}
        <div className="
          h-40 w-40 shrink-0 overflow-hidden rounded-2xl
          bg-black/5 dark:bg-white/10
        ">
          {coverUrl ? (
            <img src={coverUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm opacity-40">
              No Cover
            </div>
          )}
        </div>

        {/* TEXT */}
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest opacity-60">
            Dein Song heute
          </div>

          <h2 className="mt-2 truncate text-3xl font-semibold md:text-4xl">
            {trackName || "Kein Song gesetzt"}
          </h2>

          <div className="mt-1 truncate text-lg opacity-70">
            {artistName || "—"}
          </div>

          <div className="mt-4 text-sm opacity-40">
            (Teilen & Öffnen kommt gleich)
          </div>
        </div>
      </div>
    </div>
  );
}

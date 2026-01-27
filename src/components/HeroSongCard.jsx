"use client";

export default function HeroSongCard({
  trackName,
  artistName,
  coverUrl,
}) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/30 p-8 backdrop-blur">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* COVER */}
        <div className="h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-white/10">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
              No Cover
            </div>
          )}
        </div>

        {/* TEXT */}
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-white/50">
            Dein Song heute
          </div>

          <h2 className="mt-2 truncate text-3xl font-semibold md:text-4xl">
            {trackName || "Kein Song gesetzt"}
          </h2>

          <div className="mt-1 truncate text-lg text-white/70">
            {artistName || "—"}
          </div>

          {/* Placeholder CTA */}
          <div className="mt-4 text-sm text-white/40">
            (Teilen & Öffnen kommt gleich)
          </div>
        </div>
      </div>
    </div>
  );
}

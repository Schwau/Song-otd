"use client";

function openSong({ spotifyTrackId, trackName, artistName }) {
  if (spotifyTrackId) {
    window.open(
      `https://open.spotify.com/track/${spotifyTrackId}`,
      "_blank"
    );
    return;
  }

  const q = encodeURIComponent(`${trackName} ${artistName}`);
  window.open(
    `https://www.youtube.com/results?search_query=${q}`,
    "_blank"
  );
}

export default function SongCard({
  trackName,
  artistName,
  coverUrl,
  spotifyTrackId,
  user,
  compact = false,
}) {
  return (
    <div
      onClick={() =>
        openSong({ spotifyTrackId, trackName, artistName })
      }
      tabIndex={0}
      className={[
        "group relative flex items-center gap-6",
        "rounded-3xl border transition",
        "cursor-pointer active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50",

        // 🌞 Light mode
        "bg-white/80 border-black/10 text-black",
        "hover:bg-white",

        // 🌚 Dark mode
        "dark:bg-black/25 dark:border-white/10 dark:text-white",
        "dark:hover:bg-black/35",

        "px-6 py-6 md:px-8 md:py-7",
        compact ? "py-4" : "",
      ].join(" ")}
    >
      {/* Ambient glow */}
      <div className="
        pointer-events-none absolute inset-0 -z-10 rounded-3xl
        bg-emerald-400/10 blur-3xl opacity-0
        group-hover:opacity-100 transition-opacity
      " />

      {/* Cover */}
      <div className="
        relative h-24 w-24 md:h-32 md:w-32 shrink-0
        overflow-hidden rounded-2xl
        bg-black/[0.04] dark:bg-white/10
      ">
        <div className="
          pointer-events-none absolute inset-0
          bg-emerald-400/20 blur-2xl
          opacity-0 group-hover:opacity-100 transition-opacity
        " />

        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            className="
              relative z-10 h-full w-full object-cover
              transition-transform duration-300
              group-hover:scale-105
            "
          />
        ) : (
          <div className="
            relative z-10 flex h-full w-full items-center justify-center
            text-xs uppercase tracking-widest
            text-black/40 dark:text-white/40
          ">
            No Cover
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="
          truncate text-xl md:text-2xl font-semibold leading-tight
          text-black dark:text-white
        ">
          {trackName || "Unbekannter Song"}
        </div>

        <div className="
          mt-1 truncate text-base md:text-lg
          text-black/70 dark:text-white/70
        ">
          {artistName || "Unbekannter Artist"}
        </div>

        {user?.username && (
          <div className="
            mt-2 text-sm
            text-black/50 dark:text-white/45
          ">
            von @{user.username}
          </div>
        )}
      </div>

      {/* Open hint */}
      <div className="
        shrink-0 text-xs
        text-black/40 dark:text-white/40
        opacity-0 group-hover:opacity-100 transition
      ">
        Öffnen ↗
      </div>
    </div>
  );
}

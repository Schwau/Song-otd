"use client";

import { useCallback, useEffect, useState } from "react";
import SongCard from "../components/SongCard";
// Background + UI
import Background from "../components/Background";
import HeroSongCard from "../components/HeroSongCard";
// Date UI
import DateSpinner from "../components/DateSpinner";
import DateBadge from "../components/DateBadge";

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Home() {
  /* ======================
     STATE
     ====================== */

  const [phase, setPhase] = useState("init");

  const [songLoading, setSongLoading] = useState(true);
  const [song, setSong] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searching, setSearching] = useState(false);
  const [me, setMe] = useState(null);
  const [meLoading, setMeLoading] = useState(true);
  /* ======================
     SPINNER LOGIC
     ====================== */

  useEffect(() => {
    try {
      const last = localStorage.getItem("songotd_spinner_lastSeen");
      setPhase(last === todayKey() ? "reveal" : "spin");
    } catch {
      setPhase("spin");
    }
  }, []);

  const handleDone = useCallback(() => {
    setTimeout(() => {
      try {
        localStorage.setItem("songotd_spinner_lastSeen", todayKey());
      } catch {}
      setPhase("reveal");
    }, 550);
  }, []);
  
  useEffect(() => {
    let alive = true;

    async function loadMe() {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (!alive) return;
        setMe(data?.user ?? null);
      } catch {
        if (!alive) return;
        setMe(null);
      } finally {
        if (!alive) return;
        setMeLoading(false);
      }
    }

    loadMe();
    return () => {
      alive = false;
    };
  }, []);

  /* ======================
     LOAD SONG OF TODAY
     ====================== */

  useEffect(() => {
    let alive = true;

    async function loadSong() {
      try {
        const res = await fetch("/api/song-of-the-day", {
          cache: "no-store",
          credentials: "include",
        });
        const data = await res.json();
        if (!alive) return;
        setSong(data?.song ?? null);
      } catch {
        if (!alive) return;
        setSong(null);
      } finally {
        if (!alive) return;
        setSongLoading(false);
      }
    }

    loadSong();
    return () => {
      alive = false;
    };

  }, []);
  
  useEffect(() => {
      if (!query || query.length < 2) {
        setResults([]);
        return;
      }

      setSearching(true);

      const t = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/music/search?q=${encodeURIComponent(query)}`
          );
          const data = await res.json();
          setResults(data.results || []);
        } catch {
          setResults([]);
        } finally {
          setSearching(false);
        }
      }, 300); // debounce

      return () => clearTimeout(t);
    }, [query]);

  /* ======================
     SAVE SONG
     ====================== */


  async function saveSong() {
    if (!selectedSong) return;

    setSaving(true);
    setSaveError(null);

    try {
      const { trackName, artistName, coverUrl } = selectedSong;
      const res = await fetch("/api/song-of-the-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotifyTrackId: "manual",
          trackName,
          artistName,
          coverUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveError(data?.error || "Fehler beim Speichern");
        setSaving(false);
        return;
      }

      setSong(data.song);
      
    } catch {
      setSaveError("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  }

  /* ======================
     RENDER
     ====================== */

  const showContent = phase === "reveal";

  return (
    <main className="relative min-h-screen text-black dark:text-white pt-20">
      <Background />

      {/* Date badge */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-6">
        <div
          className={[
            "transition-all duration-700 ease-out",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
          ].join(" ")}
        >
          <DateBadge />
        </div>
      </div>

      {/* Spinner */}
      {phase === "spin" && (
        <div className="fixed inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 backdrop-blur-xl bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
          <div className="flex h-full w-full items-center justify-center translate-y-[-1.5rem]">
            <div className="relative animate-[floaty_2.8s_ease-in-out_infinite]">
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-white/10 blur-2xl" />
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-emerald-400/10 blur-3xl" />
              <DateSpinner size="lg" onDone={handleDone} />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-6 pb-10">
        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
          Song <span className="text-black/60 dark:text-white/70">des Tages</span>
        </h1>

        <p className="mt-4 max-w-xl text-black/70 dark:text-white/70 md:text-lg">
          Dein Highlight des Tages – zum Teilen mit der Welt.
        </p>

        {/* ======================
            SONG DISPLAY
           ====================== */}

        {showContent && song && (
          <div className="mt-8">
            <HeroSongCard
              trackName={song.trackName}
              artistName={song.artistName}
              coverUrl={song.coverUrl}
            />
          </div>
        )}

        {showContent && !song && (
          <div
            className="
              mt-8 rounded-2xl p-6
              border border-black/10 bg-white/70 text-black/70
              dark:border-white/10 dark:bg-black/20 dark:text-white/60
            "
          >
            Du hast heute noch keinen Song gesetzt.
          </div>
        )}
       
       {/* ======================
            SONG INPUT / LOGIN GUARD
          ====================== */}

        {/* NOT LOGGED IN */}
        {!meLoading && !me && (
          <div
            className="
              mt-6 rounded-2xl px-6 py-6
              border border-black/10 bg-white/70
              dark:border-white/10 dark:bg-black/20
            "
          >
            <div className="text-lg font-semibold text-black dark:text-white">
              Melde dich an, um deinen Song des Tages zu setzen
            </div>

            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
              Dein Song des Tages ist persönlich – bitte logge dich ein.
            </p>

            <a
              href="/login"
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-[#1DB954] px-5 py-3 text-sm font-semibold text-black
                        hover:bg-[#21e065] transition"
            >
              Zum Login
            </a>
          </div>
        )}

        {/* LOGGED IN + NO SONG YET */}
        {!meLoading && me && !songLoading && !song && (
          <div
            className="
              mt-6 rounded-2xl px-4 py-4
              border border-black/10 bg-white/70
              dark:border-white/10 dark:bg-black/20
            "
          >
            <div className="text-sm font-semibold">Setze deinen Song des Tages</div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Song suchen…"
              className="
                mt-3 w-full rounded-xl px-4 py-3 text-sm
                border border-black/15 bg-white text-black
                placeholder:text-black/40
                focus:outline-none focus:ring-2 focus:ring-[#1DB954]/40
                dark:border-white/15 dark:bg-white/5 dark:text-white
                dark:placeholder:text-white/40
              "
                          />

            {selectedSong && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white/10">
                  {selectedSong.coverUrl && (
                    <img
                      src={selectedSong.coverUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {selectedSong.trackName}
                  </div>
                  <div className="truncate text-xs text-white/60">
                    {selectedSong.artistName}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedSong(null);
                    setQuery("");
                  }}
                  className="rounded-md px-2 py-1 text-xs text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {query.length > 0 && !selectedSong && (
              <div className="mt-3 space-y-2">
                {searching && (
                  <div className="text-xs text-white/50">Suche…</div>
                )}

                {!searching && results.length === 0 && (
                  <div className="text-xs text-white/50">Keine Treffer</div>
                )}

                {results.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedSong(item)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 transition
                    hover:bg-emerald-400/10 hover:border-emerald-400/30"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white/10">
                      {item.coverUrl && (
                        <img
                          src={item.coverUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {item.trackName}
                      </div>
                      <div className="truncate text-xs text-white/60">
                        {item.artistName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={saveSong}
                disabled={saving || !selectedSong}
                className="
                  rounded-2xl
                  bg-[#1DB954]
                  px-4 py-2
                  text-sm font-semibold text-black
                  transition-all duration-150
                  hover:bg-[#21e065]
                  hover:shadow-[0_0_0_3px_rgba(29,185,84,0.25)]
                  active:scale-[0.97]
                  disabled:opacity-50
                  disabled:hover:bg-[#1DB954]
                  disabled:hover:shadow-none
                "
              >
                {saving ? "Speichern…" : "Song speichern"}
              </button>

              {saveError && (
                <div className="text-sm text-red-300">{saveError}</div>
              )}
            </div>
          </div>
        )}

      </section>
    </main>
  );
}

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

  const [trackName, setTrackName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

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

  /* ======================
     SAVE SONG
     ====================== */
  

  async function fetchAppleCover(trackName, artistName) {
    const res = await fetch(
      `/api/music/apple?track=${encodeURIComponent(trackName)}&artist=${encodeURIComponent(artistName)}`
    );
    const data = await res.json();
    return data.coverUrl ?? null;
  }

  async function saveSong() {
    if (!trackName || !artistName) return;

    setSaving(true);
    setSaveError(null);

    try {
      const coverUrl = await fetchAppleCover(trackName, artistName);
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
      setTrackName("");
      setArtistName("");
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
    <main className="relative min-h-screen text-white pt-20">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
          <div className="flex h-full w-full items-center justify-center">
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
          Song <span className="text-white/70">des Tages</span>
        </h1>

        <p className="mt-4 max-w-xl text-white/70 md:text-lg">
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
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 text-white/60">
            Du hast heute noch keinen Song gesetzt.
          </div>
        )}
       
        {/* ======================
            SONG INPUT (NUR WENN KEIN SONG)
           ====================== */}

        {!songLoading && !song && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <div className="text-sm font-semibold">Setze deinen Song des Tages</div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                placeholder="Songtitel"
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DB954]/40"
              />

              <input
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Artist"
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DB954]/40"
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={saveSong}
                disabled={saving || !trackName || !artistName}
                className="rounded-2xl bg-[#1DB954] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
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

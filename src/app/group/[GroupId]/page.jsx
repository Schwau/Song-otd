"use client";

import { useEffect, useState } from "react";
import Background from "../../../components/Background";
import TopNav from "../../../components/TopNav";
import { useParams, useRouter } from "next/navigation";


export default function GroupPage({ params }) {
  const router = useRouter();
  const p = useParams();
  const groupId = p?.groupId ?? p?.GroupId;

  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteLink, setInviteLink] = useState(null);
  const [inviteExpiresAt, setInviteExpiresAt] = useState(null);
  const [me, setMe] = useState(null);
  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);

  async function createInvite() {
    if (!groupId) return;
    setInviteLoading(true);
    setInviteError(null);
    setInviteLink(null);
    setInviteExpiresAt(null);
    try {
      const res = await fetch(`/api/groups/${groupId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiresInDays: 7 }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setInviteError(data?.error || "Invite konnte nicht erstellt werden.");
        setInviteLoading(false);
        return;
      }

      const data = await res.json();
      setInviteExpiresAt(data?.invite?.expiresAt ?? null);
      const code = data?.invite?.code;

      if (!code) {
        setInviteError("Invite konnte nicht erstellt werden.");
        setInviteLoading(false);
        return;
      }

      const link = `${window.location.origin}/invite/${code}`;
      setInviteLink(link);

      // copy-to-clipboard (best effort)
      try {
        await navigator.clipboard.writeText(link);
      } catch {}

      setInviteLoading(false);
    } catch (err) {
      console.error(err);
      setInviteError("Invite konnte nicht erstellt werden.");
      setInviteLoading(false);
    }
  }
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // 1) Auth / onboarding über /api/me
        const meRes = await fetch("/api/me", { cache: "no-store" });
        const me = await meRes.json();

        if (!me.user) {
          router.replace("/login");
          return;
        }
        setMe(me.user);
        if (!me.user.onboardingDone) {
          router.replace("/onboarding");
          return;
        }
        
        // 2) Group Daten über API
        const res = await fetch(`/api/groups/${groupId}`, { cache: "no-store" });

        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        if (res.status === 403) {
          if (!cancelled) {
            setError("Du bist kein Mitglied dieser Gruppe.");
            setLoading(false);
          }
          return;
        }
        if (!res.ok) {
          if (!cancelled) {
            setError("Gruppe konnte nicht geladen werden.");
            setLoading(false);
          }
          return;
        }

        const data = await res.json();
        if (!cancelled) {
          setGroup(data.group || null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Group page load error:", err);
        if (!cancelled) {
          setError("Fehler beim Laden der Gruppe.");
          setLoading(false);
        }
      }
    }

    if (groupId) load();
    else {
      setError("Ungültige Gruppen-ID.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [router, groupId]);
  
  useEffect(() => {
    if (!groupId) return;

    let alive = true;

    async function loadSongs() {
      setSongsLoading(true);
      try {
        const res = await fetch(`/api/groups/${groupId}/songs`, {
          cache: "no-store",
          credentials: "include",
        });

        const data = await res.json();
        if (!alive) return;

        setSongs(data?.songs ?? []);
        console.log("GROUP SONGS:", data?.songs);
      } catch (e) {
        console.error("Failed to load group songs", e);
        if (!alive) return;
        setSongs([]);
      } finally {
        if (!alive) return;
        setSongsLoading(false);
      }
    }

    loadSongs();
    return () => {
      alive = false;
    };
  }, [groupId]);

  return (
    <main className="relative min-h-screen text-white pt-20">
      <Background />
      <TopNav />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-10">
        <a
          href="/groups"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition"
        >
          ← Alle Gruppen
        </a>

        <header className="
          mt-6
          rounded-3xl
          bg-gradient-to-br from-white/10 via-white/5 to-transparent
          border border-white/10
          p-8
          relative
        ">
          <div className="text-xs uppercase tracking-widest text-white/40">
            Gruppe
          </div>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            {loading ? "Lädt…" : group?.name ?? "Unbekannte Gruppe"}
          </h1>

          {!loading && !error && (
            <p className="mt-2 text-sm text-white/60">
              {group?.members?.length ?? 0} Mitglieder · Deine Rolle:{" "}
              {group?.yourRole ?? "member"}
            </p>
          )}

          {group?.yourRole === "owner" && (
            <button
              onClick={createInvite}
              disabled={inviteLoading}
              className="
                absolute top-6 right-6
                rounded-full bg-white/10
                px-4 py-2 text-sm font-semibold
                hover:bg-white/15 transition
                disabled:opacity-50
              "
            >
              {inviteLoading ? "Erstelle…" : "Invite erstellen"}
            </button>
          )}
        </header>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-white/80">
            Heute
          </h2>

          {songsLoading ? (
            <div className="mt-4 text-white/60">
              Lade Songs…
            </div>
          ) : songs.length === 0 ? (
            <div className="mt-4 text-white/50">
              🌅 Heute hat noch niemand einen Song gesetzt
            </div>
          ) : (
            <div className="mt-4 space-y-1">
              {songs.map((entry) => {
                const isMe = entry.user.id === me?.id;
                const hasSong = !!entry.song;

                return (
                  <div
                    key={entry.user.id}
                    className="
                      flex items-center justify-between
                      px-6 py-4
                      rounded-3xl
                      bg-white/[0.02]
                      hover:bg-white/[0.06]
                      transition
                    "
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-5 min-w-0">
                      {/* Avatar */}
                      <div
                        className="
                          h-14 w-14 rounded-full
                          bg-white/10
                          flex items-center justify-center
                          text-lg font-semibold
                          shrink-0
                        "
                      >
                        {entry.user.username?.[0]?.toUpperCase() ?? "?"}
                      </div>

                      {/* Name + Song */}
                      <div className="min-w-0">
                        <div className="text-base font-semibold truncate">
                          @{entry.user.username ?? "user"}
                        </div>

                        {hasSong ? (
                          <div className="mt-2 flex items-center gap-4">
                            {/* Cover */}
                            <div className="h-14 w-14 rounded-xl overflow-hidden bg-white/10 shrink-0">
                              {entry.song.coverUrl && (
                                <img
                                  src={entry.song.coverUrl}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>

                            {/* Song Meta */}
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">
                                {entry.song.trackName}
                              </div>
                              <div className="text-xs text-white/60 truncate">
                                {entry.song.artistName}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-sm text-white/50">
                            Heute noch kein Song
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT */}
                    {!hasSong && isMe && (
                      <button
                        onClick={() => router.push("/")}
                        className="
                          shrink-0
                          rounded-xl bg-[#1DB954]
                          px-4 py-2.5
                          text-sm font-semibold
                          text-black
                          hover:brightness-110
                          transition
                        "
                      >
                        Song hinzufügen
                      </button>
                    )}
                  </div>

                );
              })}
            </div>
          )}
        </section>



      </section>
    </main>
  );
}

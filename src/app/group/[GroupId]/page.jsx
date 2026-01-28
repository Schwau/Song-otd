"use client";

import { useEffect, useState } from "react";
import Background from "../../../components/Background";
import TopNav from "../../../components/TopNav";
import { useParams, useRouter } from "next/navigation";

export default function GroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.groupId;

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

  /* ======================
     INVITE
     ====================== */

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

      const data = await res.json();

      if (!res.ok) {
        setInviteError(data?.error || "Invite konnte nicht erstellt werden.");
        setInviteLoading(false);
        return;
      }

      const link = `${window.location.origin}/invite/${data.invite.code}`;
      setInviteLink(link);
      setInviteExpiresAt(data.invite.expiresAt);

      try {
        await navigator.clipboard.writeText(link);
      } catch {}

      setInviteLoading(false);
    } catch {
      setInviteError("Invite konnte nicht erstellt werden.");
      setInviteLoading(false);
    }
  }

  /* ======================
     LOAD GROUP + ME
     ====================== */

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const meRes = await fetch("/api/me", { cache: "no-store" });
        const meData = await meRes.json();

        if (!meData.user) {
          router.replace("/login");
          return;
        }

        if (!meData.user.onboardingDone) {
          router.replace("/onboarding");
          return;
        }

        if (!alive) return;
        setMe(meData.user);

        const res = await fetch(`/api/groups/${groupId}`, {
          cache: "no-store",
        });

        if (res.status === 403) {
          setError("Du bist kein Mitglied dieser Gruppe.");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          setError("Gruppe konnte nicht geladen werden.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (!alive) return;

        setGroup(data.group);
        setLoading(false);
      } catch {
        if (!alive) return;
        setError("Fehler beim Laden der Gruppe.");
        setLoading(false);
      }
    }

    if (groupId) load();
    return () => {
      alive = false;
    };
  }, [groupId, router]);

  /* ======================
     LOAD SONGS
     ====================== */

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
      } catch {
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

  /* ======================
     RENDER
     ====================== */

  return (
    <main className="relative min-h-screen pt-20">
      <Background />
      <TopNav />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-10">
        <a
          href="/groups"
          className="inline-flex items-center gap-2 text-sm font-semibold text-black/60 hover:text-black transition dark:text-white/60 dark:hover:text-white"
        >
          ← Alle Gruppen
        </a>

        {/* ======================
            HEADER
           ====================== */}

        <header
          
          className="
            mt-6 relative rounded-3xl p-8
            backdrop-blur-xl transition

            /* LIGHT */
            bg-white/80 border border-black/10
            shadow-[0_20px_50px_-30px_rgba(0,0,0,0.25)]

            /* DARK */
            dark:bg-black/40
            dark:border-white/10
            dark:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]
          "
        >
          <div
            className="
              pointer-events-none absolute inset-0 -z-10 rounded-3xl

              /* LIGHT MODE */
              bg-gradient-to-br
              from-emerald-400/15 via-sky-400/10 to-transparent
              opacity-100

              /* DARK MODE */
              dark:from-emerald-400/10
              dark:via-transparent
              dark:to-transparent
            "
          />

          <div className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40">
            Gruppe
          </div>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black dark:text-white">
            {loading ? "Lädt…" : group?.name ?? "Unbekannte Gruppe"}
          </h1>

          {!loading && !error && (
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">
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
                rounded-full px-4 py-2 text-sm font-semibold
                border border-black/10 bg-black/[0.03]
                hover:bg-black/[0.06] transition
                disabled:opacity-50
                dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15
              "
            >
              {inviteLoading ? "Erstelle…" : "Invite erstellen"}
            </button>
          )}

          {inviteLink && (
            <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm dark:border-white/10 dark:bg-black/20">
              <div className="font-semibold">Invite-Link</div>
              <div className="mt-1 break-all text-xs text-black/70 dark:text-white/70">
                {inviteLink}
              </div>
              {inviteExpiresAt && (
                <div className="mt-1 text-xs text-black/50 dark:text-white/50">
                  Läuft ab:{" "}
                  {new Date(inviteExpiresAt).toLocaleString("de-DE")}
                </div>
              )}
            </div>
          )}

          {inviteError && (
            <div className="mt-4 text-sm text-red-500">{inviteError}</div>
          )}
        </header>

        {/* ======================
            SONGS
           ====================== */}

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-black/80 dark:text-white/80">
            Heute
          </h2>

          {songsLoading ? (
            <div className="mt-4 text-black/60 dark:text-white/60">
              Lade Songs…
            </div>
          ) : songs.length === 0 ? (
            <div className="mt-4 text-black/50 dark:text-white/50">
              🌅 Heute hat noch niemand einen Song gesetzt
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {songs.map((entry) => {
                const isMe = entry.user.id === me?.id;
                const hasSong = !!entry.song;

                return (
                  <div
                    key={entry.user.id}
                    className="
                      flex items-center justify-between
                      px-6 py-4 rounded-3xl
                      border border-black/10
                      bg-black/[0.03]
                      hover:bg-black/[0.06]
                      transition
                      dark:border-white/10
                      dark:bg-white/[0.02]
                      dark:hover:bg-white/[0.06]
                    "
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="h-14 w-14 rounded-full bg-black/10 flex items-center justify-center text-lg font-semibold dark:bg-white/10">
                        {entry.user.username?.[0]?.toUpperCase() ?? "?"}
                      </div>

                      <div className="min-w-0">
                        <div className="text-base font-semibold truncate text-black dark:text-white">
                          @{entry.user.username ?? "user"}
                        </div>

                        {hasSong ? (
                          <div className="mt-2 flex items-center gap-4">
                            <div className="h-14 w-14 rounded-xl overflow-hidden bg-black/10 dark:bg-white/10">
                              {entry.song.coverUrl && (
                                <img
                                  src={entry.song.coverUrl}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate text-black dark:text-white">
                                {entry.song.trackName}
                              </div>
                              <div className="text-xs text-black/60 dark:text-white/60 truncate">
                                {entry.song.artistName}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-sm text-black/50 dark:text-white/50">
                            Heute noch kein Song
                          </div>
                        )}
                      </div>
                    </div>

                    {!hasSong && isMe && (
                      <button
                        onClick={() => router.push("/")}
                        className="
                          shrink-0 rounded-xl
                          bg-[#1DB954]
                          px-4 py-2.5
                          text-sm font-semibold text-black
                          hover:brightness-110 transition
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

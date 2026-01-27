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

        <header className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div className="text-xs uppercase tracking-widest text-white/50">
            Gruppe
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {loading ? "Lädt…" : group?.name ?? "Unbekannte Gruppe"}
          </h1>

          <p className="mt-2 text-sm text-white/60">
            {loading ? (
              "…"
            ) : error ? (
              error
            ) : (
              <>
                {group?.members?.length ?? 0} Mitglieder · Deine Rolle:{" "}
                {group?.yourRole ?? "member"}
              </>
            )}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-2xl bg-[#1DB954] px-5 py-3 text-sm font-semibold text-black hover:brightness-110 active:brightness-95 transition"
              title="Kommt später"
            >
              Song hinzufügen
            </button>

            <button
              type="button"
              onClick={createInvite}
              disabled={loading || !!error || inviteLoading || !group || group.yourRole !== "owner"}
              className={[
                "rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition",
                "hover:bg-white/10",
                (loading || !!error || inviteLoading || !group || group.yourRole !== "owner")
                  ? "opacity-50 cursor-not-allowed hover:bg-white/5"
                  : "",
              ].join(" ")}
              title={
                group?.yourRole !== "owner"
                  ? "Nur Owner können Invites erstellen"
                  : "Invite Link erstellen"
              }
            >
              {inviteLoading ? "Erstelle…" : "Invite erstellen"}
            </button>
          </div>
          {inviteError && (
            <div className="mt-3 text-sm text-red-300">
              {inviteError}
            </div>
          )}

          {inviteLink && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-white/50">
                    Invite Link
                  </div>
                  <div className="mt-1 break-all text-sm text-white/80">
                    {inviteLink}
                  </div>

                  {inviteExpiresAt && (
                    <div className="mt-2 text-xs text-white/55">
                      Läuft ab:{" "}
                      {new Date(inviteExpiresAt).toLocaleString("de-DE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(inviteLink);
                    } catch {}
                  }}
                  className="shrink-0 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                >
                  Copy
                </button>
              </div>
            </div>
          )}


        </header>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/80">Mitglieder</h2>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
              Coming soon
            </span>
          </div>

          {loading ? (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-6">
              <p className="text-white/70">Lade Mitglieder…</p>
            </div>
          ) : error ? (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-6">
              <p className="text-white/70">{error}</p>
            </div>
          ) : (group?.members?.length ?? 0) === 0 ? (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-6">
              <p className="text-white/70">Noch keine Mitglieder gefunden.</p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {group.members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">
                      {m.username ? `@${m.username}` : m.id}
                    </div>
                    <div className="mt-1 text-xs text-white/55">
                      {m.username ? "Mitglied" : "User (noch ohne Username)"}
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                    Profil
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 text-xs text-white/40">
          (Später: Feed/Songs/Invites. Jetzt: echte Group Daten + Members aus DB)
        </div>
      </section>
    </main>
  );
}

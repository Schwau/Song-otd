"use client";

import { use, useEffect, useMemo, useState } from "react";
import Background from "../../../components/Background";
import TopNav from "../../../components/TopNav";
import SmartRedirect from "../../../components/SmartRedirect";

function basicLooksValid(code) {
  return (
    typeof code === "string" &&
    code.length >= 4 &&
    code.length <= 64 &&
    !/[^a-zA-Z0-9-_]/.test(code)
  );
}

export default function InvitePage({ params }) {
  // Next 16: params is a Promise
  const { code = "" } = use(params);

  const looksValid = useMemo(() => basicLooksValid(code), [code]);

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const [meLoading, setMeLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const canOpen = looksValid && !loading && valid;

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!looksValid) {
        if (!alive) return;
        setLoading(false);
        setValid(false);
        setGroupInfo(null);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/invites/${encodeURIComponent(code)}`, {
          cache: "no-store",
        });

        if (!alive) return;

        if (!res.ok) {
          setValid(false);
          setGroupInfo(null);
        } else {
          const data = await res.json();
          setValid(Boolean(data?.valid));
          setGroupInfo(data ?? null);
        }
      } catch {
        if (!alive) return;
        setValid(false);
        setGroupInfo(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [code, looksValid]);

  useEffect(() => {
    let alive = true;

    async function runMe() {
      setMeLoading(true);
      try {
        const res = await fetch("/api/me", { cache: "no-store", credentials: "same-origin" });
        const data = await res.json();
        if (!alive) return;
        setLoggedIn(Boolean(data?.loggedIn));
      } catch {
        if (!alive) return;
        setLoggedIn(false);
      } finally {
        if (!alive) return;
        setMeLoading(false);
      }
    }

    runMe();
    return () => {
      alive = false;
    };
  }, []);

  const [joinMsg, setJoinMsg] = useState("");

  async function joinGroup() {
    setJoinMsg("Beitritt läuft…");

    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(code)}/redeem`, {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setJoinMsg(`❌ Join Fehler (${res.status}): ${JSON.stringify(data)}`);
        return;
      }

      const groupId = data?.groupId || "demo";
      setJoinMsg(`✅ Beigetreten. Weiterleitung zu /group/${groupId}…`);

      // ✅ redirect (nimm eins von beiden)
      window.location.assign(`/group/${groupId}`);
      // router.push(`/group/${groupId}`); router.refresh();
    } catch (e) {
      setJoinMsg(`❌ Network/JS Fehler: ${String(e)}`);
    }
  }


  return (
    <main className="relative min-h-screen text-white pt-20">
      <Background />
      <TopNav />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-white/60">
            Invite
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Gruppe beitreten
          </h1>

          <p className="mt-4 text-white/70 md:text-lg">
            Öffne die App, um der Gruppe beizutreten – oder installiere sie, falls
            du sie noch nicht hast.
          </p>

          {/* Invite Card */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-white/60">Invite-Code</div>
                <div className="mt-2 font-mono text-2xl">{code}</div>
              </div>
              
              <div className="mt-8 text-sm text-white/65">
                <div className="font-semibold text-white/80">Was passiert als Nächstes?</div>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>App öffnet sich direkt im Join-Screen.</li>
                  <li>Du siehst den heutigen Feed der Gruppe.</li>
                  <li>Dann kannst du deinen Song des Tages posten.</li>
                </ul>
              </div>

              {/* Status pill */}
              <div className="shrink-0">
                {loading ? (
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    Prüfe…
                  </span>
                ) : valid ? (
                  <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                    Gültig
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-200">
                    Ungültig
                  </span>
                )}
              </div>
            </div>

            {/* Group preview */}
            {!loading && valid && groupInfo?.groupName && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="text-xs uppercase tracking-widest text-white/50">
                  Gruppe
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {groupInfo.groupName}
                </div>
                {typeof groupInfo.memberCount === "number" && (
                  <div className="mt-1 text-xs text-white/60">
                    {groupInfo.memberCount} Mitglieder
                  </div>
                )}
              </div>
            )}

            {!loading && !valid && (
              <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                Dieser Invite-Code ist ungültig oder abgelaufen.
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {/* Primary: Join (web-first) */}
              {!loggedIn ? (
                <a
                  href={`/login?next=${encodeURIComponent(`/invite/${code}`)}`}
                  className={[
                    "inline-flex flex-1 items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition",
                    loading || meLoading
                      ? "bg-white/5 text-white/50 border border-white/10 cursor-wait"
                      : valid
                        ? "bg-[#1DB954] text-black hover:brightness-110 active:brightness-95"
                        : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed pointer-events-none",
                  ].join(" ")}
                >
                  {loading || meLoading ? "Prüfe…" : valid ? "Login um beizutreten" : "Invite ungültig"}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={joinGroup}
                  disabled={loading || !valid}
                  className={[
                    "inline-flex flex-1 items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition",
                    loading
                      ? "bg-white/5 text-white/50 border border-white/10 cursor-wait"
                      : valid
                        ? "bg-[#1DB954] text-black hover:brightness-110 active:brightness-95"
                        : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed",
                  ].join(" ")}
                >
                  {loading ? "Prüfe…" : "Jetzt beitreten"}
                </button>
              )}
              {joinMsg && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/70">
                  {joinMsg}
                </div>
              )}

              {/* Secondary: App open (mostly mobile) */}
              <SmartRedirect code={code} disabled={!canOpen} />
            </div>

            <div className="mt-4 text-xs text-white/50">
              Am PC trittst du über den Login bei. Am Handy kannst du auch direkt in der App beitreten.
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

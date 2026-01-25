"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Background from "../../components/Background";

export default function GroupsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // 1️⃣ Auth / Onboarding Check
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

        // 2️⃣ Gruppen laden
        const res = await fetch("/api/groups", { cache: "no-store" });
        const data = await res.json();

        if (!cancelled) {
          setGroups(data.groups || []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Groups page load error:", err);
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);
  async function createGroup() {
    const name = prompt("Name der neuen Gruppe:");
    if (!name) return;

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        alert("Gruppe konnte nicht erstellt werden");
        return;
      }

      const data = await fetch("/api/groups", { cache: "no-store" })
        .then((r) => r.json());

      setGroups(data.groups || []);
    } catch (err) {
      console.error(err);
      alert("Fehler beim Erstellen der Gruppe");
    }
  }

  return (
    <main className="relative min-h-screen text-white pt-20">
      <Background />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">
              Übersicht
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Deine Gruppen
            </h1>
            <p className="mt-3 text-white/70">
              Wähle eine Gruppe aus oder erstelle eine neue.
            </p>
          </div>

          <button
            type="button"
            onClick={createGroup}
            className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            + Neue Gruppe
          </button>

        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
          <div className="space-y-2">
            {loading && (
              <div className="text-sm text-white/50">
                Gruppen werden geladen…
              </div>
            )}

            {!loading && groups.length === 0 && (
              <div className="text-sm text-white/50">
                Du bist noch in keiner Gruppe.
              </div>
            )}

            {!loading &&
              groups.map((g) => (
                <a
                  key={g.id}
                  href={`/group/${g.id}`}
                  className="block rounded-2xl border border-white/10 bg-black/10 px-4 py-4 hover:bg-black/20 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">
                        {g.name}
                      </div>
                      <div className="mt-1 text-xs text-white/55">
                        Rolle: {g.role}
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                      Öffnen
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}

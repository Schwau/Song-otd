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

        const res = await fetch("/api/groups", { cache: "no-store" });
        const data = await res.json();

        if (!cancelled) {
          setGroups(data.groups || []);
          setLoading(false);
        }
      } catch {
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

    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      alert("Gruppe konnte nicht erstellt werden");
      return;
    }

    const data = await fetch("/api/groups", { cache: "no-store" }).then((r) =>
      r.json()
    );
    setGroups(data.groups || []);
  }

  return (
    <main className="relative min-h-screen pt-20">
      <Background />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-black/50 dark:text-white/60">
              Übersicht
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black dark:text-white">
              Deine Gruppen
            </h1>
            <p className="mt-3 text-black/70 dark:text-white/70">
              Wähle eine Gruppe aus oder erstelle eine neue.
            </p>
          </div>

          <button
            onClick={createGroup}
            className="
              rounded-2xl
              border border-black/10
              bg-black/[0.03]
              px-4 py-2.5
              text-sm font-semibold
              text-black
              hover:bg-black/[0.06]
              transition
              dark:border-white/15
              dark:bg-white/5
              dark:text-white
              dark:hover:bg-white/10
            "
          >
            + Neue Gruppe
          </button>
        </div>

        <div
          className="
            mt-6 rounded-3xl
            border border-black/10
            bg-white/80
            p-4 backdrop-blur
            dark:border-white/10
            dark:bg-white/5
          "
        >
          <div className="space-y-2">
            {loading && (
              <div className="text-sm text-black/50 dark:text-white/50">
                Gruppen werden geladen…
              </div>
            )}

            {!loading && groups.length === 0 && (
              <div className="text-sm text-black/50 dark:text-white/50">
                Du bist noch in keiner Gruppe.
              </div>
            )}

            {groups.map((g) => (
              <a
                key={g.id}
                href={`/group/${g.id}`}
                className="
                  block rounded-2xl
                  border border-black/10
                  bg-black/[0.03]
                  px-4 py-4
                  transition
                  hover:bg-black/[0.06]
                  dark:border-white/10
                  dark:bg-black/20
                  dark:hover:bg-black/30
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-black dark:text-white">
                      {g.name}
                    </div>
                    <div className="mt-1 text-xs text-black/55 dark:text-white/55">
                      Rolle: {g.role}
                    </div>
                  </div>

                  <span
                    className="
                      shrink-0 rounded-full
                      border border-black/10
                      bg-black/[0.03]
                      px-3 py-1
                      text-xs text-black/70
                      dark:border-white/10
                      dark:bg-black/20
                      dark:text-white/70
                    "
                  >
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

import Background from "../../components/Background";

export default function GroupsPage() {
  // DEV STUBS (später DB)
  const groups = [
    { id: "demo", name: "Beispielgruppe", memberCount: 5, todayCount: 0 },
    { id: "metal", name: "Metal Heads", memberCount: 3, todayCount: 2 },
    { id: "chill", name: "Cozy Vibes", memberCount: 8, todayCount: 1 },
  ];

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
            className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
            title="Kommt später"
          >
            + Neue Gruppe
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
          <div className="space-y-2">
            {groups.map((g) => (
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
                      {g.memberCount} Mitglieder · Heute: {g.todayCount} Songs
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                    Öffnen
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-4 text-xs text-white/40">
            (Später: echte Gruppen aus DB + unread indicators)
          </div>
        </div>
      </section>
    </main>
  );
}

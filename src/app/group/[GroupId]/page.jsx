import Background from "../../../components/Background";
import TopNav from "../../../components/TopNav";

export default async function GroupPage({ params }) {
  const { GroupId } = await params;

  // DEV STUBS (später DB)
  const groups = [
    { id: "demo", name: "Beispielgruppe", memberCount: 5, todayCount: 0 },
    { id: "metal", name: "Metal Heads", memberCount: 3, todayCount: 2 },
    { id: "chill", name: "Cozy Vibes", memberCount: 8, todayCount: 1 },
  ];

  const current =
    groups.find((g) => g.id.toLowerCase() === String(GroupId).toLowerCase()) ??
    { id: GroupId, name: `Gruppe ${GroupId}`, memberCount: 0, todayCount: 0 };

  return (
    <main className="relative min-h-screen text-white pt-20">
      <Background />
      <TopNav />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-10">
        {/* Back to overview */}
        <a
          href="/groups"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition"
        >
          ← Alle Gruppen
        </a>

        {/* Header */}
        <header className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div className="text-xs uppercase tracking-widest text-white/50">
            Gruppe
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {current.name}
          </h1>

          <p className="mt-2 text-sm text-white/60">
            {current.memberCount} Mitglieder · heute {current.todayCount} Songs
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
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              title="Kommt später"
            >
              Invite erstellen
            </button>
          </div>
        </header>

        {/* Feed */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/80">Heute</h2>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
              Coming soon
            </span>
          </div>

          {current.todayCount === 0 ? (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-6">
              <p className="text-white/70">Noch keine Songs heute.</p>
              <p className="mt-2 text-sm text-white/50">
                Poste den ersten Song des Tages 🎶
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-semibold">User A</div>
                <div className="mt-1 text-white/70">Song Title – Artist</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-semibold">User B</div>
                <div className="mt-1 text-white/70">Song Title – Artist</div>
              </div>
            </div>
          )}
        </section>

        <div className="mt-6 text-xs text-white/40">
          (Später: echte Group Daten, Members, Feed, Spotify Posts)
        </div>
      </section>
    </main>
  );
}

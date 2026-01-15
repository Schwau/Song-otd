import Background from "../../../components/Background";
import TopNav from "../../../components/TopNav";



export default async function GroupPage({ params }) {
  const { groupId = "" } = await params; // ✅ Next 16: params ist Promise

  return (
    <main className="relative min-h-screen text-white pt-20">
      <Background />
      <TopNav />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60">
                Gruppe
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                {groupId}
              </h1>
              <p className="mt-3 max-w-2xl text-white/70 md:text-lg">
                Willkommen! Hier erscheint gleich dein Feed: Songs des Tages, Kommentare und Highlights.
              </p>
            </div>

            {/* Quick actions */}
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                title="Kommt gleich"
              >
                Invite-Link
              </button>

              <button
                type="button"
                className="rounded-2xl bg-[#1DB954] px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110 active:brightness-95 transition"
                title="Kommt gleich"
              >
                Song posten
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Feed */}
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Heute</div>
                  <div className="mt-1 text-xs text-white/60">
                    Dein Feed für den aktuellen Tag
                  </div>
                </div>

                <span className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                  Coming soon
                </span>
              </div>

              {/* Empty state */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="text-sm font-semibold text-white/90">
                  Noch keine Songs heute
                </div>
                <p className="mt-2 text-sm text-white/65">
                  Als Nächstes bauen wir:
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-white/60">
                  <li>Song posten (Spotify Link)</li>
                  <li>Feed mit Karten (User, Song, Uhrzeit)</li>
                  <li>Kommentare & Reactions</li>
                </ul>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#1DB954] px-5 py-3 text-sm font-semibold text-black hover:brightness-110 active:brightness-95 transition"
                    title="Kommt gleich"
                  >
                    Ersten Song posten
                  </button>
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                    title="Kommt gleich"
                  >
                    Mitglieder ansehen
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="text-xs uppercase tracking-widest text-white/60">
                Übersicht
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/60">Group ID</div>
                <div className="mt-1 font-mono text-sm text-white/90">
                  {groupId}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/60">Mitglieder</div>
                  <div className="mt-1 text-lg font-semibold">—</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/60">Heute</div>
                  <div className="mt-1 text-lg font-semibold">—</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/60">Status</div>
                <div className="mt-2 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                  Aktiv
                </div>
                <p className="mt-3 text-xs text-white/55">
                  (Später: echte Rollen, Admin, Invite-Management)
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

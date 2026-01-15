export default async function GroupPage({ params }) {
  const { id } = await params; // Next 16: params is Promise

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Gruppe: {id}</h1>
        <p className="mt-3 text-white/70">
          Placeholder – später kommt hier der Feed (Today/History).
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-white/60">Heute</div>
          <div className="mt-2 text-white/80">
            Noch keine Songs – du könntest der Erste sein 🙂
          </div>
        </div>
      </div>
    </main>
  );
}

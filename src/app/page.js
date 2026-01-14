import Background from "../components/Background";
import DateSpinner from "../components/DateSpinner";

export default function Home() {
  return (
    <main className="relative min-h-screen text-white">
      <Background />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-20">
        <DateSpinner />

        <h1 className="mt-8 text-5xl font-semibold">
          Song des Tages<br />
          <span className="text-white/70">für deine Gruppe</span>
        </h1>

        <p className="mt-6 max-w-xl text-white/70">
          Jeden Tag ein neuer Song – automatisch, fair verteilt und sofort in eurer Playlist.
        </p>

        <div className="mt-8 flex gap-4">
          <button className="rounded-xl bg-white px-5 py-3 font-semibold text-black">
            Jetzt starten
          </button>
          <button className="rounded-xl border border-white/20 px-5 py-3">
            Mehr erfahren
          </button>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <h1 className="text-4xl font-semibold">song·otd</h1>

        <p className="text-white/70 mt-4 leading-relaxed">
          Share your song of the day with friends.
          One track a day. Simple group vibes.
        </p>

        <div className="mt-8 flex gap-3 flex-wrap">
          <a
            href="/invite/ABC123"
            className="px-5 py-3 rounded-2xl bg-[#1DB954]/20 border border-[#1DB954]/40 hover:bg-[#1DB954]/30 transition"
          >
            Try invite
          </a>

          <span className="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 text-white/60">
            App coming soon
          </span>
        </div>

        <p className="text-xs text-white/40 mt-6">
          Built with Next.js · Vercel
        </p>
      </div>
    </main>
  );
}

export default function InvitePage({ params }) {
  const code = params.code;
  const deepLink = `songotd://invite/${code}`;

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-[#1DB954] shadow-[0_0_20px_rgba(29,185,84,0.7)]" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Join song·otd</h1>
            <p className="text-white/60 text-sm mt-1">
              Invite code: <span className="font-mono text-white/80">{code}</span>
            </p>
          </div>
        </div>

        <p className="text-white/70 mt-6 leading-relaxed">
          You’ve been invited to a Song of the Day group.
          Open the app to join and share one track every day.
        </p>

        <div className="mt-8 flex gap-3">
          <a
            href={deepLink}
            className="px-5 py-3 rounded-2xl bg-[#1DB954]/20 border border-[#1DB954]/40 hover:bg-[#1DB954]/30 transition"
          >
            Open app
          </a>
          <a
            href="/"
            className="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
          >
            Learn more
          </a>
        </div>

        <p className="text-xs text-white/40 mt-6">
          App not installed yet? Store links coming soon.
        </p>
      </div>
    </main>
  );
}

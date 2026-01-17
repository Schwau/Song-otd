"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();

      if (!data.user) {
        router.replace("/login");
        return;
      }
      if (data.user.onboardingDone) {
        router.replace("/groups");
        return;
      }

      // optional: wenn schon username da ist, vorausfüllen
      setUsername(data.user.username || "");
      setImageUrl(data.user.imageUrl || "");
      setLoading(false);
    })();
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, imageUrl }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setSaving(false);
      setError(data?.error || "Fehler beim Speichern.");
      return;
    }

    router.replace("/groups");
  }

  if (loading) return null;

  return (
    <main className="mx-auto max-w-lg px-6 pt-28">
      <h1 className="text-2xl font-semibold text-white">Profil einrichten</h1>
      <p className="mt-2 text-white/60">
        Noch kurz Username auswählen (Profilbild optional).
      </p>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <input
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username (min. 3 Zeichen)"
        />

        <input
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Profilbild URL (optional)"
        />

        <button
          disabled={saving}
          className="w-full rounded-2xl bg-[#1DB954] px-4 py-3 font-semibold text-black transition hover:brightness-110 active:brightness-95 disabled:opacity-60"
        >
          {saving ? "Speichere…" : "Speichern"}
        </button>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
      </form>
    </main>
  );
}

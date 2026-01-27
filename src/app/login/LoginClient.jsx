"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const [magicUrl, setMagicUrl] = useState("");
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMagicUrl("");
    setStatus("sending");

    try {
      const res = await fetch("/api/auth/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, next }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setError(data?.error || "Konnte Link nicht senden.");
        return;
      }

      setStatus("sent");
      if (data?.url) setMagicUrl(data.url);
    } catch (err) {
      setStatus("error");
      setError("Netzwerkfehler.");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(magicUrl);
    } catch {}
  }

  return (
    <main className="mx-auto max-w-lg px-6 pt-28">
      <h1 className="text-2xl font-semibold text-white">Login</h1>
      <p className="mt-2 text-white/60">
        Gib deine E-Mail ein – du bekommst einen Login-Link.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="joao@test.de"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
        />

        <button
          disabled={status === "sending"}
          className="w-full rounded-2xl bg-[#1DB954] px-4 py-3 font-semibold text-black transition hover:brightness-110 active:brightness-95 disabled:opacity-60"
        >
          {status === "sending" ? "Sende…" : "Magic Link senden"}
        </button>

        {status === "error" && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {status === "sent" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            Link wurde erstellt. Check deine Mail.
            {magicUrl && (
              <div className="mt-3 space-y-2">
                <div className="break-all rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70">
                  {magicUrl}
                </div>
                <div className="flex gap-2">
                  <a
                    href={magicUrl}
                    className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                  >
                    Link öffnen
                  </a>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                  >
                    Kopieren
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </main>
  );
}

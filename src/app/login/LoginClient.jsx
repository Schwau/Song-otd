"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function safeNext(next) {
  if (!next || typeof next !== "string") return "/";
  if (!next.startsWith("/")) return "/";
  if (next.startsWith("//")) return "/";
  return next;
}

export default function LoginClient() {
  const sp = useSearchParams();
  const router = useRouter();

  // Kleine Verbesserung: sp.get(...) direkt als Dep benutzen (stabiler)
  const nextParam = sp.get("next");
  const next = useMemo(() => safeNext(nextParam), [nextParam]);

  const [msg, setMsg] = useState("");

  async function loginFake() {
    setMsg("Sende Login…");

    try {
      const res = await fetch("/api/auth/fake-login", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });

      const text = await res.text();

      if (!res.ok) {
        setMsg(`❌ API Fehler (${res.status}): ${text.slice(0, 120)}`);
        return;
      }

      setMsg("✅ Eingeloggt. Redirect…");
      router.push(next);
      router.refresh(); // cookie-aware server components
    } catch (e) {
      setMsg(`❌ Fetch Error: ${String(e)}`);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-white/70 text-sm">
          Dummy-Login, damit der Flow steht. Später kommt Spotify.
        </p>

        <button
          type="button"
          onClick={loginFake}
          className="mt-6 w-full rounded-2xl bg-[#1DB954] px-5 py-3 text-sm font-semibold text-black hover:brightness-110 active:brightness-95 transition"
        >
          Weiter (Dummy Login)
        </button>

        <p className="mt-3 text-xs text-white/50">
          Danach geht’s zurück zu: <span className="font-mono">{next}</span>
        </p>

        {msg && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/70">
            {msg}
          </div>
        )}
      </div>
    </main>
  );
}

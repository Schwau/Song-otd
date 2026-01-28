"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Background from "../../components/Background";

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
    } catch {
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
    <main className="relative min-h-screen">
      {/* 🌈 Background */}
      <Background />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-lg px-6 pt-28">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Login
        </h1>

        <p className="mt-2 text-black/60 dark:text-white/60">
          Gib deine E-Mail ein – du bekommst einen Login-Link.
        </p>

        {/* Card */}
        <div
          className="
            mt-6
            rounded-3xl
            border border-black/10
            bg-white/80
            p-6
            backdrop-blur
            shadow-sm
            dark:border-white/10
            dark:bg-white/5
          "
        >
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="joao@test.de"
              className="
                w-full rounded-2xl
                border border-black/10
                bg-white
                px-4 py-3
                text-black
                placeholder:text-black/40
                outline-none
                focus:border-emerald-400/50
                focus:ring-2 focus:ring-emerald-400/30
                dark:border-white/15
                dark:bg-white/5
                dark:text-white
                dark:placeholder:text-white/30
              "
            />

            <button
              disabled={status === "sending"}
              className="
                w-full rounded-2xl
                bg-[#1DB954]
                px-4 py-3
                font-semibold
                text-black
                transition
                hover:brightness-110
                active:brightness-95
                disabled:opacity-60
              "
            >
              {status === "sending" ? "Sende…" : "Magic Link senden"}
            </button>

            {/* Error */}
            {status === "error" && (
              <div
                className="
                  rounded-2xl
                  border border-red-500/20
                  bg-red-500/10
                  px-4 py-3
                  text-sm
                  text-red-700
                  dark:text-red-200
                "
              >
                {error}
              </div>
            )}

            {/* Success */}
            {status === "sent" && (
              <div
                className="
                  rounded-2xl
                  border border-black/10
                  bg-black/[0.03]
                  px-4 py-3
                  text-sm
                  text-black/80
                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-white/80
                "
              >
                Link wurde erstellt. Check deine Mail.

                {magicUrl && (
                  <div className="mt-3 space-y-2">
                    <div
                      className="
                        break-all rounded-xl
                        border border-black/10
                        bg-white
                        px-3 py-2
                        text-xs
                        text-black/70
                        dark:border-white/10
                        dark:bg-black/30
                        dark:text-white/70
                      "
                    >
                      {magicUrl}
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={magicUrl}
                        className="
                          rounded-xl
                          bg-black/5
                          px-3 py-2
                          text-xs font-semibold
                          text-black
                          hover:bg-black/10
                          dark:bg-white/10
                          dark:text-white
                          dark:hover:bg-white/15
                        "
                      >
                        Link öffnen
                      </a>

                      <button
                        type="button"
                        onClick={copyLink}
                        className="
                          rounded-xl
                          bg-black/5
                          px-3 py-2
                          text-xs font-semibold
                          text-black
                          hover:bg-black/10
                          dark:bg-white/10
                          dark:text-white
                          dark:hover:bg-white/15
                        "
                      >
                        Kopieren
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

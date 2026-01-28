"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";

/* ===============================
   Mini useMe (ohne externes Wissen)
   =============================== */

let cachedUser = undefined; // undefined = lädt, null = ausgeloggt, object = user
let inflight = null;

async function loadMe() {
  const r = await fetch("/api/me", {
    cache: "no-store",
    credentials: "include",
  });
  if (!r.ok) return null;
  const d = await r.json();
  return d?.user ?? null;
}

function useMe() {
  const [me, setMe] = useState(cachedUser);

  useEffect(() => {
    if (cachedUser !== undefined) return;

    if (!inflight) inflight = loadMe();

    inflight
      .then((user) => {
        cachedUser = user;
        inflight = null;
        setMe(user);
      })
      .catch(() => {
        cachedUser = null;
        inflight = null;
        setMe(null);
      });
  }, []);

  return me;
}

/* ===============================
   Avatar (kein Flackern)
   =============================== */

function Avatar({ src }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className="relative h-7 w-7">
      <div
        className={[
          "absolute inset-0 rounded-full bg-black/10 dark:bg-white/15",
          loaded ? "hidden" : "block",
        ].join(" ")}
      />

      {src ? (
        <img
          src={src}
          alt=""
          className={[
            "absolute inset-0 h-7 w-7 rounded-full object-cover",
            loaded ? "block" : "hidden",
          ].join(" ")}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      ) : null}
    </div>
  );
}

/* ===============================
   NavLink
   =============================== */

function NavLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={[
        "text-sm font-semibold transition",
        active
          ? "text-[#1DB954]"
          : "text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

/* ===============================
   TOP NAV
   =============================== */

export default function TopNav() {
  const me = useMe();
  const pathname = usePathname();
  const isGroupPage = pathname?.startsWith("/group");

  /* 🌗 system light / dark detection (SSR-safe) */
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);

    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[72px]">
      <div
        className={[
          "h-full border-b backdrop-blur-xl transition-colors",
          isDark
            ? isGroupPage
              ? "bg-black/60 border-white/10"
              : "bg-black/30 border-white/10"
            : isGroupPage
              ? "bg-white/85 border-black/10"
              : "bg-white/70 border-black/10",
        ].join(" ")}
      >
        <div className="mx-auto h-full max-w-6xl px-6">
          <div className="flex h-full items-center justify-between gap-4">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className="
                  relative
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-white
                  ring-1 ring-black/10
                  dark:bg-black
                  dark:ring-white/15
                "
              >
                {/* Accent Dot */}
                <span
                  className="
                    h-2.5 w-2.5 rounded-full
                    bg-[#1DB954]
                  "
                />

                {/* Subtle glow (nur Dark Mode) */}
                <span
                  className="
                    absolute inset-0 rounded-xl
                    dark:shadow-[0_0_14px_rgba(29,185,84,0.35)]
                  "
                />
              </div>

              <div className="leading-tight">
                <div className="text-sm font-semibold text-black dark:text-white">
                  Song des Tages
                </div>
                <div className="text-xs text-black/50 dark:text-white/50">
                  dein daily highlight
                </div>
              </div>
            </Link>

            {/* Links */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink
                href="/groups"
                active={
                  pathname === "/groups" || pathname.startsWith("/group")
                }
              >
                Gruppen
              </NavLink>
            </nav>

            {/* Right */}
            <div className="min-w-[200px] flex justify-end">
              {me === undefined ? (
                <div className="flex items-center gap-2 rounded-2xl bg-black/5 dark:bg-white/10 px-4 py-2.5">
                  <div className="h-7 w-7 rounded-full bg-black/10 dark:bg-white/15 animate-pulse" />
                  <div className="h-4 w-24 rounded bg-black/10 dark:bg-white/15 animate-pulse" />
                </div>
              ) : me ? (
                <Link
                  href="/profile"
                  className="
                    inline-flex items-center gap-2
                    rounded-2xl
                    bg-black/5 dark:bg-white/10
                    px-4 py-2.5
                    text-sm font-semibold
                    text-black dark:text-white
                    hover:bg-black/10 dark:hover:bg-white/15
                    transition
                  "
                  title={me.email || ""}
                >
                  <Avatar src={me.imageUrl} />
                  <span className="max-w-[160px] truncate">
                    {me.username || me.email}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="
                    inline-flex items-center justify-center
                    rounded-2xl
                    bg-[#1DB954]
                    px-4 py-2.5
                    text-sm font-semibold
                    text-black
                    hover:brightness-110
                    active:brightness-95
                    transition
                  "
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

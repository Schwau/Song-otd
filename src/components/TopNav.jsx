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
      {/* Fallback */}
      <div
        className={[
          "absolute inset-0 rounded-full bg-white/15",
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
        active ? "text-[#1DB954]" : "text-white/70 hover:text-white",
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

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[72px]">
      <div
        className={[
          "h-full border-b border-white/10",
          isGroupPage
            ? "bg-black/60"
            : "bg-black/30 backdrop-blur",
        ].join(" ")}
      >
        <div className="mx-auto h-full max-w-6xl px-6">
          <div className="flex h-full items-center justify-between gap-4">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Logo size={20} />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">
                  Song des Tages
                </div>
                <div className="text-xs text-white/50">
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

            {/* Right – feste Breite => kein Springen */}
            <div className="min-w-[200px] flex justify-end">
              {me === undefined ? (
                <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5">
                  <div className="h-7 w-7 rounded-full bg-white/15 animate-pulse" />
                  <div className="h-4 w-24 rounded bg-white/15 animate-pulse" />
                </div>
              ) : me ? (
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition"
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
                  className="inline-flex items-center justify-center rounded-2xl bg-[#1DB954] px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110 active:brightness-95 transition"
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

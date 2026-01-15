"use client";

import Link from "next/link";
import Logo from "./Logo";

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm font-semibold text-white/70 hover:text-white transition"
    >
      {children}
    </Link>
  );
}

export default function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* full-width bar */}
      <div className="mx-auto w-full border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Logo size={20} />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">Song des Tages</div>
                <div className="text-xs text-white/50">dein daily highlight</div>
              </div>
            </Link>

            {/* Links */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink href="#funktion">So funktioniert’s</NavLink>
              <NavLink href="#roadmap">Roadmap</NavLink>
              <NavLink href="/login">Login</NavLink>
              <span className="text-sm font-semibold text-white/35" title="Kommt bald">
                Gruppen
              </span>
            </nav>

            {/* CTA */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl bg-[#1DB954] px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110 active:brightness-95 transition"
            >
              Start
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

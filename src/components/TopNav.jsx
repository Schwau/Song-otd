"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";

function NavLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={[
        "text-sm font-semibold transition",
        active
          ? "text-[#1DB954]"
          : "text-white/70 hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto w-full border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
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
                active={pathname === "/groups" || pathname.startsWith("/group")}
              >
                Gruppen
              </NavLink>
            </nav>

            {/* Login Button */}
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

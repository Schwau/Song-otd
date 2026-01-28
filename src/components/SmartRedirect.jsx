"use client";

import { useEffect, useMemo, useState } from "react";

function detectDevice() {
  if (typeof window === "undefined") {
    return { isMobile: false, platform: "unknown" };
  }

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isMobile =
    isAndroid ||
    isIOS ||
    (navigator.maxTouchPoints > 1 && /Mobile|Tablet/i.test(ua));

  return {
    isMobile,
    platform: isAndroid ? "android" : isIOS ? "ios" : "desktop",
  };
}

export default function SmartRedirect({ code, disabled = false }) {
  const deepLink = useMemo(() => `songotd://invite/${code}`, [code]);

  const [{ isMobile, platform }, setDevice] = useState({
    isMobile: false,
    platform: "unknown",
  });

  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setDevice(detectDevice());
  }, []);

  useEffect(() => {
    if (disabled || !isMobile) return;

    setStatus("trying");

    let didHide = false;
    const onVisChange = () => {
      if (document.visibilityState === "hidden") {
        didHide = true;
        setStatus("opened");
      }
    };

    document.addEventListener("visibilitychange", onVisChange);
    window.location.href = deepLink;

    const t = setTimeout(() => {
      if (!didHide) setStatus("fallback");
    }, 900);

    return () => {
      document.removeEventListener("visibilitychange", onVisChange);
      clearTimeout(t);
    };
  }, [deepLink, disabled, isMobile]);

  const openPrimary = () => {
    if (disabled) return;
    if (!isMobile) {
      navigator.clipboard.writeText(window.location.href);
      return;
    }
    window.location.href = deepLink;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Primary */}
        <button
          onClick={openPrimary}
          disabled={disabled}
          className={[
            "inline-flex flex-1 items-center justify-center",
            "rounded-2xl px-5 py-3 text-sm font-semibold transition",
            disabled
              ? "bg-black/[0.04] text-black/30 border border-black/10 cursor-not-allowed dark:bg-white/5 dark:text-white/30 dark:border-white/10"
              : "bg-[#1DB954] text-black hover:brightness-110 active:brightness-95",
          ].join(" ")}
        >
          {disabled
            ? "Invite ungültig"
            : isMobile
              ? "App öffnen"
              : "Link kopieren"}
        </button>

        {/* Secondary */}
        <button
          type="button"
          className="
            inline-flex flex-1 items-center justify-center
            rounded-2xl px-5 py-3 text-sm font-semibold transition
            border border-black/10 bg-white/70 text-black
            hover:bg-white
            dark:border-white/15 dark:bg-white/5 dark:text-white
            dark:hover:bg-white/10
          "
        >
          {platform === "android"
            ? "Android installieren"
            : platform === "ios"
              ? "iOS installieren"
              : "App installieren"}
        </button>
      </div>

      {/* Info */}
      {status === "fallback" && (
        <div className="
          rounded-xl px-4 py-3 text-xs
          border border-black/10 bg-white/70 text-black/70
          dark:border-white/10 dark:bg-black/30 dark:text-white/70
        ">
          App nicht installiert? Dann „App installieren“.
        </div>
      )}
    </div>
  );
}

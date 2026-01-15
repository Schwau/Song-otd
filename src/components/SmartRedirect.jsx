"use client";

import { useEffect, useMemo, useState } from "react";

// very lightweight device detection
function detectDevice() {
  if (typeof window === "undefined") return { isMobile: false, platform: "unknown" };

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

  const [{ isMobile, platform }, setDevice] = useState(() => ({
    isMobile: false,
    platform: "unknown",
  }));

  const [status, setStatus] = useState("idle"); // idle | trying | opened | fallback | comingSoon

  useEffect(() => {
    setDevice(detectDevice());
  }, []);

  // Auto-try ONLY on mobile
  useEffect(() => {
    if (disabled) return;
    if (!isMobile) return;

    setStatus("trying");

    let fallbackTimer = null;
    let didHide = false;

    const onVisChange = () => {
      if (document.visibilityState === "hidden") {
        didHide = true;
        setStatus("opened");
      }
    };

    document.addEventListener("visibilitychange", onVisChange);

    // Try open app
    window.location.href = deepLink;

    // If not opened quickly, show fallback
    fallbackTimer = setTimeout(() => {
      if (!didHide) setStatus("fallback");
    }, 900);

    return () => {
      document.removeEventListener("visibilitychange", onVisChange);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [deepLink, disabled, isMobile]);

  const openApp = () => {
    if (disabled) return;

    if (!isMobile) {
      // Desktop can't deep-link reliably; show coming soon
      setStatus("comingSoon");
      return;
    }

    setStatus("trying");
    window.location.href = deepLink;
    setTimeout(() => setStatus("fallback"), 900);
  };

  const installApp = () => {
    // Later: real store links.
    // For now: show a nice "coming soon" state.
    setStatus("comingSoon");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("idle");
    } catch {
      // ignore
    }
  };

  // Button labels depending on device
  const primaryLabel = disabled
    ? "Invite ungültig"
    : isMobile
      ? (status === "trying" ? "Öffne App…" : "App öffnen")
      : "Link kopieren";

  const onPrimaryClick = isMobile ? openApp : copyLink;

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onPrimaryClick}
          disabled={disabled}
          className={[
            "inline-flex flex-1 items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition",
            disabled
              ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
              : "bg-[#1DB954] text-black hover:brightness-110 active:brightness-95",
          ].join(" ")}
          title={!isMobile ? "Am Desktop kopieren wir den Link statt die App zu öffnen." : undefined}
        >
          {primaryLabel}
        </button>

        <button
          type="button"
          onClick={installApp}
          className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
        >
          {platform === "android" ? "Android installieren" : platform === "ios" ? "iOS installieren" : "App installieren"}
        </button>
      </div>

      {/* Mobile fallback hint */}
      {status === "fallback" && isMobile && (
        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/70">
          App nicht installiert? Dann „App installieren“.
        </div>
      )}

      {/* Desktop / Coming soon */}
      {status === "comingSoon" && (
        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/70">
          {platform === "desktop" ? (
            <>
              Desktop: Es gibt (noch) keine PC-App. Du kannst aber den Link kopieren und am Handy öffnen.
            </>
          ) : (
            <>
              App ist noch nicht im Store. Coming soon 🙂<br />
              (Später: App Store / Play Store Links hier.)
            </>
          )}
        </div>
      )}
    </div>
  );
}

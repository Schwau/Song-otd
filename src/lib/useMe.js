let cachedUser = undefined; // undefined = unknown, null = logged out, object = user
let inflight = null;

function safeReadCache() {
  try {
    const raw = localStorage.getItem("songotd_me");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed ?? null;
  } catch {
    return undefined;
  }
}

function safeWriteCache(user) {
  try {
    localStorage.setItem("songotd_me", JSON.stringify(user));
  } catch {}
}

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
  const [me, setMe] = useState(() => {
    // 1) In-memory cache first
    if (cachedUser !== undefined) return cachedUser;

    // 2) localStorage fallback (damit sofort Username da ist)
    if (typeof window !== "undefined") {
      const fromLS = safeReadCache();
      if (fromLS !== undefined) {
        cachedUser = fromLS;
        return fromLS;
      }
    }

    return undefined;
  });

  useEffect(() => {
    let cancelled = false;

    // immer im Hintergrund verifizieren, aber UI nicht "leeren"
    if (!inflight) inflight = loadMe();

    inflight
      .then((user) => {
        inflight = null;
        cachedUser = user;
        safeWriteCache(user);
        if (!cancelled) setMe(user);
      })
      .catch(() => {
        inflight = null;
        // wenn wir bereits was aus LS haben, lass es stehen
        if (cachedUser === undefined) {
          cachedUser = null;
          safeWriteCache(null);
          if (!cancelled) setMe(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return me;
}

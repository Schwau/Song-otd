// src/lib/unifiedTrack.js

/**
 * Plattform-agnostisches Song-Format
 * ALLES im UI arbeitet nur mit diesem Shape
 */
export function createUnifiedTrack({
  id,
  title,
  artist,
  coverUrl = null,
  source,
  openUrl,
}) {
  return {
    id,           // z.B. "spotify:abc123", "apple:xyz", "yt:987"
    title,        // Songtitel
    artist,       // Haupt-Artist
    coverUrl,     // Album-Cover (URL oder null)
    source,       // "spotify" | "apple" | "youtube"
    openUrl,      // öffnet Song in App oder Web
  };
}

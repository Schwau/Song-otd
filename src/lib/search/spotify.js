// src/lib/search/spotify.js

import { createUnifiedTrack } from "../unifiedTrack";

let cachedToken = null;
let tokenExpiresAt = 0;

async function getSpotifyAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error("Spotify auth failed");
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken;
}

export async function searchSpotify(query, limit = 5) {
  if (!query) return [];

  const token = await getSpotifyAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(
      query
    )}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Spotify search failed");
  }

  const data = await res.json();
  const tracks = data?.tracks?.items ?? [];

  return tracks.map((track) =>
    createUnifiedTrack({
      id: `spotify:${track.id}`,
      title: track.name,
      artist: track.artists?.[0]?.name ?? "Unknown",
      coverUrl: track.album?.images?.[0]?.url ?? null,
      source: "spotify",
      openUrl: track.external_urls?.spotify ?? null,
    })
  );
}

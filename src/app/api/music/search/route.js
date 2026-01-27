export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=6`;
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();

    const results = (data.data || []).map((item) => ({
      trackName: item.title,
      artistName: item.artist?.name,
      coverUrl: item.album?.cover_xl || null,
    }));

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Deezer search error:", err);
    return NextResponse.json({ results: [] });
  }
}

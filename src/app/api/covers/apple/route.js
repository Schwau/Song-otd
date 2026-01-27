export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const track = searchParams.get("track");
    const artist = searchParams.get("artist");

    if (!track || !artist) {
      return NextResponse.json({ coverUrl: null });
    }

    const term = encodeURIComponent(`${artist} ${track}`);
    const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`;

    const res = await fetch(url);
    if (!res.ok) return NextResponse.json({ coverUrl: null });

    const data = await res.json();
    const item = data?.results?.[0];

    if (!item?.artworkUrl100) {
      return NextResponse.json({ coverUrl: null });
    }

    // 100x100 → 600x600
    const coverUrl = item.artworkUrl100.replace("100x100", "600x600");

    return NextResponse.json({
      coverUrl,
      provider: "apple",
    });
  } catch (e) {
    console.error("Apple music cover error:", e);
    return NextResponse.json({ coverUrl: null });
  }
}

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

    const query = encodeURIComponent(`${track} ${artist}`);

    const res = await fetch(
      `https://itunes.apple.com/search?term=${query}&media=music&limit=1`
    );

    const data = await res.json();
    const item = data?.results?.[0];

    if (!item?.artworkUrl100) {
      return NextResponse.json({ coverUrl: null });
    }

    // höhere Auflösung
    const coverUrl = item.artworkUrl100.replace("100x100", "600x600");

    return NextResponse.json({ coverUrl });
  } catch (err) {
    console.error("Apple cover error", err);
    return NextResponse.json({ coverUrl: null });
  }
}

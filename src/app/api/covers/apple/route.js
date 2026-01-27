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

    /* -------------------------
       1) Apple Music (wie bisher)
    -------------------------- */
    const term = encodeURIComponent(`${artist} ${track}`);
    const appleUrl = `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`;

    const appleRes = await fetch(appleUrl);
    if (appleRes.ok) {
      const appleData = await appleRes.json();
      const item = appleData?.results?.[0];

      if (item?.artworkUrl100) {
        const coverUrl = item.artworkUrl100.replace("100x100", "600x600");
        return NextResponse.json({
          coverUrl,
          provider: "apple",
        });
      }
    }

    /* -------------------------
       2) Deezer Fallback
    -------------------------- */
    const deezerQuery = encodeURIComponent(`track:"${track}" artist:"${artist}"`);
    const deezerUrl = `https://api.deezer.com/search?q=${deezerQuery}&limit=1`;

    const deezerRes = await fetch(deezerUrl);
    if (deezerRes.ok) {
      const deezerData = await deezerRes.json();
      const item = deezerData?.data?.[0];

      if (item?.album?.cover_xl) {
        return NextResponse.json({
          coverUrl: item.album.cover_xl,
          provider: "deezer",
        });
      }
    }

    /* -------------------------
       3) Nothing found
    -------------------------- */
    return NextResponse.json({ coverUrl: null });
  } catch (e) {
    console.error("Cover lookup error:", e);
    return NextResponse.json({ coverUrl: null });
  }
}

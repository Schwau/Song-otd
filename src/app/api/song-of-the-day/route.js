export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function readSessionToken(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/songotd_session=([^;]+)/);
  return match?.[1];
}

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; // "2026-01-28"
}


export async function GET(req) {
  try {
    const token = readSessionToken(req);
    if (!token) return NextResponse.json({ song: null });

    const session = await prisma.session.findUnique({
      where: { token },
    });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ song: null });
    }

    const song = await prisma.songOfTheDay.findFirst({
      where: {
        userId: session.userId,
        date: todayKey(),
      },
    });



    return NextResponse.json({ song });
  } catch (e) {
    console.error("GET /song-of-the-day", e);
    return NextResponse.json({ song: null });
  }
}

async function fetchCover(trackName, artistName) {
  const res = await fetch(
    `/api/music/apple?track=${encodeURIComponent(trackName)}&artist=${encodeURIComponent(artistName)}`
  );
  const data = await res.json();
  return data.coverUrl ?? null;
}

export async function POST(req) {
  try {
    const token = readSessionToken(req);
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { token },
    });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const body = await req.json();
    const { spotifyTrackId, trackName, artistName, coverUrl } = body;

    if (!spotifyTrackId || !trackName || !artistName) {
      return NextResponse.json(
        { error: "Missing track data" },
        { status: 400 }
      );
    }

    const song = await prisma.songOfTheDay.create({
      data: {
        userId: session.userId,
        date: todayKey(),
        spotifyTrackId,
        trackName,
        artistName,
        coverUrl,
      },
    });

    return NextResponse.json({ song }, { status: 201 });
  } catch (e) {
    // Prisma unique violation = Song schon gesetzt
    if (e?.code === "P2002") {
      return NextResponse.json(
        { error: "Song already set for today" },
        { status: 409 }
      );
    }

    console.error("POST /song-of-the-day", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

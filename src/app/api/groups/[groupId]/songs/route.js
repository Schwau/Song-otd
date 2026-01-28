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
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET(req, { params }) {
  try {
    const { groupId } = await params;

    // 1) Auth
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

    // 2) Membership check
    const membership = await prisma.membership.findUnique({
      where: {
        userId_groupId: {
          userId: session.userId,
          groupId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3) Alle Mitglieder inkl. Userdaten
    const members = await prisma.membership.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
    });

    // 4) Alle Songs von heute
    const songsToday = await prisma.songOfTheDay.findMany({
      where: {
        userId: { in: members.map((m) => m.userId) },
        date: todayKey(),
      },
    });

    // 5) Zusammenführen (DAS ist der entscheidende Teil)
    const result = members.map((m) => {
      const song = songsToday.find((s) => s.userId === m.userId) || null;
      return {
        user: m.user,
        song,
      };
    });

    return NextResponse.json({ songs: result });
  } catch (e) {
    console.error("GET /api/groups/[groupId]/songs", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

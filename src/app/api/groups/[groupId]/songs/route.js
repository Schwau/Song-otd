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
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(req, ctx) {
  try {
    const { groupId } = await ctx.params;

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

    // 2) Membership prüfen
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

    // 3) Mitglieder
    const members = await prisma.membership.findMany({
      where: { groupId },
      select: { userId: true },
    });

    const userIds = members.map((m) => m.userId);

    // 4) Songs des Tages
    const songs = await prisma.songOfTheDay.findMany({
      where: {
        userId: { in: userIds },
        date: todayKey(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ songs });
  } catch (e) {
    console.error("GET /api/groups/[groupId]/songs", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/groups
 * - liest Session-Cookie
 * - validiert Session
 * - gibt alle Gruppen des Users zurück
 */
export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/songotd_session=([^;]+)/);
    const sessionToken = match?.[1];

    if (!sessionToken) {
      return NextResponse.json({ groups: [] }, { status: 200 });
    }

    const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: {
            user: {
            select: {
                id: true,
                memberships: {
                include: { group: true },
                orderBy: { createdAt: "asc" },
                },
            },
            },
        },
        });

        if (!session || session.expiresAt < new Date()) {
        return NextResponse.json({ groups: [] }, { status: 200 });
        }

        const groups = session.user.memberships.map((m) => ({
        id: m.group.id,
        name: m.group.name,
        role: m.role,
        createdAt: m.group.createdAt,
        }));

        return NextResponse.json({ groups }, { status: 200 });
  } catch (err) {
    console.error("GET /api/groups error:", err);
    return NextResponse.json({ groups: [] }, { status: 200 });
  }
}

export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/songotd_session=([^;]+)/);
    const sessionToken = match?.[1];

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const name = body?.name?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Name required" },
        { status: 400 }
      );
    }
    const group = await prisma.group.create({
        data: {
            name,
        },
    });

        await prisma.membership.create({
        data: {
            groupId: group.id,
            userId: session.userId,
            role: "owner",
        },
    });


    return NextResponse.json({ group }, { status: 201 });
  } catch (err) {
    console.error("POST /api/groups error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}



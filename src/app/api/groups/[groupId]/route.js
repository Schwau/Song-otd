export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/groups/[groupId]
 * - liest Session-Cookie
 * - validiert Session
 * - prüft Membership
 * - gibt Group + Members zurück
 */
export async function GET(req, ctx) {
  try {
    const { groupId } = await ctx.params;

    // Session-Cookie lesen
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/songotd_session=([^;]+)/);
    const sessionToken = match?.[1];

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Session validieren
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // Membership prüfen + Group laden
    const membership = await prisma.membership.findUnique({
      where: {
        userId_groupId: {
          userId: session.userId,
          groupId,
        },
      },
      include: {
        group: {
          include: {
            memberships: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const group = membership.group;

    return NextResponse.json(
      {
        group: {
          id: group.id,
          name: group.name,
          yourRole: membership.role,
          members: group.memberships.map((m) => ({
            id: m.user.id,
            username: m.user.username,
            imageUrl: m.user.imageUrl,
          })),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/groups/[groupId] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

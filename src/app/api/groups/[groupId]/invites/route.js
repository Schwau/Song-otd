export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

function readSessionToken(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/songotd_session=([^;]+)/);
  return match?.[1];
}

function makeCode() {
  // kurz, URL-sicher, wenig Verwechslungszeichen
  return crypto.randomBytes(6).toString("base64url"); // ~8 chars
}

export async function POST(req, ctx) {
  try {
    const { groupId } = await ctx.params;

    const sessionToken = readSessionToken(req);
    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({ where: { token: sessionToken } });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // Nur owner darf Invites erstellen
    const membership = await prisma.membership.findUnique({
      where: { userId_groupId: { userId: session.userId, groupId } },
      select: { role: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (membership.role !== "owner") {
      return NextResponse.json({ error: "Owner only" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const days = Number(body?.expiresInDays ?? 7);
    const expiresAt =
      Number.isFinite(days) && days > 0
        ? new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        : null;

    // Code erzeugen (mit ein paar Retries wegen Unique)
    let invite = null;
    for (let i = 0; i < 5; i++) {
      const code = makeCode();
      try {
        invite = await prisma.invite.create({
          data: {
            code,
            groupId,
            expiresAt,
          },
        });
        break;
      } catch (e) {
        if (!(e && e.code === "P2002")) throw e; // collision, retry
      }
    }

    if (!invite) {
      return NextResponse.json({ error: "Could not create invite" }, { status: 500 });
    }

    return NextResponse.json(
      {
        invite: {
          code: invite.code,
          groupId: invite.groupId,
          expiresAt: invite.expiresAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/groups/[groupId]/invites error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

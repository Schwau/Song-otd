export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function readSessionToken(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/songotd_session=([^;]+)/);
  return match?.[1];
}

export async function POST(req, ctx) {
  try {
    const { code } = await ctx.params;
    const safeCode = String(code || "");

    const sessionToken = readSessionToken(req);
    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({ where: { token: sessionToken } });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const invite = await prisma.invite.findUnique({
      where: { code: safeCode },
      include: { group: true },
    });

    if (!invite) return NextResponse.json({ error: "Invalid invite" }, { status: 404 });

    const now = new Date();
    if (invite.expiresAt && invite.expiresAt < now) {
      return NextResponse.json({ error: "Invite expired" }, { status: 400 });
    }

    const existing = await prisma.membership.findUnique({
      where: {
        userId_groupId: {
          userId: session.userId,
          groupId: invite.groupId,
        },
      },
    });

    if (!existing) {
      await prisma.membership.create({
        data: {
          userId: session.userId,
          groupId: invite.groupId,
          role: "member",
        },
      });
    }

    return NextResponse.json(
      { ok: true, groupId: invite.groupId, alreadyMember: Boolean(existing) },
      { status: 200 }
    );


    return NextResponse.json({ ok: true, groupId: invite.groupId }, { status: 200 });
  } catch (err) {
    console.error("POST /api/invites/[code]/redeem error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req, ctx) {
  try {
    const { code } = await ctx.params;
    const safeCode = String(code || "");

    if (!safeCode) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    const invite = await prisma.invite.findUnique({
      where: { code: safeCode },
      include: { group: true },
    });

    if (!invite) return NextResponse.json({ valid: false }, { status: 200 });

    const now = new Date();
    const expired = invite.expiresAt && invite.expiresAt < now;
    const used = Boolean(invite.usedAt);

    if (expired || used) return NextResponse.json({ valid: false }, { status: 200 });

    const memberCount = await prisma.membership.count({
      where: { groupId: invite.groupId },
    });

    return NextResponse.json(
      {
        valid: true,
        code: invite.code,
        groupId: invite.groupId,
        groupName: invite.group.name,
        memberCount,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/invites/[code] error:", err);
    return NextResponse.json({ valid: false }, { status: 200 });
  }
}

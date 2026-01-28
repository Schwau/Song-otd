export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/login", process.env.APP_URL)
      );
    }

    const magic = await prisma.magicLink.findUnique({
      where: { token },
    });

    if (!magic || magic.usedAt || magic.expiresAt < new Date()) {
      return NextResponse.redirect(
        new URL("/login?error=invalid", process.env.APP_URL)
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: magic.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email: magic.email },
      });
    }

    const session = await prisma.session.create({
      data: {
        token: crypto.randomBytes(32).toString("hex"),
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.magicLink.update({
      where: { id: magic.id },
      data: { usedAt: new Date() },
    });

    const res = NextResponse.redirect(
      new URL(magic.next ?? "/", process.env.APP_URL)
    );

    res.cookies.set("songotd_session", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (e) {
    console.error("MAGIC CONFIRM ERROR", e);
    return NextResponse.redirect(
      new URL("/login?error=server", process.env.APP_URL)
    );
  }
}

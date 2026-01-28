export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req) {
  console.log("CONFIRM START");

  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    console.log("TOKEN:", token);

    const magic = await prisma.magicLink.findUnique({ where: { token } });
    console.log("MAGIC:", magic);

    let user = await prisma.user.findUnique({
      where: { email: magic.email },
    });
    console.log("USER FOUND:", user?.id);

    if (!user) {
      user = await prisma.user.create({
        data: { email: magic.email },
      });
      console.log("USER CREATED:", user.id);
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    console.log("SESSION TOKEN GEN");

    const session = await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    console.log("SESSION CREATED:", session.id);

    const res = NextResponse.redirect(
      new URL("/", process.env.APP_URL)
    );

    res.cookies.set("songotd_session", session.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    console.log("COOKIE SET");
    return res;

  } catch (e) {
    console.error("CONFIRM CRASH:", e);
    throw e;
  }
}


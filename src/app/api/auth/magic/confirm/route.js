export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { newSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?e=missing_token", req.url));
  }

  const magic = await prisma.magicLink.findUnique({ where: { token } });

  if (!magic) {
    return NextResponse.redirect(new URL("/login?e=invalid_token", req.url));
  }

  if (magic.expiresAt <= new Date()) {
    return NextResponse.redirect(new URL("/login?e=expired", req.url));
  }

  // optional falls du usedAt hast
  if (magic.usedAt) {
    return NextResponse.redirect(new URL("/login?e=used", req.url));
  }

  // find or create user by email
  let user = await prisma.user.findUnique({ where: { email: magic.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: magic.email,
        onboardingDone: false,
      },
    });
  }

  // create session
  const sessionToken = newSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 Tage

  await prisma.session.create({
    data: {
      token: sessionToken,
      userId: user.id,
      expiresAt,
    },
  });

  // mark magic link used (oder löschen)
  await prisma.magicLink.update({
    where: { token },
    data: { usedAt: new Date() },
  });

  const next =
    typeof magic.next === "string" && magic.next.startsWith("/")
      ? magic.next
      : "/";

  const target = user.onboardingDone ? next : "/onboarding";
  const res = NextResponse.redirect(new URL(target, req.url));

  res.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return res;
}

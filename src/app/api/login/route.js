import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { newSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const username = (body.username || "demo").trim().toLowerCase();

  const user = await prisma.user.upsert({
    where: { username },
    update: {},
    create: { username },
  });

  const token = newSessionToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await prisma.session.create({
    data: { token, userId: user.id, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });

  return NextResponse.json({ user });
}

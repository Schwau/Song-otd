import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Invalid email" },
      { status: 400 }
    );
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await prisma.magicLink.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/magic/confirm?token=${token}`;

console.log("✨ MAGIC LINK:", url);

return NextResponse.json({
  ok: true,
  // nur in dev zurückgeben (praktisch zum Testen)
  ...(process.env.NODE_ENV !== "production" ? { url } : {}),
});
}

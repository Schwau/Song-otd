import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function POST(req) {
  const user = await requireUser();
  const { username, imageUrl } = await req.json();

  if (!username || username.trim().length < 3) {
    return NextResponse.json(
      { error: "Username muss mindestens 3 Zeichen haben." },
      { status: 400 }
    );
  }

  const cleanUsername = username.trim();

  if (imageUrl && !/^https?:\/\//.test(imageUrl)) {
    return NextResponse.json(
      { error: "Profilbild muss eine http(s) URL sein." },
      { status: 400 }
    );
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: cleanUsername,
        imageUrl: imageUrl?.trim() ? imageUrl.trim() : null,
        onboardingDone: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Username ist leider schon vergeben." },
      { status: 409 }
    );
  }
}

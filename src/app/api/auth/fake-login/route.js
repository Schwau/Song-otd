import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const token = `dev_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const res = NextResponse.json(
      { ok: true },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );

    // ✅ Cookie direkt auf Response setzen (keine next/headers cookies())
    res.cookies.set({
      name: "songotd_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}

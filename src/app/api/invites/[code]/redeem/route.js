import { NextResponse } from "next/server";

export async function POST(_req, { params }) {
  const { code = "" } = await params; // ✅ Next 16
  const trimmed = code.trim();


  console.log("[POST /api/invites/[code]/redeem] code =", JSON.stringify(code));

  if (!code) {
    return NextResponse.json({ ok: false, error: "missing_code" }, { status: 400 });
  }

  // Dev-Join-Stub: immer erfolgreich
  return NextResponse.json(
    { ok: true, redirectTo: "/group/demo" },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

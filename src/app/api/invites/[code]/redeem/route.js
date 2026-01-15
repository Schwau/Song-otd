import { NextResponse } from "next/server";

export async function POST(_req, { params }) {
  const { code = "" } = await params; // ✅ Next 16: params ist Promise
  const trimmed = code.trim();

  console.log("[POST /api/invites/[code]/redeem] code =", JSON.stringify(trimmed));

  if (!trimmed) {
    return NextResponse.json(
      { ok: false, error: "missing_code" },
      { status: 400, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  // ✅ STUB: Code -> GroupID Mapping (bis DB kommt)
  // Regel: groupId = "g_" + code (nur wenn code safe ist)
  const safe = /^[a-zA-Z0-9-_]{4,64}$/.test(trimmed);
  if (!safe) {
    return NextResponse.json(
      { ok: false, error: "invalid_code_format" },
      { status: 400, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  const groupId = `g_${trimmed}`; // z.B. abcd -> g_abcd

  return NextResponse.json(
    { ok: true, groupId, redirectTo: `/group/${groupId}` },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

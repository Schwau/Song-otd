import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
  const { code = "" } = await params;
  const trimmed = code.trim();

  const valid = /^[a-zA-Z0-9-_]{4,64}$/.test(trimmed);

  const groupId = valid ? `g_${trimmed}` : null;

  return NextResponse.json(
    {
      valid,
      code: trimmed,
      groupId,
      groupName: groupId ? `Gruppe ${groupId}` : null,
      memberCount: 1,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

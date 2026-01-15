import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET(_req, { params }) {
  const { code } = await params;

  return NextResponse.json(
    {
      valid: true,
      code,
      groupName: "Beispielgruppe",
      memberCount: 5,
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

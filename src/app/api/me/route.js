import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req) {
  const session = req.cookies.get("songotd_session")?.value;

  if (!session) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  // stub user
  return NextResponse.json(
    {
      loggedIn: true,
      user: { id: "dev-user", name: "Joao (dev)" },
    },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}

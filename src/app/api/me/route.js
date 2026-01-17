import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  const user = await getUserFromRequest();
  return NextResponse.json({ user });
}

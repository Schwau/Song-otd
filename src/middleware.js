import { NextResponse } from "next/server";

export function middleware(req) {
  // example: protect /group pages later
  const url = req.nextUrl;
  const isProtected = url.pathname.startsWith("/group");

  if (!isProtected) return NextResponse.next();

  const session = req.cookies.get("songotd_session")?.value;

  if (!session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/group/:path*"],
};

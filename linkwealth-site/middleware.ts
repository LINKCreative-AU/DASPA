import { NextRequest, NextResponse } from "next/server";

// Old-site links sometimes carried capitals in paths (the old Elementor site linked
// /SMSF). A redirects() rule can't fix this: Next
// matches redirect sources case-insensitively, so a lowercasing rule matches
// its own destination and loops forever (found live, 8 Aug). Middleware only
// fires when the path genuinely differs from its lowercase form.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lower = pathname.toLowerCase();
  if (pathname !== lower) {
    const url = req.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

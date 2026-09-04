import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.hostname ||
    "";
  const hostname = host.split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  // Skip static assets, api routes, next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Automatically migrate legacy /r/gusto-trattoria links to /r/hotel-gypsy
  if (pathname.startsWith("/r/gusto-trattoria")) {
    const newPath = pathname.replace("/r/gusto-trattoria", "/r/hotel-gypsy");
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  const isOwnerDomain =
    hostname === "owner-gypsy.vercel.app" ||
    hostname.startsWith("owner-") ||
    hostname.startsWith("owner.") ||
    hostname.startsWith("admin.");

  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

  // ---------------------------------------------------------------------------
  // 1. OWNER DOMAIN (owner-gypsy.vercel.app)
  // ---------------------------------------------------------------------------
  if (isOwnerDomain) {
    // Root URL on owner domain goes straight to /dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ---------------------------------------------------------------------------
  // 2. PUBLIC DINER DOMAIN (e.g. menuverse.vercel.app, hotelgypsy.com, etc.)
  // ---------------------------------------------------------------------------
  if (!isLocalhost) {
    // Completely block /dashboard and /admin from public diner domain
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/r/hotel-gypsy", request.url));
    }

    // Root URL on diner domain goes straight to the Live Menu
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/r/hotel-gypsy", request.url));
    }
  }

  // ---------------------------------------------------------------------------
  // 3. LOCAL DEVELOPMENT (localhost)
  // ---------------------------------------------------------------------------
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/r/hotel-gypsy", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

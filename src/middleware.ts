import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "rutr_token";
const DEMO_COOKIE = "rutr_demo";

const PUBLIC_EXACT = new Set(["/login", "/signup", "/invite"]);

function isPublicPath(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (pathname.startsWith("/p/")) return true;
  return false;
}

function hasSession(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (token && token.length > 0) return true;
  return req.cookies.get(DEMO_COOKIE)?.value === "1";
}

/**
 * RUT-29: staff console requires JWT or explicit demo cookie.
 * Fresh browsers without either go to /login — never silent X-Demo-Auth.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const session = hasSession(req);

  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = session ? "/jobs" : "/login";
    return NextResponse.redirect(url);
  }

  if (isPublicPath(pathname)) {
    if (session && (pathname === "/login" || pathname === "/signup")) {
      const url = req.nextUrl.clone();
      url.pathname = "/jobs";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};

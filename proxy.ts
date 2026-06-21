import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Route protection
 * ─────────────────
 * All pages require a valid session. Unauthenticated visitors are redirected
 * to /login, which passes the original URL as ?callbackUrl= so NextAuth can
 * send them back after sign-in.
 *
 * Public routes that bypass auth entirely:
 * - /login and its sub-paths
 * - /api/auth/* (NextAuth endpoints must be public)
 * - Static assets (/_next/*, /fonts/*, /icon.svg) — handled by the matcher
 */
export default async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const callbackUrl = encodeURIComponent(
      request.nextUrl.pathname + request.nextUrl.search
    );
    const loginUrl = new URL(`/login?callbackUrl=${callbackUrl}`, request.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match every route EXCEPT:
     * - /login (the sign-in page itself)
     * - /api/auth/* (NextAuth internals)
     * - Next.js internals and static files
     */
    "/((?!login|api/auth|_next/static|_next/image|fonts|icon\\.svg|favicon\\.ico).*)",
  ],
};


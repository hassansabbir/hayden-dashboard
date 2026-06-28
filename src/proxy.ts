import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("tiu_refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/sign-in") ||
                     pathname.startsWith("/forgot-password") ||
                     pathname.startsWith("/verify-otp") ||
                     pathname.startsWith("/reset-password");

  // If no refresh token cookie exists and the user is trying to access a protected page, redirect to sign-in
  if (!token && !isAuthPage) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If a refresh token cookie exists and the user is trying to access an auth page, redirect to home page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads/public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|uploads).*)",
  ],
};

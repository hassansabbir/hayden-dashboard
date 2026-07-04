import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("tiu_refresh_token_dashboard")?.value;
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

  // Removed the blind redirect away from auth pages to prevent infinite loops.
  // If the token is expired, the backend's /auth/logout might fail to clear it,
  // trapping the user in a redirect loop between / and /sign-in. Let the client
  // handle redirecting valid sessions away from the sign-in page instead.

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

import { withAuth } from "next-auth/middleware";

/**
 * Protect all /dashboard/* routes using NextAuth middleware.
 * Unauthenticated requests are redirected to /login automatically.
 */
export default withAuth({
  pages: {
    signIn: "/login",
  },
  // next-auth middleware runs in the Edge runtime and requires the same
  // secret as the NextAuth API route; otherwise it throws NO_SECRET and
  // breaks the auth endpoints (e.g. /api/auth/csrf).
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-change-in-production",
});

export const config = {
  matcher: ["/dashboard/:path*"],
};

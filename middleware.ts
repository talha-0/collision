import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Use the edge-safe config (no Prisma) for middleware.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(new URL("/login", req.url));
    const role = (session.user as { role?: string })?.role;
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/portal", req.url));
  }

  if (pathname.startsWith("/portal")) {
    if (!session) return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  // ── Protected routes ──
  const jobseekerRoutes = pathname.startsWith("/jobseeker")
  const employerRoutes = pathname.startsWith("/employer")
  const adminRoutes = pathname.startsWith("/admin")

  // ── Auth routes — redirect if already logged in ──
  const authRoutes =
    pathname.startsWith("/login") || pathname.startsWith("/register")

  // If trying to access protected route without token → redirect to login
  if ((jobseekerRoutes || employerRoutes || adminRoutes) && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If already logged in and trying to access auth pages → redirect to home
  if (authRoutes && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/jobseeker/:path*",
    "/employer/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
}
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the user role from the cookie
  const userRoleCookie = request.cookies.get("userRole")?.value;

  // If the user is not an admin, redirect to the home page
  if (!userRoleCookie || userRoleCookie !== "admin") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If the user is an admin, continue to the next middleware
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*", // Apply middleware to admin routes
};

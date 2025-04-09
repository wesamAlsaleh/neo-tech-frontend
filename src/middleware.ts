import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Import backend services
import { getUserRole } from "./services/auth-services";

export async function middleware(request: NextRequest) {
  // Get the user role from the cookie
  const userRoleCookie = request.cookies.get("userRole")?.value;

  // Get the user role from the server
  // const userRoleServerResponse = await getUserRole();

  // Extract the role from the server response
  // const userRole = userRoleServerResponse?.userRole;

  // If the user is not an admin or the cookie is not available, redirect to the home page
  if (
    !userRoleCookie ||
    // !userRole ||
    userRoleCookie !== "admin"
    // || userRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If the user is an admin, continue to the next middleware
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*", // Apply middleware to admin routes
};

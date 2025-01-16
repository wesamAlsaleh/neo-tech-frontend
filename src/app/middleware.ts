import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Import the getUserRole function from the auth-services file
import { getUserRole } from "@/services/auth-services";
import { cookies } from "next/headers";

// Define the paths that require admin access
const protectedRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {}

// Define the paths where the middleware should be applied
export const config = {
  matcher: ["/dashboard/:path*"], // Only apply middleware to these paths
};

import { NextResponse, type NextRequest } from "next/server";
import { AUTH_NAME_COOKIE, AUTH_ROLE_COOKIE } from "@/lib/auth-core";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.delete(AUTH_ROLE_COOKIE);
  response.cookies.delete(AUTH_NAME_COOKIE);
  return response;
}

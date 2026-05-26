import { NextResponse, type NextRequest } from "next/server";
import { AUTH_NAME_COOKIE, AUTH_ROLE_COOKIE, isRole } from "@/lib/auth-core";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const roleValue = String(form.get("role") ?? "USER");
  const role = isRole(roleValue) ? roleValue : "USER";
  const returnTo = String(form.get("returnTo") ?? "/overview");
  const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/overview";
  const response = NextResponse.redirect(new URL(safeReturnTo, request.url), 303);

  response.cookies.set(AUTH_ROLE_COOKIE, role, { httpOnly: true, sameSite: "lax", path: "/" });
  response.cookies.set(AUTH_NAME_COOKIE, role === "ADMIN" ? "Admin User" : "Standard User", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}

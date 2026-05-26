import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ROLE_COOKIE, isRole } from "@/lib/auth-core";
import { getRequiredRoles, isPublicRoute } from "@/lib/route-policy";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(AUTH_ROLE_COOKIE)?.value;
  const sessionRole = isRole(role) ? role : null;
  const isApiRoute = pathname.startsWith("/api/");

  if (isPublicRoute(pathname)) return NextResponse.next();

  if (!sessionRole) {
    if (isApiRoute) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(url);
  }

  const requiredRoles = getRequiredRoles(pathname);
  if (requiredRoles && !requiredRoles.includes(sessionRole)) {
    if (isApiRoute) {
      return NextResponse.json({ message: "You do not have permission to access this resource." }, { status: 403 });
    }

    const url = request.nextUrl.clone();
    url.pathname = sessionRole === "ADMIN" ? "/admin/dropdowns" : "/overview";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\..*).*)"],
};

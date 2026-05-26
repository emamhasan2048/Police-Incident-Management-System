import { type Role } from "@/types/auth";

export const adminRoutePrefixes = ["/admin"];
export const adminApiPrefixes = ["/api/seed"];
export const userRoutePrefixes = ["/all-cases", "/api/cases", "/api/drivers", "/cases", "/drivers", "/overview", "/queries", "/reports"];

export const publicRoutes = ["/"];

export function isPublicRoute(pathname: string) {
  return publicRoutes.includes(pathname);
}

export function getRequiredRoles(pathname: string): Role[] | undefined {
  if (matchesPrefix(pathname, [...adminRoutePrefixes, ...adminApiPrefixes])) {
    return ["ADMIN"];
  }

  if (matchesPrefix(pathname, userRoutePrefixes)) {
    return ["ADMIN", "USER"];
  }

  return undefined;
}

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

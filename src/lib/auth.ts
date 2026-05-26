import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_NAME_COOKIE, AUTH_ROLE_COOKIE, isRole } from "@/lib/auth-core";
import { type AuthSession, type Role } from "@/types/auth";

export function canAccessRole(session: AuthSession | null, allowedRoles?: Role[]) {
  if (!allowedRoles) return Boolean(session);
  return Boolean(session && allowedRoles.includes(session.role));
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const store = await cookies();
  const role = store.get(AUTH_ROLE_COOKIE)?.value;
  if (!isRole(role)) return null;

  return {
    role,
    name: store.get(AUTH_NAME_COOKIE)?.value || (role === "ADMIN" ? "Admin User" : "Standard User"),
  };
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session) redirect("/");
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) redirect(session.role === "ADMIN" ? "/admin/dropdowns" : "/overview");
  return session;
}

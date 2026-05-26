import { type ReactNode } from "react";
import { canAccessRole } from "@/lib/auth";
import { type AuthSession, type Role } from "@/types/auth";

export function RoleGate({ allowedRoles, children, fallback = null, session }: { allowedRoles?: Role[]; children: ReactNode; fallback?: ReactNode; session: AuthSession | null }) {
  return canAccessRole(session, allowedRoles) ? children : fallback;
}


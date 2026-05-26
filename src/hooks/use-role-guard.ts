"use client";

import { type Role } from "@/types/auth";
import { useAuth } from "./use-auth";

export function useRoleGuard(allowedRoles?: Role[]) {
  const { isLoading, session } = useAuth();
  const isAllowed = Boolean(session && (!allowedRoles || allowedRoles.includes(session.role)));

  return { isAllowed, isLoading, session };
}


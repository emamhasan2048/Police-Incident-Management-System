"use client";

import { type AuthSession } from "@/types/auth";
import { useFetch } from "./use-fetch";

export function useAuth() {
  const { data, isLoading } = useFetch<{ session: AuthSession | null }>("/api/auth/session");
  const session = data?.session ?? null;

  return { isAuthenticated: Boolean(session), isLoading, session };
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { type AuthSession } from "@/types/auth";

export function AuthStatus({ session }: { session: AuthSession | null }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  if (!session) return null;

  async function signOut() {
    setIsSigningOut(true);
    const response = await fetch("/api/auth/logout", { method: "POST" });
    router.push(resolveRedirectPath(response.url, "/"));
  }

  return (
    <div className="auth-status">
      <span>{session.role}</span>
      <Button disabled={isSigningOut} onClick={signOut} type="button">Sign out</Button>
    </div>
  );
}

function resolveRedirectPath(url: string, fallback: string) {
  try {
    return new URL(url).pathname;
  } catch {
    return fallback;
  }
}

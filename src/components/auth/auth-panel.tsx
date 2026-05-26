"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { type AuthSession } from "@/types/auth";
import { adminAuthFlow } from "./auth-config";
import { AuthLayout } from "./auth-layout";

export function AuthPanel({ returnTo, session }: { returnTo?: string; session: AuthSession | null }) {
  if (session) {
    return <SignedInPanel session={session} />;
  }

  return <AuthLayout flow={adminAuthFlow} returnTo={returnTo} />;
}

function SignedInPanel({ session }: { session: AuthSession }) {
  const router = useRouter();

  async function logout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    router.push(resolveRedirectPath(response.url, "/"));
  }

  return (
    <div className="card grid gap-4 p-5 text-sm font-bold text-zinc-700 sm:p-6">
      <div>
        Signed in as <span className="text-blue-700">{session.name}</span> with{" "}
        <span className="text-blue-700">{session.role}</span> access.
      </div>
      <Button className="w-full sm:w-fit" onClick={logout} type="button">
        Sign out
      </Button>
    </div>
  );
}

function resolveRedirectPath(url: string, fallback: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return fallback;
  }
}

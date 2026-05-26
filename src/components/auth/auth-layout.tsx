"use client";

import { type AuthFlowConfig } from "./auth-config";
import { AuthModal } from "./auth-modal";

type AuthLayoutProps = {
  flow: AuthFlowConfig;
  returnTo?: string;
};

export function AuthLayout({ flow, returnTo }: AuthLayoutProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-6xl items-center justify-center px-0 py-6 sm:px-4 md:min-h-[calc(100vh-250px)]">
      <div className="relative w-full overflow-hidden rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_32px_100px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(37,99,235,0.14),transparent_18rem),radial-gradient(circle_at_86%_16%,rgba(20,184,166,0.12),transparent_18rem)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">Secure authentication</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl">Police Incident Management System</h1>
            <p className="mt-4 text-sm font-semibold leading-7 text-zinc-500 sm:text-base">
              Open a focused popup to sign in or request protected administrator access without crowding the dashboard.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:justify-end">
            <AuthModal
              flow={flow}
              mode="login"
              returnTo={returnTo}
              triggerClassName="h-12 justify-center rounded-2xl border-blue-700 bg-blue-700 px-8 text-sm font-black tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(37,99,235,0.28)] hover:border-blue-800 hover:bg-blue-800"
            />
            <AuthModal
              flow={flow}
              mode="signup"
              triggerClassName="h-12 justify-center rounded-2xl border-blue-100 bg-white/86 px-8 text-sm font-black tracking-[0.12em] text-blue-800 shadow-[0_10px_26px_rgba(15,23,42,0.08)] hover:border-blue-200 hover:bg-blue-50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

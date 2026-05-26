"use client";

import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

type AuthHeroProps = {
  mode: "login" | "signup";
};

export function AuthHero({ mode }: AuthHeroProps) {
  const copy =
    mode === "login"
      ? "Sign in to manage protected dropdown data, case controls, and administrator workflows from one focused dashboard."
      : "Create a protected administrator profile for secure incident and case management access.";

  return (
    <aside className="relative min-h-[160px] overflow-hidden bg-[radial-gradient(circle_at_20%_15%,rgba(59,130,246,0.92),transparent_30%),linear-gradient(135deg,#07111f_0%,#0f2f70_54%,#0c9488_100%)] p-5 text-white sm:min-h-[210px] sm:p-7 lg:min-h-[500px] lg:p-8">
      <div className="absolute -left-16 top-20 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute -right-20 bottom-6 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="relative z-10 flex h-full min-h-[160px] flex-col justify-between gap-4 sm:min-h-[210px] sm:gap-5 lg:min-h-[500px]">
        <div className="grid gap-4 sm:gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/16 shadow-[0_12px_38px_rgba(0,0,0,0.2)] ring-1 ring-white/20">
              <ShieldCheck aria-hidden="true" className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100">Police Incident</p>
              <p className="text-lg font-black">Admin Console</p>
            </div>
          </div>

          <div className="grid gap-4">
            <h2 className="max-w-md text-2xl font-black leading-tight sm:text-[1.85rem]">Secure access for operational command teams.</h2>
            <p className="hidden max-w-md text-sm font-semibold leading-6 text-blue-50/86 sm:block">{copy}</p>
          </div>
        </div>

        <div className="relative mx-auto hidden aspect-square w-full max-w-[170px] place-items-center rounded-[30px] bg-white/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-white/18 sm:grid">
          <div className="absolute inset-6 rounded-[28px] border border-white/18" />
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-blue-900 shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
            <LockKeyhole aria-hidden="true" className="h-9 w-9" />
          </div>
          <div className="absolute right-8 top-8 rounded-2xl bg-white/16 p-3 ring-1 ring-white/20">
            <Sparkles aria-hidden="true" className="h-5 w-5 text-cyan-100" />
          </div>
        </div>

        <div className="grid gap-2 text-xs font-bold text-blue-50/80 sm:grid-cols-2 lg:grid-cols-1">
          <p>Role protected access</p>
          <p>Encrypted session controls</p>
        </div>
      </div>
    </aside>
  );
}

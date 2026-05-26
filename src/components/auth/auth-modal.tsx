"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type AuthFlowConfig } from "./auth-config";
import { AuthHero } from "./auth-hero";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  flow: AuthFlowConfig;
  mode: AuthMode;
  returnTo?: string;
  triggerClassName?: string;
};

const modalCopy = {
  login: {
    button: "LOGIN",
    description: "Sign in with your authorized account.",
    title: "Login",
  },
  signup: {
    button: "SIGN UP",
    description: "Request a protected administrator account.",
    title: "Sign up",
  },
} satisfies Record<AuthMode, { button: string; description: string; title: string }>;

export function AuthModal({ flow, mode, returnTo, triggerClassName }: AuthModalProps) {
  const copy = modalCopy[mode];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={triggerClassName} type="button">
          {copy.button}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-6xl overflow-hidden rounded-[28px] border-white/70 bg-white/90 p-0 shadow-[0_34px_120px_rgba(15,23,42,0.28)] backdrop-blur-2xl sm:w-[94vw] sm:p-0 lg:p-0">
        <DialogTitle className="sr-only">{copy.title}</DialogTitle>
        <DialogDescription className="sr-only">{copy.description}</DialogDescription>
        <DialogClose asChild>
          <Button
            aria-label="Close authentication modal"
            className="auth-modal-close absolute right-4 top-4 z-30 justify-center rounded-full border border-zinc-200 bg-white/95 text-zinc-600 shadow-[0_6px_16px_rgba(15,23,42,0.1)] backdrop-blur hover:bg-white hover:text-zinc-950"
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        </DialogClose>
        <div className="grid max-h-[90vh] overflow-hidden lg:grid-cols-[0.82fr_1.18fr]">
          <AuthHero mode={mode} />
          <div className="flex min-h-0 items-center justify-center overflow-y-auto bg-white/88 p-5 sm:p-7 sm:pt-11 lg:p-8">
            {mode === "login" ? <LoginForm flow={flow} returnTo={returnTo} /> : <SignupForm />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AuthField } from "./auth-field";
import { type AuthFlowConfig } from "./auth-config";
import { PasswordField } from "./password-field";

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minPasswordLength = 6;

export function LoginForm({ flow, returnTo }: { flow: AuthFlowConfig; returnTo?: string }) {
  const router = useRouter();
  const form = useForm<LoginValues>({ defaultValues: { email: "", password: "", remember: false }, mode: "onSubmit" });
  const isSubmitting = form.formState.isSubmitting;

  async function login(values: LoginValues) {
    const target = getRedirectPath(returnTo, flow.defaultRedirect);
    const body = new URLSearchParams({
      password: values.password,
      remember: String(values.remember),
      returnTo: target,
      role: flow.role,
      username: values.email,
    });
    const response = await fetch("/api/auth/login", { body, method: "POST" });
    router.push(resolveRedirectPath(response.url, target));
  }

  return (
    <div className="w-full max-w-[31rem]">
      <div className="mb-5 grid gap-1.5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">Administrator console</p>
        <h2 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-[1.85rem]">Welcome back</h2>
        <p className="text-sm font-semibold leading-5 text-zinc-500">Use your Gmail or work email to access protected administration tools.</p>
      </div>

      <Form {...form}>
        <form className="grid gap-3" noValidate onSubmit={form.handleSubmit(login)}>
          <Controller
            control={form.control}
            name="email"
            rules={{
              pattern: { message: "Enter a valid email address.", value: emailPattern },
              required: "Email is required.",
            }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="login-email">Gmail / Email</FormLabel>
                <AuthField autoComplete="email" icon={Mail} id="login-email" inputMode="email" invalid={Boolean(fieldState.error)} placeholder="admin@gmail.com" type="email" {...field} />
                <FormMessage message={fieldState.error?.message} />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            rules={{
              minLength: { message: `Password must be at least ${minPasswordLength} characters.`, value: minPasswordLength },
              required: "Password is required.",
            }}
            render={({ field, fieldState }) => (
              <PasswordField error={fieldState.error?.message} id="login-password" onBlur={field.onBlur} onChange={field.onChange} value={field.value} />
            )}
          />

          <div className="flex flex-col gap-3 text-sm font-semibold text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <Controller
              control={form.control}
              name="remember"
              render={({ field }) => (
                <label className="flex min-h-10 cursor-pointer items-center gap-2">
                  <input
                    checked={field.value}
                    className="h-4 w-4 rounded border-zinc-300 accent-blue-700"
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(event.target.checked)}
                    type="checkbox"
                  />
                  Remember me
                </label>
              )}
            />
            <Link className="text-blue-700 transition hover:text-blue-950" href="#">
              Forgot password?
            </Link>
          </div>

          <Button className="mt-1 h-12 w-full justify-center rounded-2xl border-blue-700 bg-blue-700 text-sm font-black text-white shadow-[0_16px_36px_rgba(37,99,235,0.32)] transition hover:border-blue-800 hover:bg-blue-800 hover:shadow-[0_18px_42px_rgba(37,99,235,0.36)]" disabled={isSubmitting} type="submit">
            {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function getRedirectPath(returnTo: string | undefined, fallback: string) {
  if (!returnTo || returnTo === "/overview") return fallback;
  return returnTo;
}

function resolveRedirectPath(url: string, fallback: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return fallback;
  }
}

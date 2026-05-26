"use client";

import { CheckCircle2, Mail, UserRound } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AuthField } from "./auth-field";
import { PasswordField } from "./password-field";

type SignupValues = {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minPasswordLength = 6;

export function SignupForm() {
  const form = useForm<SignupValues>({
    defaultValues: { confirmPassword: "", email: "", name: "", password: "" },
    mode: "onSubmit",
  });

  function signup() {
    form.setError("root", { message: "Account creation is not enabled yet. Please contact an administrator." });
  }

  return (
    <div className="w-full max-w-[31rem]">
      <div className="mb-4 grid gap-1.5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">Request access</p>
        <h2 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-[1.85rem]">Create your account</h2>
        <p className="text-sm font-semibold leading-5 text-zinc-500">Submit your administrator access details for a protected workspace account.</p>
      </div>

      <Form {...form}>
        <form className="grid gap-3" noValidate onSubmit={form.handleSubmit(signup)}>
          <Controller
            control={form.control}
            name="name"
            rules={{ required: "Full name is required." }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="signup-name">Full name</FormLabel>
                <AuthField autoComplete="name" icon={UserRound} id="signup-name" invalid={Boolean(fieldState.error)} placeholder="Your full name" {...field} />
                <FormMessage message={fieldState.error?.message} />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            rules={{
              pattern: { message: "Enter a valid email address.", value: emailPattern },
              required: "Email is required.",
            }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="signup-email">Gmail / Email</FormLabel>
                <AuthField autoComplete="email" icon={Mail} id="signup-email" inputMode="email" invalid={Boolean(fieldState.error)} placeholder="name@gmail.com" type="email" {...field} />
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
              <PasswordField autoComplete="new-password" error={fieldState.error?.message} id="signup-password" onBlur={field.onBlur} onChange={field.onChange} value={field.value} />
            )}
          />

          <Controller
            control={form.control}
            name="confirmPassword"
            rules={{
              required: "Confirm your password.",
              validate: (value) => value === form.getValues("password") || "Passwords do not match.",
            }}
            render={({ field, fieldState }) => (
              <PasswordField
                autoComplete="new-password"
                error={fieldState.error?.message}
                id="signup-confirm-password"
                label="Confirm password"
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />

          <FormMessage message={form.formState.errors.root?.message} />
          <Button className="mt-2 h-12 w-full justify-center rounded-2xl border-blue-700 bg-blue-700 text-sm font-black text-white shadow-[0_16px_36px_rgba(37,99,235,0.32)] transition hover:border-blue-800 hover:bg-blue-800 hover:shadow-[0_18px_42px_rgba(37,99,235,0.36)]" type="submit">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            Create Account
          </Button>
        </form>
      </Form>
    </div>
  );
}

"use client";

import { FormProvider } from "react-hook-form";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Form = FormProvider;

export function FormItem({ children }: { children: ReactNode }) {
  return <div className="field-group">{children}</div>;
}

export function FormLabel({ children, className, htmlFor }: { children: ReactNode; className?: string; htmlFor?: string }) {
  return (
    <label className={cn("label", className)} htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export function FormControl({ children }: { children: ReactNode }) {
  return children;
}

export function FormMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm font-semibold text-red-600">{message}</p>;
}

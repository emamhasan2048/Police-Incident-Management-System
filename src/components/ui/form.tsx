"use client";

import { FormProvider } from "react-hook-form";
import { type ReactNode } from "react";

export const Form = FormProvider;

export function FormItem({ children }: { children: ReactNode }) {
  return <div className="field-group">{children}</div>;
}

export function FormLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label className="label" htmlFor={htmlFor}>
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

  return <p className="field-error">{message}</p>;
}

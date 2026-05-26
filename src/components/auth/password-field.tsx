"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type PasswordFieldProps = {
  autoComplete?: string;
  error?: string;
  id: string;
  label?: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  value: string;
};

export function PasswordField({ autoComplete = "current-password", error, id, label = "Password", onBlur, onChange, value }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormItem>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <div className="relative">
        <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <FormControl>
          <Input
            autoComplete={autoComplete}
            className="auth-input auth-input-both-icons"
            id={id}
            invalid={Boolean(error)}
            onBlur={onBlur}
            onChange={(event) => onChange(event.target.value)}
            placeholder={label}
            type={showPassword ? "text" : "password"}
            value={value}
          />
        </FormControl>
        <Button
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="auth-icon-button absolute right-1.5 top-1/2 -translate-y-1/2 justify-center rounded-xl border-0 bg-transparent text-zinc-500 shadow-none hover:bg-zinc-100 hover:text-zinc-900"
          onClick={() => setShowPassword((current) => !current)}
          type="button"
        >
          {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
        </Button>
      </div>
      <FormMessage message={error} />
    </FormItem>
  );
}

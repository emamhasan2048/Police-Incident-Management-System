"use client";

import { type ComponentType, type SVGProps } from "react";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type AuthFieldProps = {
  autoComplete?: string;
  icon: IconComponent;
  id: string;
  invalid?: boolean;
  inputMode?: "email" | "text";
  name: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "email" | "text";
  value: string;
};

export function AuthField({ autoComplete, icon: Icon, id, invalid = false, inputMode, name, onBlur, onChange, placeholder, type = "text", value }: AuthFieldProps) {
  return (
    <div className="relative">
      <Icon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <FormControl>
        <Input
          autoComplete={autoComplete}
          className="auth-input auth-input-left-icon"
          id={id}
          inputMode={inputMode}
          invalid={invalid}
          name={name}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      </FormControl>
    </div>
  );
}

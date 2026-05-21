import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input"> & {
  invalid?: boolean;
};

export function Input({ className, invalid = false, ...props }: InputProps) {
  return <input aria-invalid={invalid} className={cn("field", invalid && "field-invalid", className)} {...props} />;
}

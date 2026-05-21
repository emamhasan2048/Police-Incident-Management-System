import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SelectProps = ComponentProps<"select"> & {
  invalid?: boolean;
};

export function Select({ className, invalid = false, ...props }: SelectProps) {
  return <select aria-invalid={invalid} className={cn("field", invalid && "field-invalid", className)} {...props} />;
}

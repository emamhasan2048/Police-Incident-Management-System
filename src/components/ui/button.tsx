import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<"button">;

export function Button({ className, ...props }: ButtonProps) {
  return <button className={cn("nav-button", className)} {...props} />;
}

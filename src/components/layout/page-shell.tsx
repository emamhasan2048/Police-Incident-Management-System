import { type ReactNode } from "react";
import { AppNav } from "@/app/nav";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="shell">
      <AppNav />
      {children}
    </main>
  );
}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { type NavigationChild } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function SecondaryNavigation({ items }: { items: NavigationChild[] }) {
  const pathname = usePathname();
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  return (
    <aside aria-label="Quick navigation" className="dashboard-sidebar">
      {items.map((item) => (
        <Link
          aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
          className={cn(
            "sidebar-link",
            isActivePath(pathname, item.href) && "sidebar-link-active",
            expandedCode === item.code && "sidebar-link-expanded",
          )}
          href={item.href}
          key={item.href}
          onClick={() => setExpandedCode((currentCode) => (currentCode === item.code ? null : item.code ?? null))}
          title={item.label}
        >
          <span className="sidebar-code">{item.code}</span>
          <span className="sidebar-label">{item.label}</span>
        </Link>
      ))}
    </aside>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

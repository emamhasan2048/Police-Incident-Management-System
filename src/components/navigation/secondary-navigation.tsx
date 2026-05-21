"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SidebarItem = {
  code: string;
  href: string;
  label: string;
};

const sidebarItems: SidebarItem[] = [
  { code: "PI", href: "/", label: "Police Incident" },
  { code: "DL", href: "/drivers/list", label: "Driver List" },
  { code: "DD", href: "/drivers/details", label: "Driver Details" },
  { code: "DV", href: "/drivers/violations", label: "Driver Violation" },
  { code: "VS", href: "/queries", label: "Violation Status" },
  { code: "VL", href: "/all-cases", label: "Violation List" },
];

export function SecondaryNavigation() {
  const pathname = usePathname();
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  return (
    <aside aria-label="Quick navigation" className="dashboard-sidebar">
      {sidebarItems.map((item) => (
        <Link
          aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
          className={cn(
            "sidebar-link",
            isActivePath(pathname, item.href) && "sidebar-link-active",
            expandedCode === item.code && "sidebar-link-expanded",
          )}
          href={item.href}
          key={item.code}
          onClick={() => setExpandedCode((currentCode) => (currentCode === item.code ? null : item.code))}
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

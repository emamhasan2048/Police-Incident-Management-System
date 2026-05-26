"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type NavigationItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { NavigationMenuItem } from "./navigation-menu-item";

export function NavigationMenu({ ariaLabel, items, variant = "primary" }: { ariaLabel: string; items: NavigationItem[]; variant?: "primary" | "secondary" }) {
  const pathname = usePathname();

  if (variant === "secondary") {
    return (
      <nav className="task-nav" aria-label={ariaLabel}>
        {items.map((item) => (
          <Link className={cn("task-link", isActivePath(pathname, item.href) && "task-link-active")} href={item.href} key={item.label}>
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="menu-bar" aria-label={ariaLabel}>
      {items.map((item) => (
        <NavigationMenuItem item={item} key={item.label} pathname={pathname} />
      ))}
    </nav>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

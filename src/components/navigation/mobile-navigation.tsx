"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type NavigationItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MobileNavigation({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname();

  if (items.length === 0) return null;

  return (
    <details className="mobile-nav">
      <summary className="mobile-nav-trigger">
        <span>Menu</span>
        <span aria-hidden="true">+</span>
      </summary>
      <nav aria-label="Mobile navigation" className="mobile-nav-panel">
        {items.map((item) => (
          <div className="mobile-nav-group" key={item.label}>
            <Link className={cn("mobile-nav-link", isActivePath(pathname, item.href) && "mobile-nav-link-active")} href={item.href}>
              {item.label}
            </Link>
            {item.children && (
              <div className="mobile-nav-children">
                {item.children.map((child) => (
                  <Link className="mobile-nav-child" href={child.href} key={child.label}>
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </details>
  );
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}


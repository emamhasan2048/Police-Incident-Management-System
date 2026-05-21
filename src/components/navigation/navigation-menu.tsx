import Link from "next/link";
import { type NavigationItem } from "./navigation-data";
import { NavigationMenuItem } from "./navigation-menu-item";

export function NavigationMenu({ ariaLabel, items, variant = "primary" }: { ariaLabel: string; items: NavigationItem[]; variant?: "primary" | "secondary" }) {
  if (variant === "secondary") {
    return (
      <nav className="task-nav" aria-label={ariaLabel}>
        {items.map((item) => (
          <Link className="task-link" href={item.href} key={item.label}>
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="menu-bar" aria-label={ariaLabel}>
      {items.map((item) => (
        <NavigationMenuItem item={item} key={item.label} />
      ))}
    </nav>
  );
}

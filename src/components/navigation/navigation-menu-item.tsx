import Link from "next/link";
import { type NavigationItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function NavigationMenuItem({ item, pathname }: { item: NavigationItem; pathname: string }) {
  const isActive = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <div className="menu-item">
      <Link className={cn("menu-button", isActive && "menu-button-active")} href={item.href}>
        {item.label}
        {item.children && <span className="menu-caret">v</span>}
      </Link>

      {item.children && (
        <div className="submenu-panel">
          {item.children.map((child) => (
            <Link className="submenu-item" href={child.href} key={child.label}>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

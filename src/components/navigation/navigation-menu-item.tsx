import Link from "next/link";
import { type NavigationItem } from "./navigation-data";

export function NavigationMenuItem({ item }: { item: NavigationItem }) {
  return (
    <div className="menu-item">
      <Link className="menu-button" href={item.href}>
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

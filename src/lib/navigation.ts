import { type NavigationChild, type NavigationItem } from "@/config/navigation";
import { type AuthSession } from "@/types/auth";

function canViewItem(item: NavigationChild, session: AuthSession | null) {
  if (!session) return item.href === "/";
  return !item.roles || item.roles.includes(session.role);
}

export function filterNavigationItems<T extends NavigationChild | NavigationItem>(items: T[], session: AuthSession | null): T[] {
  return items
    .filter((item) => canViewItem(item, session))
    .map((item) => {
      if (!("children" in item) || !item.children) return item;
      return { ...item, children: item.children.filter((child) => canViewItem(child, session)) };
    });
}


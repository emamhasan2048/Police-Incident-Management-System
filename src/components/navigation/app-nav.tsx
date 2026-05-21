import Link from "next/link";
import { NavigationMenu } from "./navigation-menu";
import { primaryNavigationItems, secondaryNavigationItems } from "./navigation-data";

export function AppNav() {
  return (
    <header className="mb-9 border-b border-[#333331] pb-5">
      <div className="app-topbar">
        <Link className="flex items-center gap-3" href="/">
          <span className="brand-mark">PI</span>
          <span>
            <span className="block text-base font-extrabold">Police Incident Management System</span>
            <span className="block text-xs font-bold text-[var(--muted)]">Incident registry system</span>
          </span>
        </Link>
      </div>

      <NavigationMenu ariaLabel="Main menu" items={primaryNavigationItems} />
      <NavigationMenu ariaLabel="Quick navigation" items={secondaryNavigationItems} variant="secondary" />
    </header>
  );
}

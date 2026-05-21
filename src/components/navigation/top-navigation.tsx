import Link from "next/link";
import { NavigationMenu } from "./navigation-menu";
import { primaryNavigationItems } from "./navigation-data";

export function TopNavigation() {
  return (
    <header className="dashboard-topbar">
      <Link className="dashboard-logo" href="/">
        <span className="dashboard-logo-emblem">PI</span>
        <span className="dashboard-logo-text">
          <span>POLICE</span>
          <span>INCIDENT</span>
        </span>
      </Link>

      <div className="dashboard-menu">
        <NavigationMenu ariaLabel="Main menu" items={primaryNavigationItems} />
      </div>
    </header>
  );
}

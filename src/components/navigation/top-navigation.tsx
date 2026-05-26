import Link from "next/link";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthStatus } from "@/components/auth/auth-status";
import { adminAuthFlow } from "@/components/auth/auth-config";
import { type NavigationItem } from "@/config/navigation";
import { type AuthSession } from "@/types/auth";
import { MobileNavigation } from "./mobile-navigation";
import { NavigationMenu } from "./navigation-menu";

export function TopNavigation({ items, session }: { items: NavigationItem[]; session: AuthSession | null }) {
  return (
    <header className="dashboard-topbar">
      <Link className="dashboard-logo" href="/">
        <span className="dashboard-logo-emblem">PI</span>
        <span className="dashboard-logo-text">
          <span>POLICE</span>
          <span>INCIDENT</span>
        </span>
      </Link>

      {session && (
        <div className="dashboard-menu desktop-menu">
          <NavigationMenu ariaLabel="Main menu" items={items} />
        </div>
      )}
      {session && <MobileNavigation items={items} />}
      <div className="navbar-auth-action">
        {session ? (
          <AuthStatus session={session} />
        ) : (
          <AuthModal
            flow={adminAuthFlow}
            mode="login"
            triggerClassName="navbar-login-button"
          />
        )}
      </div>
    </header>
  );
}

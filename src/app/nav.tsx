import Link from "next/link";

const menuItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Drivers",
    href: "/all-cases",
    children: [
      { label: "Driver List", href: "/all-cases" },
      { label: "Driver Details", href: "/queries?license=" },
      { label: "Driver Violations", href: "/queries?license=" },
    ],
  },
  {
    label: "Vehicles",
    href: "/queries",
    children: [
      { label: "Vehicle Search", href: "/queries" },
      { label: "Vehicles by Registration Number", href: "/queries?registration=" },
      { label: "Vehicles by Model and Color", href: "/queries?model=&color=" },
      { label: "Vehicles by Model and Year", href: "/queries?show=stats" },
    ],
  },
  {
    label: "Violations",
    href: "/all-cases",
    children: [
      { label: "Violation List", href: "/all-cases" },
      { label: "Violations by Driver", href: "/queries?license=" },
      { label: "Violation Codes", href: "/overview" },
    ],
  },
  {
    label: "Offenders",
    href: "/queries?show=offenders",
    children: [
      { label: "Offender List", href: "/queries?show=offenders" },
      { label: "Offender Search", href: "/queries?license=" },
    ],
  },
  {
    label: "Reports",
    href: "/overview",
    children: [
      { label: "Driver Violation Report", href: "/queries?license=" },
      { label: "Vehicle Ownership Report", href: "/queries?registration=" },
      { label: "Vehicle Statistics", href: "/queries?show=stats" },
    ],
  },
];

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

      <nav className="menu-bar" aria-label="Main menu">
        {menuItems.map((item) => (
          <div className="menu-item" key={item.label}>
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
        ))}
      </nav>
    </header>
  );
}

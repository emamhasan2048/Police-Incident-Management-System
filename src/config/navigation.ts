import { type Role } from "@/types/auth";

export type NavigationChild = {
  code?: string;
  label: string;
  href: string;
  roles?: Role[];
};

export type NavigationItem = NavigationChild & {
  children?: NavigationChild[];
};

const authenticatedRoles: Role[] = ["ADMIN", "USER"];

export const primaryNavigationItems: NavigationItem[] = [
  { label: "Home", href: "/", roles: authenticatedRoles },
  {
    label: "Drivers",
    href: "/drivers/list",
    roles: authenticatedRoles,
    children: [
      { label: "Driver List", href: "/drivers/list", roles: authenticatedRoles },
      { label: "Driver Details", href: "/drivers/details", roles: authenticatedRoles },
      { label: "Driver Violations", href: "/drivers/violations", roles: authenticatedRoles },
    ],
  },
  {
    label: "Vehicles",
    href: "/queries",
    roles: authenticatedRoles,
    children: [
      { label: "Vehicle Search", href: "/queries", roles: authenticatedRoles },
      { label: "Vehicles by Registration Number", href: "/queries?registration=", roles: authenticatedRoles },
      { label: "Vehicles by Model and Color", href: "/queries?model=&color=", roles: authenticatedRoles },
      { label: "Vehicles by Model and Year", href: "/queries?show=stats", roles: authenticatedRoles },
    ],
  },
  {
    label: "Violations",
    href: "/all-cases",
    roles: authenticatedRoles,
    children: [
      { label: "Violation List", href: "/all-cases", roles: authenticatedRoles },
      { label: "Violations by Driver", href: "/queries?license=", roles: authenticatedRoles },
      { label: "Violation Codes", href: "/overview", roles: authenticatedRoles },
    ],
  },
  {
    label: "Reports",
    href: "/reports",
    roles: authenticatedRoles,
    children: [
      { label: "Case Activity Report", href: "/reports", roles: authenticatedRoles },
      { label: "Vehicle Statistics", href: "/queries?show=stats", roles: authenticatedRoles },
      { label: "Offender Summary", href: "/queries?show=offenders", roles: authenticatedRoles },
    ],
  },
  {
    label: "Admin",
    href: "/admin/dropdowns",
    roles: ["ADMIN"],
    children: [{ label: "Dropdown Data", href: "/admin/dropdowns", roles: ["ADMIN"] }],
  },
];

export const secondaryNavigationItems: NavigationChild[] = [
  { code: "PI", href: "/", label: "Police Incident", roles: authenticatedRoles },
  { code: "DL", href: "/drivers/list", label: "Driver List", roles: authenticatedRoles },
  { code: "DD", href: "/drivers/details", label: "Driver Details", roles: authenticatedRoles },
  { code: "DV", href: "/drivers/violations", label: "Driver Violation", roles: authenticatedRoles },
  { code: "VS", href: "/queries", label: "Vehicle Search", roles: authenticatedRoles },
  { code: "VL", href: "/all-cases", label: "Violation List", roles: authenticatedRoles },
  { code: "RP", href: "/reports", label: "Reports", roles: authenticatedRoles },
  { code: "AD", href: "/admin/dropdowns", label: "Admin Data", roles: ["ADMIN"] },
];

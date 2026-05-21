export type NavigationChild = {
  label: string;
  href: string;
};

export type NavigationItem = NavigationChild & {
  children?: NavigationChild[];
};

export const primaryNavigationItems: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Drivers",
    href: "/drivers/list",
    children: [
      { label: "Driver List", href: "/drivers/list" },
      { label: "Driver Details", href: "/drivers/details" },
      { label: "Driver Violations", href: "/drivers/violations" },
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

export const secondaryNavigationItems: NavigationItem[] = [
  { label: "Driver List", href: "/drivers/list" },
  { label: "Driver Details", href: "/drivers/details" },
  { label: "Driver Violations", href: "/drivers/violations" },
  { label: "Vehicle Search", href: "/queries" },
  { label: "Violation List", href: "/all-cases" },
];

export type AuthFlowConfig = {
  accent: string;
  description: string;
  defaultRedirect: string;
  eyebrow: string;
  role: "ADMIN";
  title: string;
  usernameLabel: string;
};

export const adminAuthFlow: AuthFlowConfig = {
  accent: "from-blue-700 to-cyan-600",
  description: "Access protected administration tools, dropdown controls, and operational case workflows.",
  defaultRedirect: "/admin/dropdowns",
  eyebrow: "Administrator console",
  role: "ADMIN",
  title: "Administrator access",
  usernameLabel: "Gmail / Email",
};

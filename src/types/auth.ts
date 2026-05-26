export const roles = ["ADMIN", "USER"] as const;

export type Role = (typeof roles)[number];

export type AuthSession = {
  name: string;
  role: Role;
};


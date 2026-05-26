import { type Role, roles } from "@/types/auth";

export const AUTH_ROLE_COOKIE = "pims_role";
export const AUTH_NAME_COOKIE = "pims_name";

export function isRole(value: string | undefined): value is Role {
  return roles.includes(value as Role);
}


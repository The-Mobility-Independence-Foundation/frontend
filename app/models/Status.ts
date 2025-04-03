export const ACTIVE = "ACTIVE";
export const INACTIVE = "INACTIVE";

export const statuses = [ACTIVE, INACTIVE];

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
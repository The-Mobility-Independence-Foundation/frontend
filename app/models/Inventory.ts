import { OrganizationData } from "./Organization";

export interface Inventory {
  message: string | null;
  success: boolean;
  data: {
    results: InventoryData[],
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: number | null,
    previousCursor: number | null
  }
}

export interface InventoryData {
  id: number;
  name: string;
  organization: OrganizationData;
  description: string;
  location: string;
  archived: boolean;
}
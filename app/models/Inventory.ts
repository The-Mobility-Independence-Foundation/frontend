import { AddressData } from "./Address";
import { OrganizationData } from "./Organization";

export interface Inventory {
  message: string | null;
  success: boolean;
  data: {
    results: InventoryData[],
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: string | null,
    previousCursor: string | null
  }
}

export interface InventorySuccess {
  success: boolean,
  message: string | null,
  data: InventoryData
}

export interface InventoryData {
  id: number;
  name: string;
  organization: OrganizationData;
  description: string;
  address: AddressData;
  archivedAt: string | null;
}
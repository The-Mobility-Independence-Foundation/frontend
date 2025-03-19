import { OrganizationData } from "./Organization";

export interface Inventory {
  message: string;
  data: {
    results: InventoryData[]
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
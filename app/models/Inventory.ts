import { OrganizationData } from "./Organization";

export interface Inventory {
  message: string;
  data: InventoryData
}

export interface InventoryData {
  id: number;
  name: string;
  organization: OrganizationData;
  description: string;
  location: string;
}
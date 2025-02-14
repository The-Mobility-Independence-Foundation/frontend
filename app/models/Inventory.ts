export interface Inventory {
  message: string;
  data: InventoryData
}

export interface InventoryData {
  id: number;
  name: string;
  organizationID: number;
  description: string;
  location: string;
}
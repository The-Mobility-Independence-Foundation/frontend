// GET

import { PartData } from "./Part";

export interface InventoryItems {
  message: string;
  data: {
    count: number;
    hasNext: boolean;
    nextToken: string;
    results: InventoryItemData[]
  }
}

export interface InventoryItemData {
  id: number;
  name: string;
  inventoryID: number;
  part: PartData;
  modelID: number;
  quantity: number;
  publicCount: number;
  notes: string;
  attributes: string;
}
// GET

import { InventoryData } from "./Inventory";
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
  inventory: InventoryData;
  part: PartData;
  modelID: number;
  quantity: number;
  publicCount: number;
  notes: string;
  attributes: string;
}
// GET

import { InventoryData } from "./Inventory";
import { PartData } from "./Part";

export interface InventoryItems {
  message: string;
  data: {
    count: number;
    totalCount: number;
    hasNext: boolean;
    nextToken: string | null;
    results: InventoryItemData[]
  }
}

export interface InventoryItemJoinedData {
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

export interface InventoryItemData {
  id: number;
  name: string;
  inventoryID: number;
  partID: number;
  modelID: number;
  quantity: number;
  publicCount: number;
  notes: string;
  attributes: string;
}
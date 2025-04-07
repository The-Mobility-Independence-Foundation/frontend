// GET

import { InventoryData } from "./Inventory";
import { ModelData } from "./Model";
import { PartData } from "./Part";

export const ATTRIBUTES_STRING_REGEX = /(.+:.+\n)*(.+:.+)/;

export interface InventoryItems {
  success: boolean
  message: string;
  data: {  
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor: string | null;
    previousCursor: string | null;
    results: InventoryItemData[]
  }
}

export interface InventoryItemsPost {
  success: boolean
  message: string
  data: InventoryItemData
}

export interface InventoryItemData {
  id: number;
  name: string;
  inventory: InventoryData | null;
  part: PartData | null;
  model: ModelData | null;
  quantity: number;
  publicCount: number;
  notes: string;
  attributes: { [key: string]: string | number };
}

export function attributesToString(attributes: { [key: string]: string | number }) {
  return Object.keys(attributes)
    .map((attributeKey) => `${attributeKey}: ${attributes[attributeKey]}`)
    .join("\n");
}

export function stringToAttributes(string: string) {
  if (!ATTRIBUTES_STRING_REGEX.test(string)) {
    throw new Error("String isn't in proper format.");
  }
  const map = new Map(
    string.split("\n").map((pair) => [pair.split(":")[0], pair.split(":")[1]])
  );
  return Object.fromEntries(map);
}
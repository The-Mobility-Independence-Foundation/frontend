// GET

import { InventoryData } from "./Inventory";
import { ModelData } from "./Model";
import { PartData } from "./Part";

export const ATTRIBUTES_STRING_REGEX = /(.+:.+\n)*(.+:.+)/;

export interface InventoryItems {
  message: string;
  data: {  
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor: string | null;
    previousCursor: string | null;
    results: InventoryItemData[]
  }
}

export interface InventoryItemData {
  id: number;
  quantity: number;
  publicCount: number;
  archivedAt: string | null;
  notes: string;
  attributes: { [key: string]: string | number };
  inventory: InventoryData | null;
  part: PartData | null;
  model: ModelData | null;
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
  return new Map(
    string.split("\n").map((pair) => [pair.split(":")[0], pair.split(":")[1]])
  );
}
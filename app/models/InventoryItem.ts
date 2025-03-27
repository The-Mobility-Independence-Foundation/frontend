// GET

import { InventoryData } from "./Inventory";
import { PartData } from "./Part";

export const ATTRIBUTES_STRING_REGEX = /(.+:.+\n)*(.+:.+)/;

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

export interface InventoryItemData {
  id: number;
  name: string;
  inventory: InventoryData;
  part: PartData;
  modelID: number;
  quantity: number;
  publicCount: number;
  notes: string;
  attributes: { [key: string]: object };
}

export function attributesToString(attributes: { [key: string]: object }) {
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
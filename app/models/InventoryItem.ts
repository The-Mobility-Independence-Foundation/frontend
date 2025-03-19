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
  attributes: { [key: string]: any };
}

export function attributesToString(attributes: { [key: string]: any }) {
  let attributesAsString = "";
  const attributeKeys = Object.keys(attributes);
  for(let i = 0; i < attributeKeys.length; i++) {
    let attributeKey = attributeKeys[i];
    attributesAsString += `${attributeKey}:${attributes[attributeKey]}`;
    if(i < attributeKeys.length-1) {
      attributesAsString += "\n";
    }
  }
  return attributesAsString;
}

export function stringToAttributes(string: string) {
  if(!ATTRIBUTES_STRING_REGEX.test(string)) {
    throw new Error("String isn't in proper format.");
  }
  const attributes: { [key: string]: any } = {};
  const attributesList = string.split("\n");
  for(let pair of attributesList) {
    const keyValue = pair.split(":");
    attributes[keyValue[0]] = keyValue[1];
  }
  return attributes;
}
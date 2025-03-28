import { InventoryItemData, InventoryItems } from "../models/InventoryItem";
import { testInventoryData1 } from "./TestInventoryData";

export const TEST_INVENTORY_ITEM_DATA_1: InventoryItemData = {
  id: 1,
  name: "Item 1",
  inventory: testInventoryData1,
  part: {
    id: 0,
    name: "Part 2",
    model: "Model",
    description: "Description",
    partNumber: "Part Number",
    partType: "Part Type"
  },
  modelID: 1,
  quantity: 50,
  publicCount: 25,
  notes: "Notes",
  attributes: {"color": "red", "size": 100}
}

export const TEST_INVENTORY_ITEM_DATA_2: InventoryItemData = {
  id: 2,
  name: "Item 2",
  inventory: testInventoryData1,
  part: {
    id: 0,
    name: "Part 2",
    model: "Model",
    description: "Description",
    partNumber: "Part Number",
    partType: "Part Type"
  },
  modelID: 1,
  quantity: 100,
  publicCount: 50,
  notes: "Notes again",
  attributes: {"color": "red", "size": 100}
}

export const testInventoryItems: InventoryItems = {
  message: "message",
  data: {
    count: 2,
    totalCount: 2,
    hasNext: false,
    nextToken: null,
    results: [TEST_INVENTORY_ITEM_DATA_1, TEST_INVENTORY_ITEM_DATA_2]
  }
}
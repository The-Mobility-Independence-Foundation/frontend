import { InventoryItemData } from "../models/InventoryItem";

export const TEST_INVENTORY_ITEM_1: InventoryItemData = {
  id: 1,
  name: "Item 1",
  inventoryID: 1,
  partID: 1,
  modelID: 1,
  quantity: 50,
  publicCount: 25,
  notes: "Notes",
  attributes: "attributes"
}

export const TEST_INVENTORY_ITEM_2: InventoryItemData = {
  id: 2,
  name: "Item 2",
  inventoryID: 1,
  partID: 2,
  modelID: 1,
  quantity: 100,
  publicCount: 50,
  notes: "Notes again",
  attributes: "More attributes"
}
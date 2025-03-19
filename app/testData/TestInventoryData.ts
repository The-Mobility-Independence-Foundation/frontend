import { Inventory, InventoryData } from "../models/Inventory"
import { InventoryItems } from "../models/InventoryItem"

export const testInventoryData1: InventoryData = {
  id: 1,
  name: "Inventory 1",
  organization: {
    id: "1",
    name: "org",
    email: "email@email.com",
    phoneNumber: "(555) 555-5555"
  },
  description: "",
  location: "1 Lomb Memorial Dr.",
  archived: false
}

export const testInventoryData2: InventoryData = {
  id: 2,
  name: "Inventory 2",
  organization: {
    id: "1",
    name: "org",
    email: "email@email.com",
    phoneNumber: "(555) 555-5555"
  },
  description: "",
  location: "1 Lomb Memorial Dr.",
  archived: false
}

export const testInventory: Inventory = {
  message: "message",
  data: {
    results: [testInventoryData1, testInventoryData2]
  }
}
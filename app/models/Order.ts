import { InventoryItemData } from "./InventoryItem"
import { UserData } from "./User"

export enum OrderStatus {
  INITIATED = "initiated",
  FULLFILLED = "fullfilled",
  PENDING = "pending",
  VOIDED = "voided"
}

export interface Orders {
  message: string,
  success: boolean,
  data: {
    results: OrderData[],
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: string | null,
    previousCursor: string | null
  }
}

export interface OrderData {
  id: number,
  inventoryItem: InventoryItemData,
  vendor: UserData,
  quantity: number,
  createdAt: string,
  status: string | null
}
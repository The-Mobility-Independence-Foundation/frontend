// GET

import { InventoryItemData } from "./InventoryItem";

export interface Listings {
  message: string;
  data: {
    count: number;
    totalCount: number;
    hasNext: boolean;
    nextToken: string | null;
    results: ListingData[]
  }
}

export interface SingleListing {
  success: boolean;
  message: string;
  data: ListingData;
}

export interface ListingData {
  id: string;
  title: string;
  attributes: {[key: string]: string};
  quantity: number;
  latitude: number;
  longitude: number;
  inventoryItem: InventoryItemData;
  status: string;
  attachment: string;
}

export interface PatchListing {
  title: string;
  description: string;
  attributes: {[key: string]: string}
  quantity: number;
  inventoryItemId: number;
  status: string;
}
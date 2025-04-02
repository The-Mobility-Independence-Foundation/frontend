// GET

import { InventoryItemData } from "./InventoryItem";

export interface Listings {
  message: string;
  success: boolean;
  data: {
    count: number;
    totalCount: number;
    hasNext: boolean;
    nextToken: string | null;
    results: ListingData[]
  }
}

export interface Listing {
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
  attachment: string | null;
}

export interface PatchListing {
  title: string;
  description: string;
  attributes: {[key: string]: string}
  quantity: number;
  inventoryItemId: number;
  status: string;
}
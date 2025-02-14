// GET

import { InventoryItemData } from "./InventoryItem";

export interface Listings {
  message: string;
  data: {
    count: number;
    hasNext: boolean;
    nextToken: string;
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
  attachment: string;
}
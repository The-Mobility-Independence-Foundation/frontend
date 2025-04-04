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

export interface Listing {
  message: string;
  data: ListingData;
}

export interface ListingData {
  id: string;
  name: string;
  description: string;
  attributes: {[key: string]: string};
  quantity: number;
  latitude: number;
  longitude: number;
  inactive: boolean;
  zipCode: string;
  state: string;
  createdAt: string;
  inventoryItem: InventoryItemData;
}

export interface ListingPatchData {
  title: string;
  description: string;
  attributes: {[key: string]: string}
  quantity: number;
  inventoryItemId: number;
  status: string;
}
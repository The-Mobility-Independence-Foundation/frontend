// GET

import { InventoryItemData } from "./InventoryItem";

export interface Listings {
  message: string;
  data: {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: string,
    previousCursor: string,
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
  inactive: boolean;
  zipCode: string;
  state: string;
  createdAt: string;
  inventoryItem: InventoryItemData;
}

export interface ListingPatchData {
  name?: string;
  description?: string;
  attributes?: {[key: string]: string};
  quantity?: number;
  latitude?: number;
  longitude?: number;
  inactive?: boolean;
  zipCode?: string;
  state?: string;
  inventoryItemID?: number;
}

export const ACTIVE = "ACTIVE";
export const INACTIVE = "INACTIVE";

export const LISTING_STATES = [ACTIVE, INACTIVE];
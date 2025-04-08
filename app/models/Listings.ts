// GET

import { InventoryItemData } from "./InventoryItem";

export interface Listings {
  message: string;
  success: boolean;
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
  attributes: {[key: string]: string};
  quantity: number;
  latitude: number;
  longitude: number;
  inactive: boolean;
  zipCode: string;
  state: string;
  createdAt: string;
  inventoryItem: InventoryItemData | null;
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

export interface Bookmarks {
  success: boolean,
  message: string,
  data: {
    results: BookmarkData[],
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: string | null,
    previousCursor: string | null
  }
}

export interface BookmarksDelete {
  success: boolean,
  message: string,
  data: {
    raw: object[],
    affected: number
  }
}

export interface BookmarkData {
  id: number,
  dateCreated: string,
  listing: ListingData
}

export const ACTIVE = "ACTIVE";
export const INACTIVE = "INACTIVE";

export const LISTING_STATES = [ACTIVE, INACTIVE];

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
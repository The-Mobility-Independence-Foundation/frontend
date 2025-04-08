import { AddressData } from "./Address";
import { AttachmentData } from "./Attachment";
import { InventoryData } from "./Inventory";
import { InventoryItemData } from "./InventoryItem";
import { OrganizationData } from "./Organization";
import { PartData } from "./Part";

export interface Listings {
  success: boolean;
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

export interface SingleListing {
  success: boolean;
  message: string;
  data: ListingData;
}

export interface ListingData {
  id: string;
  name: string;
  description: string;
  attributes: {[key: string]: string};
  quantity: number;
  address: AddressData;
  status: string;
  createdAt: string;
  organization: OrganizationData;
  inventory: InventoryData;
  inventoryItem: InventoryItemData | null;
  attachments: AttachmentData[],
  part: PartData
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

export const LISTING_STATUSES = [ACTIVE, INACTIVE];

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
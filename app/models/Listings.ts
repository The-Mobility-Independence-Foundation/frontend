import { AddressData } from "./Address";
import { AttachmentData } from "./Attachment";
import { InventoryData } from "./Inventory";
import { InventoryItemData } from "./InventoryItem";
import { OrganizationData } from "./Organization";
import { PartData } from "./Part";

export interface Listings {
  success: boolean;
  message: string;
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
  inventoryItemId: number;
  organizationId: number,
  name: string;
  description: string;
  attributes: {[key: string]: string};
  quantity: number;
  status: string;
  createdAt: string;
  point: {
    type: string,
    coordinates: number[]
  }
  ftsVector: string;
  deletedAt: string | null;
  inventoryItem: InventoryItemData | null;
  organization: OrganizationData;
  address: AddressData;
  attachments: AttachmentData[],
  part: PartData;
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

export interface ListingDelete {
  success: boolean;
  message: string;
  data: null;
}

export const ACTIVE = "ACTIVE";
export const INACTIVE = "INACTIVE";

export const LISTING_STATUSES = [ACTIVE, INACTIVE];

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
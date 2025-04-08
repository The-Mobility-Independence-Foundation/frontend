import { AddressData } from "./Address"
import { ListingData } from "./Listings"
import { OrganizationData } from "./Organization"
import { UserData } from "./User"

export enum OrderStatus {
  INITIATED = "initiated",
  FULLFILLED = "fullfilled",
  PENDING = "pending",
  VOIDED = "voided"
}

export interface Orders {
  success: boolean,
  message: string,
  data: {
    results: OrderData[],
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: string | null,
    previousCursor: string | null
  }
}

export interface Orderpool {
  success: boolean,
  message: string,
  data: OrderData[]
}

export interface OrdersPatch {
  success: boolean,
  message: string,
  data: OrdersPatchData
}

export interface OrdersPost {
  success: boolean
  message: string,
  data: OrdersPostData
}

export interface OrderData {
  id: number,
  quantity: number,
  status: string,
  dateCreated: string,
  dateCompleted: string | null,
  listing: ListingData,
  recipient: UserData,
  recipientOrganization: OrganizationData | null,
  provider: UserData | null,
  providerOrganization: OrganizationData
}

export interface OrdersPatchData {
  id: number,
  quantity: number,
  status: string,
  dateCreated: string,
  dateCompleted: string | null,
  address: AddressData | null,
  recipientOrganization: OrganizationData,
  provider: UserData
}

export interface OrdersPostData {
  listing: ListingData,
  providerOrganization: OrganizationData,
  recipient: UserData,
  recipientOrganization: OrganizationData,
  quantity: number,
  status: string,
  dateCreated: string,
  address: AddressData,
  dateCompleted: string | null;
  id: number
}
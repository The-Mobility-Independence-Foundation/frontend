// GET

import { OrganizationData } from "./Organization";

export interface Users {
  message: string;
  data: {
    count: number;
    totalCount: number;
    hasNext: boolean;
    nextToken: string | null;
    results: UserData[]
  }
}

export interface User {
  success: boolean;
  message: string;
  data: UserData;
}

export interface UserData {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  displayName: string,
  type: string,
  lastActivity: string,
  inactive: boolean,
  referralCode: string | null,
  rating: string
}

export interface PatchUser {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  displayName: string,
  rating: number,
  listingsNum: number,
  connectionsNum: number,
  lastActive: string,
  organization: OrganizationData
}
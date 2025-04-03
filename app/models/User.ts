// GET

import { ConnectionData } from "./Connection";
import { OrganizationData } from "./Organization";

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

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
  type: UserRole,
  lastActivity: string,
  inactive: boolean,
  referralCode: string | null,
  rating: string
  organization: OrganizationData | null
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
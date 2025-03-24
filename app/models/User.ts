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
  message: string;
  data: UserData;
}

export interface UserData {
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

export const testUserData: UserData = {
  id: "1",
  firstName: "First",
  lastName: "Last",
  username: "username",
  displayName: "Display Name",
  rating: 3.5,
  listingsNum: 3,
  connectionsNum: 2,
  lastActive: "Nov. 25th 2001",
  organization: {
    id: "1",
    name: "Organization",
    email: "person@organization.com",
    phoneNumber: "111-111-1111"
  }
}
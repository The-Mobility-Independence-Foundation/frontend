// GET

import { UserData } from "./User";

export interface Connections {
  message: string;
  success: boolean;
  data: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor: any;
    previousCursor: any;
    results: ConnectionData[]
  }
}

export interface ConnectionData {
  id: string,
  followerId: string,
  followingId: string,
  createdAt: Date
}
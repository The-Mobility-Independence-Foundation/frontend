// GET

export interface Connections {
  message: string;
  success: boolean;
  data: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor: string | null;
    previousCursor: string | null;
    results: ConnectionData[]
  }
}

export interface ConnectionData {
  id: string,
  followerId: string,
  followingId: string,
  createdAt: Date
}
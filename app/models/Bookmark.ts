import { ListingData } from "./Listings"
import { UserData } from "./User"

export interface Bookmarks {
  success: boolean,
  message: string,
  data: {
    hasNextPage: boolean, 
    hasPreviousPage: boolean, 
    nextCursor: string | null, 
    previousCursor: string | null,
    results: BookmarkData[]
  }
}

export interface BookmarkPost {
  success: boolean,
  message: string,
  data: BookmarkData
}

export interface BookmarkData {
  user: UserData,
  listing: ListingData,
  id: number,
  dateCreated: string
}


export interface BookmarksDelete {
  success: boolean,
  message: string,
  data: {
    raw: object[],
    affected: number
  }
}
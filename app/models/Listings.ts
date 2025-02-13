// GET

export interface Listings {
  message: string;
  data: {
    count: number;
    hasNext: boolean;
    nextToken: string;
    results: ListingData[]
  }
}

export interface Listing {
  message: string;
  data: ListingData;
}

export interface ListingData {
  id: string;
  title: string;
  attributes: any;
  quantity: number;
  latitude: number;
  longitude: number;
  inventoryItemId: number;
  status: string;
}
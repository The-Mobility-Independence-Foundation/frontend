export interface Manufacturers {
  success: boolean,
  message: string,
  data: {
    results: ManufacturerData[],
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: string | null,
    previousCursor: string | null
  }
}

export interface ManufacturerData {
  id: number,
  name: string,
}
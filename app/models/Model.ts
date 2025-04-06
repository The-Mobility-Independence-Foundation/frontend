import { ManufacturerData } from "./Manufacturer"
import { PartData } from "./Part"

export interface Models {
  success: boolean,
  message: string | null,
  data: {
    results: ModelData[],
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: string | null,
    previousCursor: string | null
  }
}

export interface ModelData {
  id: number,
  name: string,
  year: number,
  manufacturer: ManufacturerData,
  types: ModelType[],
  parts: PartData[]
}

export interface ModelType {
  success: boolean,
  message: string,
  data: {
    results: ModelTypeData[],
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: string | null,
    previousCursor: string | null
  }
}

export interface ModelTypeData {
  id: number,
  name: string
}
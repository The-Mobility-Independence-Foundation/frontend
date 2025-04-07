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

export interface ModelsPost {
  success: boolean,
  message: string,
  data: ModelData
}

export interface ModelData {
  id: number,
  name: string,
  year: number,
  manufacturer: ManufacturerData,
  types: ModelTypes[],
  parts: PartData[]
}

export interface ModelTypes {
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

export interface ModelTypePost {
  success: boolean,
  message: string,
  data: ModelTypeData
}

export interface ModelTypeData {
  id: number,
  name: string
}
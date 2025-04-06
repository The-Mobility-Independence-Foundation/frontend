// GET

import { ModelData } from "./Model";

export interface Parts {
  success: boolean;
  message: string | null;
  data: PartData[];
}

export interface PartTypes {
  success: boolean,
  message: string | null,
  data: {
    results: PartTypeData[],
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: string | null,
    previousCursor: string | null
  }
}

export interface PartData {
  id: number;
  name: string;
  description: string;
  partNumber: string;
  model: ModelData | null,
  types: PartTypeData[]
}

export interface PartPost {
  success: boolean,
  message: string,
  data: PartData
}

export interface PartTypeData {
  id: number,
  name: string,
  parts: PartData[]
}
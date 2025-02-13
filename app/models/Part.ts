// GET

export interface Part {
  message: string;
  data: PartData;
}

export interface PartData {
  id: number;
  name: string;
  modelID: number;
  description: string;
  partNumber: string;
}
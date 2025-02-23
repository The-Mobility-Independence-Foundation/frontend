// GET

export interface Part {
  message: string;
  data: PartData;
}

export interface PartData {
  id: number;
  name: string;
  model: string;
  description: string;
  partNumber: string;
  partType: string;
}
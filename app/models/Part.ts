// GET

export interface Parts {
  success: boolean;
  message: string | null;
  data: PartData[];
}

export interface PartData {
  id: number;
  name: string;
  description: string;
  partNumber: string;
}
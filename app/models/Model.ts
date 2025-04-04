export interface Models {
  success: boolean,
  message: string | null,
  data: ModelData[]
}

export interface ModelData {
  name: string,
  year: number,
  id: number
}
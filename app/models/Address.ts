export interface Address {
  success: boolean,
  message: string | null,
  data: AddressData
}

export interface AddressData {
  addressLine1: string,
  addressLine2: string,
  city: string,
  state: string,
  zipCode: string,
  id: number
}
export interface Organization {
  message: string;
  data: OrganizationData;
}

export interface OrganizationData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}
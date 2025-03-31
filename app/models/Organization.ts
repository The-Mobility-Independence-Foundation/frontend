export interface Organization {
  message: string;
  data: OrganizationData;
}

export interface OrganizationData {
  id: string;
  name: string;
  lastActivity: string;
  inactive: boolean;
  services: string;
  rating: string;
  phoneNumber: string | null;
  ein: string;
  socials: string[]
}
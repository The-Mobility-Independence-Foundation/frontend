// GET

import { UserData } from "./User";

export interface Connections {
  message: string;
  data: {
    connections: ConnectionData[]
  }
}

export interface ConnectionData {
  id: string,
  user: UserData
}

export const testConnectionData: ConnectionData = {
  id: "1",
  user: {
    id: "1",
    firstName: "First",
    lastName: "Last",
    username: "username",
    displayName: "Display Name",
    rating: 3.5,
    listingsNum: 3,
    connectionsNum: 2,
    lastActive: "Nov. 25th 2001",
    organization: {
        id: "1",
        name: "Organization",
        email: "person@organization.com",
        phoneNumber: "111-111-1111"
    }
  }
}
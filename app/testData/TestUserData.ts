import { Users } from "../models/User"

export const TEST_USER_ONE = {
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

export const TEST_USER_TWO = {
    id: "2",
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

export const testUsers: Users = {
  message: "message",
  data: {
    count: 2,
    totalCount: 2,
    hasNext: true,
    nextToken: null,
    results: [TEST_USER_ONE, TEST_USER_TWO]
  }
}
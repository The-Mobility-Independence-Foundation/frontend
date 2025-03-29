import { Messages } from "../models/Message"

export const TEST_MESSAGE_ONE = {
    id: "1",
    authorId: "2",
    conversationId: "1",
    messageContent: "Hi",
    readStatus: "read",
    createdAt: new Date("December 17, 2024 03:24:00"),
    updatedAt: new Date("December 17, 2024 03:25:00"),
    attachments: [""]
}

export const TEST_MESSAGE_TWO = {
    id: "2",
    authorId: "1",
    conversationId: "1",
    messageContent: "Hello",
    readStatus: "read",
    createdAt: new Date("December 17, 2024 03:33:00"),
    updatedAt: new Date("December 17, 2024 03:33:00"),
    attachments: [""]
}

export const testMessages: Messages = {
  message: "message",
  data: {
    count: 2,
    hasNext: true,
    nextToken: null,
    results: [TEST_MESSAGE_ONE, TEST_MESSAGE_TWO]
  }
}
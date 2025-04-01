import { Conversations, ConversationType } from "../models/Conversation"
import { TEST_MESSAGE_ONE } from "./TestMessagesData"

export const TEST_CONVERSATION_ONE = {
    id: "1",
    type: ConversationType.INQUIRY,
    listingId: "1",
    initiatorId: "1",
    participantId: "2",
    messages: [TEST_MESSAGE_ONE],
    createdAt: new Date("December 17, 2024 03:33:00"),
    updatedAt: new Date("December 17, 2024 03:33:00")
}

export const TEST_CONVERSATION_TWO = {
    id: "2",
    type: ConversationType.INQUIRY,
    listingId: "1",
    initiatorId: "1",
    participantId: "2",
    messages: [TEST_MESSAGE_ONE],
    createdAt: new Date("December 17, 2024 03:33:00"),
    updatedAt: new Date("December 17, 2024 03:33:00")
}

export const TEST_CONVERSATION_THREE = {
    id: "3",
    type: ConversationType.INQUIRY,
    listingId: "1",
    initiatorId: "1",
    participantId: "2",
    messages: [TEST_MESSAGE_ONE],
    createdAt: new Date("December 17, 2024 03:33:00"),
    updatedAt: new Date("December 17, 2024 03:33:00")
}

export const testConversations: Conversations = {
  message: "message",
  data: {
    count: 3,
    hasNext: true,
    nextToken: null,
    results: [TEST_CONVERSATION_ONE, TEST_CONVERSATION_TWO, TEST_CONVERSATION_THREE]
  }
}
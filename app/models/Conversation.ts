// GET

import { MessageData } from "./Message";

export enum ConversationType {
  DIRECT = 'direct',
  INQUIRY = 'inquiry',
}

export interface Conversations {
    message: string;
    data: {
      count: number;
      hasNext: boolean;
      nextToken: string | null;
      results: ConversationData[]
    }
  }
  
  export interface Conversation {
    message: string;
    data: ConversationData;
  }
  
  export interface ConversationData {
    id: string,
    type: ConversationType,
    listingId: string,
    initiatorId: string,
    participantId: string,
    messages: MessageData[],
    createdAt: Date,
    updatedAt: Date
  }
  
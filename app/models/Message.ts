// GET

import { AttachmentData } from "./Attachment";
import { UserData } from "./User";

export interface Messages {
  message: string;
  data: {
    count: number;
    hasNext: boolean;
    nextToken: string | null;
    results: MessageData[]
  }
}

export interface Message {
  message: string;
  data: MessageData;
}

export interface MessageData {
  id: string,
  author: UserData,
  conversationId: string,
  content: string,
  attachments: AttachmentData[],
  createdAt: Date,
  updatedAt: Date
}

export interface PatchMessage {
  content: string
}
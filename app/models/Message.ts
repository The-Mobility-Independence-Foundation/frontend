// GET

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
  authorId: string,
  conversationId: string,
  messageContent: string,
  readStatus: string,
  createdAt: Date,
  updatedAt: Date,
  attachments: string[]
}

export interface PatchMessage {
  id: string,
  authorId: string,
  conversationId: string,
  messageContent: string,
  readStatus: string,
  createdAt: Date,
  updatedAt: Date,
  attachments: string[]
}
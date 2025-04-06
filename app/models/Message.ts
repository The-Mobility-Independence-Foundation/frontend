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
  content: string,
  readAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
  attachments: string[]
}

export interface PatchMessage {
  id: string,
  authorId: string,
  conversationId: number,
  content: string,
  readAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
  attachments: string[]
}
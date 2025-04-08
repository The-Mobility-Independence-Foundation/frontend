export interface AttachmentData {
  id: number,
  authorId: number,
  entityId: number,
  entityType: string,
  fileName: string,
  fileSize: string,
  mimeType: string,
  key: string,
  createdAt: string,
  deletedAt: string | null,
  url: string
}
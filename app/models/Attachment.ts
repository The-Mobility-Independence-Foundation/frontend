export interface AttachmentData {
    id: string,
    authorId: string,
    entityId: string,
    entityType: string,
    fileName: string,
    fileSize: string,
    mimeType: string,
    key: string,
    createdAt: Date,
    deletedAt: Date | null,
    url: string
}
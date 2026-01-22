// Shared types for migration scripts

export interface ExportedPost {
  id: string
  boardType: string
  title: string
  content: string | null
  isPublished: boolean
  isPinned: boolean | null
  views: number
  year: number | null
  budgetType: string | null
  thumbnailUrl: string | null
  createdAt: Date
  updatedAt: Date
  attachments: ExportedAttachment[]
}

export interface ExportedAttachment {
  id: string
  postId: string
  filenameOriginal: string
  fileUrl: string
  fileSize: number
  isImage: boolean
  displayOrder: number
  createdAt: Date
}

export interface ExportedAdmin {
  id: string
  username: string
  passwordHash: string
  createdAt: Date
}

export interface MigrationData {
  posts: ExportedPost[]
  admins: ExportedAdmin[]
  exportedAt: Date
}

export interface UploadedFile {
  originalPath: string
  newPath: string
  newUrl: string
  size: number
}

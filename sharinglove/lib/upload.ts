import { writeFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

// 허용된 파일 타입
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
]

// HWP 파일은 확장자로 판단
const ALLOWED_EXTENSIONS = ['.hwp', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip']

// 파일 크기 제한
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024 // 20MB
const MAX_FILES_PER_POST = 10

export interface UploadedFile {
  filename: string
  filepath: string
  url: string
  size: number
  mimetype: string
  isImage: boolean
  thumbnailUrl?: string
}

/**
 * 파일이 이미지인지 확인
 */
export function isImageFile(mimetype: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mimetype)
}

/**
 * 파일이 허용된 문서 타입인지 확인
 */
export function isAllowedDocument(filename: string, mimetype: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return ALLOWED_DOCUMENT_TYPES.includes(mimetype) || ALLOWED_EXTENSIONS.includes(ext)
}

/**
 * 파일 크기가 허용 범위 내인지 확인
 */
export function isValidFileSize(size: number, isImage: boolean): boolean {
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOCUMENT_SIZE
  return size <= maxSize
}

/**
 * 고유한 파일명 생성
 */
export function generateUniqueFilename(originalFilename: string): string {
  const ext = path.extname(originalFilename)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}${ext}`
}

/**
 * 이미지 파일 업로드 및 썸네일 생성
 */
export async function uploadImage(file: File): Promise<UploadedFile> {
  // 파일 검증
  if (!isImageFile(file.type)) {
    throw new Error('허용되지 않은 이미지 형식입니다.')
  }

  if (!isValidFileSize(file.size, true)) {
    throw new Error(`이미지 파일 크기는 ${MAX_IMAGE_SIZE / 1024 / 1024}MB 이하여야 합니다.`)
  }

  // 파일 저장
  const filename = generateUniqueFilename(file.name)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images')
  const filepath = path.join(uploadDir, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filepath, buffer)

  // 썸네일 생성 (300x300)
  const thumbnailFilename = `thumb-${filename}`
  const thumbnailPath = path.join(uploadDir, thumbnailFilename)

  await sharp(buffer)
    .resize(300, 300, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: 80 })
    .toFile(thumbnailPath.replace(path.extname(thumbnailPath), '.webp'))

  return {
    filename,
    filepath,
    url: `/uploads/images/${filename}`,
    size: file.size,
    mimetype: file.type,
    isImage: true,
    thumbnailUrl: `/uploads/images/${thumbnailFilename.replace(path.extname(thumbnailFilename), '.webp')}`,
  }
}

/**
 * 문서 파일 업로드
 */
export async function uploadDocument(file: File): Promise<UploadedFile> {
  // 파일 검증
  if (!isAllowedDocument(file.name, file.type)) {
    throw new Error('허용되지 않은 파일 형식입니다.')
  }

  if (!isValidFileSize(file.size, false)) {
    throw new Error(`문서 파일 크기는 ${MAX_DOCUMENT_SIZE / 1024 / 1024}MB 이하여야 합니다.`)
  }

  // 파일 저장
  const filename = generateUniqueFilename(file.name)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents')
  const filepath = path.join(uploadDir, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filepath, buffer)

  return {
    filename,
    filepath,
    url: `/uploads/documents/${filename}`,
    size: file.size,
    mimetype: file.type,
    isImage: false,
  }
}

/**
 * 파일 업로드 (이미지 or 문서 자동 판단)
 */
export async function uploadFile(file: File): Promise<UploadedFile> {
  if (isImageFile(file.type)) {
    return uploadImage(file)
  } else if (isAllowedDocument(file.name, file.type)) {
    return uploadDocument(file)
  } else {
    throw new Error('허용되지 않은 파일 형식입니다.')
  }
}

/**
 * 여러 파일 업로드
 */
export async function uploadFiles(files: File[]): Promise<UploadedFile[]> {
  if (files.length > MAX_FILES_PER_POST) {
    throw new Error(`최대 ${MAX_FILES_PER_POST}개의 파일만 업로드할 수 있습니다.`)
  }

  const uploadPromises = files.map(file => uploadFile(file))
  return Promise.all(uploadPromises)
}

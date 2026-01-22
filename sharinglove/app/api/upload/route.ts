import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseStorage } from '@/lib/supabase'

// 허용된 파일 확장자
const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.hwp',
  '.jpg', '.jpeg', '.png', '.webp', '.gif'
]

// 파일 크기 제한 (바이트)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024 // 20MB

function isImageFile(filename: string): boolean {
  const ext = filename.toLowerCase().split('.').pop()
  return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')
}

function getFileExtension(filename: string): string {
  return '.' + (filename.split('.').pop()?.toLowerCase() || '')
}

function sanitizeFilename(filename: string): string {
  // 특수문자 제거하고 안전한 파일명 생성
  return filename
    .normalize('NFC')
    .replace(/[^\w가-힣.-]/g, '_')
    .replace(/_+/g, '_')
}

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin-token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return NextResponse.json(
        { error: '업로드할 파일이 없습니다.' },
        { status: 400 }
      )
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        // 파일 확장자 검증
        const ext = getFileExtension(file.name)
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          throw new Error(`허용되지 않는 파일 형식입니다: ${ext}`)
        }

        // 파일 크기 검증
        const isImage = isImageFile(file.name)
        const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOCUMENT_SIZE
        if (file.size > maxSize) {
          const maxSizeMB = maxSize / (1024 * 1024)
          throw new Error(`파일 크기가 ${maxSizeMB}MB를 초과합니다: ${file.name}`)
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const timestamp = Date.now()
        const sanitizedName = sanitizeFilename(file.name)
        const fileName = `${timestamp}-${sanitizedName}`

        const { data: uploadData, error: uploadError } = await supabaseStorage.upload(
          fileName,
          buffer,
          {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false,
          }
        )

        if (uploadError) {
          throw new Error(`파일 업로드 실패: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabaseStorage.getPublicUrl(uploadData.path)
        const fileUrl = publicUrl

        return {
          filename: file.name,
          url: fileUrl,
          size: file.size,
          mimetype: file.type,
          isImage: isImage,
          thumbnailUrl: isImage ? fileUrl : undefined,
        }
      })
    )

    return NextResponse.json({ files: uploadedFiles })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '파일 업로드에 실패했습니다.' },
      { status: 500 }
    )
  }
}

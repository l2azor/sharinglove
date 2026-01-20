import { NextRequest, NextResponse } from 'next/server'
import { uploadFiles } from '@/lib/upload'
import { verifyToken } from '@/lib/auth'

/**
 * 파일 업로드 API
 * POST /api/upload
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인 (관리자만 업로드 가능)
    const token = request.cookies.get('admin-token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    // FormData에서 파일 추출
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return NextResponse.json(
        { error: '업로드할 파일이 없습니다.' },
        { status: 400 }
      )
    }

    // 파일 업로드
    const uploadedFiles = await uploadFiles(files)

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

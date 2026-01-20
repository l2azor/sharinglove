import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

interface AttachmentInput {
  filenameOriginal: string
  fileUrl: string
  fileSize: number
  isImage: boolean
}

/**
 * 게시글 상세 조회
 * GET /api/posts/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        attachments: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 조회수 증가
    await prisma.post.update({
      where: { id },
      data: { views: post.views + 1 },
    })

    return NextResponse.json({
      ...post,
      views: post.views + 1,
    })
  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { error: '게시글을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * 게시글 수정
 * PUT /api/posts/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin-token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const {
      title,
      content,
      isPublished,
      isPinned,
      year,
      budgetType,
      thumbnailUrl,
      attachments = [],
    } = body

    // 기존 게시글 확인
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 공지사항 고정 개수 제한
    if (existingPost.boardType === 'NOTICE' && isPinned && !existingPost.isPinned) {
      const pinnedCount = await prisma.post.count({
        where: {
          boardType: 'NOTICE',
          isPinned: true,
          id: { not: id },
        },
      })

      if (pinnedCount >= 3) {
        return NextResponse.json(
          { error: '고정 공지는 최대 3개까지만 등록할 수 있습니다.' },
          { status: 400 }
        )
      }
    }

    // 첨부파일 삭제 후 재생성
    await prisma.attachment.deleteMany({
      where: { postId: id },
    })

    // 게시글 수정
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        isPublished,
        isPinned: existingPost.boardType === 'NOTICE' ? isPinned : null,
        year: existingPost.boardType === 'BUDGET' ? year : null,
        budgetType: existingPost.boardType === 'BUDGET' ? budgetType : null,
        thumbnailUrl: existingPost.boardType === 'GALLERY' ? thumbnailUrl : null,
        attachments: {
          create: attachments.map((att: AttachmentInput, index: number) => ({
            filenameOriginal: att.filenameOriginal,
            fileUrl: att.fileUrl,
            fileSize: att.fileSize,
            isImage: att.isImage,
            displayOrder: index,
          })),
        },
      },
      include: {
        attachments: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { error: '게시글 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * 게시글 삭제
 * DELETE /api/posts/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin-token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const { id } = await params

    // 게시글 삭제 (첨부파일은 CASCADE로 자동 삭제)
    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { error: '게시글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

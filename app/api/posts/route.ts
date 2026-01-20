import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { BoardType, BudgetType, Prisma } from '@prisma/client'

interface AttachmentInput {
  filenameOriginal: string
  fileUrl: string
  fileSize: number
  isImage: boolean
}

/**
 * 게시글 목록 조회
 * GET /api/posts?boardType=NOTICE&page=1&limit=10&search=keyword
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const boardType = searchParams.get('boardType') as BoardType
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const year = searchParams.get('year')
    const budgetType = searchParams.get('budgetType') as BudgetType | null

    // 필터 조건
    const where: Prisma.PostWhereInput = {
      isPublished: true,
    }

    if (boardType) {
      where.boardType = boardType
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ]
    }

    // 예산/결산 필터
    if (year) {
      where.year = parseInt(year)
    }
    if (budgetType) {
      where.budgetType = budgetType
    }

    // 총 개수 조회
    const total = await prisma.post.count({ where })

    // 페이징 처리된 목록 조회
    const posts = await prisma.post.findMany({
      where,
      include: {
        attachments: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' }, // 고정 공지 우선
        { createdAt: 'desc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { error: '게시글 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * 게시글 생성
 * POST /api/posts
 */
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

    const body = await request.json()
    const {
      boardType,
      title,
      content,
      isPublished = true,
      isPinned = false,
      year,
      budgetType,
      thumbnailUrl,
      attachments = [],
    } = body

    // 필수 필드 검증
    if (!boardType || !title) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 공지사항 고정 개수 제한 (최대 3개)
    if (boardType === 'NOTICE' && isPinned) {
      const pinnedCount = await prisma.post.count({
        where: {
          boardType: 'NOTICE',
          isPinned: true,
        },
      })

      if (pinnedCount >= 3) {
        return NextResponse.json(
          { error: '고정 공지는 최대 3개까지만 등록할 수 있습니다.' },
          { status: 400 }
        )
      }
    }

    // 예산/결산은 첨부파일 필수
    if (boardType === 'BUDGET' && attachments.length === 0) {
      return NextResponse.json(
        { error: '예산/결산은 첨부파일이 필수입니다.' },
        { status: 400 }
      )
    }

    // 갤러리는 이미지 필수
    if (boardType === 'GALLERY' && !thumbnailUrl) {
      return NextResponse.json(
        { error: '갤러리는 이미지가 필수입니다.' },
        { status: 400 }
      )
    }

    // 게시글 생성
    const post = await prisma.post.create({
      data: {
        boardType,
        title,
        content,
        isPublished,
        isPinned: boardType === 'NOTICE' ? isPinned : null,
        year: boardType === 'BUDGET' ? year : null,
        budgetType: boardType === 'BUDGET' ? budgetType : null,
        thumbnailUrl: boardType === 'GALLERY' ? thumbnailUrl : null,
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

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: '게시글 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

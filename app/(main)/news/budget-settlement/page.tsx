import { FileText } from 'lucide-react'
import PostList from '@/components/board/PostList'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: '예산 및 결산서',
  description: '사랑나눔복지센터의 예산 및 결산서 공개',
}

export default async function BudgetSettlementPage() {
  const posts = await prisma.post.findMany({
    where: {
      boardType: 'BUDGET',
      isPublished: true,
    },
    include: {
      attachments: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },
    orderBy: [
      { year: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 20,
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 text-4xl font-bold text-foreground">
          예산 및 결산서
        </h1>
        <p className="text-muted-foreground">
          센터의 투명한 재정 운영을 확인하세요
        </p>
      </div>

      {/* 게시글 목록 */}
      <div className="mx-auto max-w-5xl">
        <PostList
          posts={posts}
          boardType="BUDGET"
          basePath="/news/budget-settlement"
          showFilters={true}
          showSearch={true}
        />
      </div>
    </div>
  )
}

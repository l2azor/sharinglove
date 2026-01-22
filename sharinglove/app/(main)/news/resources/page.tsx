import { FolderOpen } from 'lucide-react'
import PostList from '@/components/board/PostList'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '자료실',
  description: '사랑나눔복지센터의 유용한 자료 모음',
}

export default async function ResourcesPage() {
  const posts = await prisma.post.findMany({
    where: {
      boardType: 'RESOURCE',
      isPublished: true,
    },
    include: {
      attachments: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <FolderOpen className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 text-4xl font-bold text-foreground">자료실</h1>
        <p className="text-muted-foreground">
          유용한 복지 관련 자료를 제공합니다
        </p>
      </div>

      {/* 게시글 목록 */}
      <div className="mx-auto max-w-5xl">
        <PostList
          posts={posts}
          basePath="/news/resources"
          showSearch={true}
        />
      </div>
    </div>
  )
}

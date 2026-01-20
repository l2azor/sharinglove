import { Image as ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: '갤러리',
  description: '사랑나눔복지센터의 다양한 활동 사진',
}

export default async function GalleryPage() {
  const posts = await prisma.post.findMany({
    where: {
      boardType: 'GALLERY',
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
    take: 24,
  })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <ImageIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 text-4xl font-bold text-foreground">갤러리</h1>
        <p className="text-muted-foreground">
          센터의 다양한 활동 모습을 만나보세요
        </p>
      </div>

      {/* 갤러리 그리드 */}
      <div className="mx-auto max-w-6xl">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              등록된 사진이 없습니다.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {posts.map((post) => (
              <Link key={post.id} href={`/news/gallery/${post.id}`}>
                <Card className="group overflow-hidden transition-all hover:shadow-xl">
                  {/* 썸네일 */}
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-secondary to-accent/10">
                    {post.thumbnailUrl ? (
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  {/* 제목 */}
                  <CardContent className="p-4">
                    <h3 className="mb-1 line-clamp-2 font-semibold text-foreground group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* 페이지네이션 (추후 구현) */}
        {posts.length > 0 && (
          <div className="mt-8 flex justify-center gap-2">
            <button className="rounded-lg border px-4 py-2 text-sm hover:bg-secondary">
              이전
            </button>
            <button className="rounded-lg border bg-primary px-4 py-2 text-sm text-primary-foreground">
              1
            </button>
            <button className="rounded-lg border px-4 py-2 text-sm hover:bg-secondary">
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

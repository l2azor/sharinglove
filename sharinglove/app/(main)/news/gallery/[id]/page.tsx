import { notFound } from 'next/navigation'
import { Eye, Calendar, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'


interface AttachmentType {
  id: string
  filenameOriginal: string
  fileUrl: string
  thumbnailUrl?: string
  isImage: boolean
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      attachments: {
        where: {
          isImage: true,
        },
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },
  })

  if (!post || post.boardType !== 'GALLERY') {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {/* 뒤로가기 */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/news/gallery">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Link>
        </Button>

        {/* 게시글 */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="border-b bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views}
              </span>
            </div>
            <CardTitle className="text-2xl md:text-3xl">{post.title}</CardTitle>
          </CardHeader>

          <CardContent className="pt-8">
            {/* 본문 */}
            {post.content && (
              <div
                className="prose prose-neutral max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* 이미지 갤러리 */}
            <div className="mt-8 space-y-6">
              {post.attachments.length === 0 ? (
                <div className="rounded-xl border bg-secondary/30 p-12 text-center">
                  <ImageIcon className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                  <p className="text-muted-foreground">이미지가 없습니다.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {post.attachments.map((attachment: AttachmentType) => (
                    <div
                      key={attachment.id}
                      className="overflow-hidden rounded-xl border bg-card shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={attachment.fileUrl}
                        alt={attachment.filenameOriginal}
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 하단 버튼 */}
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href="/news/gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

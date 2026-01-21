import { notFound } from 'next/navigation'
import { Eye, Calendar, Download, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'


interface AttachmentType {
  id: string
  filenameOriginal: string
  fileUrl: string
  fileSize: number | null
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BudgetDetailPage({ params }: PageProps) {
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

  if (!post || post.boardType !== 'BUDGET') {
    notFound()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* 뒤로가기 */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/news/budget-settlement">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Link>
        </Button>

        {/* 게시글 */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="border-b bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
              {post.year && (
                <span className="rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground">
                  {post.year}년
                </span>
              )}
              {post.budgetType && (
                <span className="rounded-full bg-accent/80 px-3 py-1 font-medium text-white">
                  {post.budgetType === 'BUDGET' ? '예산' : '결산'}
                </span>
              )}
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
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

            {/* 첨부파일 */}
            <div className="mt-8 rounded-xl border bg-secondary/30 p-6">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                첨부파일
              </h3>
              {post.attachments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  첨부파일이 없습니다.
                </p>
              ) : (
                <ul className="space-y-2">
                  {post.attachments.map((attachment: AttachmentType) => (
                    <li key={attachment.id}>
                      <a
                        href={attachment.fileUrl}
                        download
                        className="flex items-center justify-between rounded-lg bg-background px-4 py-3 transition-colors hover:bg-primary/5"
                      >
                        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Download className="h-4 w-4 text-primary" />
                          {attachment.filenameOriginal}
                        </span>
                        {attachment.fileSize && (
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(attachment.fileSize)}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 하단 버튼 */}
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href="/news/budget-settlement">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Post {
  id: string
  title: string
  thumbnailUrl: string | null
  views: number
  createdAt: string
}

export default function AdminGalleryPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?boardType=GALLERY&limit=50')
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPosts()
      } else {
        alert('삭제에 실패했습니다.')
      }
    } catch {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">갤러리 관리</h1>
          <p className="text-muted-foreground">
            갤러리 게시글을 등록, 수정, 삭제할 수 있습니다
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/gallery/new">
            <Plus className="mr-2 h-4 w-4" />
            새 글 작성
          </Link>
        </Button>
      </div>

      {/* 그리드 목록 */}
      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground">
          로딩 중...
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            등록된 게시글이 없습니다.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {posts.map((post, index) => (
            <Card key={post.id} className="overflow-hidden">
              {/* 썸네일 */}
              <div className="relative aspect-square bg-muted">
                {/* 번호 배지 */}
                <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white">
                  {posts.length - index}
                </div>
                {post.thumbnailUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                {/* 오버레이 버튼 */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/admin/gallery/${post.id}/edit`}>
                      <Edit className="mr-1 h-3.5 w-3.5" />
                      수정
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    삭제
                  </Button>
                </div>
              </div>

              {/* 정보 */}
              <CardContent className="p-3">
                <h3 className="truncate text-sm font-medium">{post.title}</h3>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

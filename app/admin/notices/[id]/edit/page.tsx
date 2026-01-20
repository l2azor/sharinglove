'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PostForm } from '@/components/admin/PostForm'

interface PostData {
  id: string
  title: string
  content: string | null
  isPublished: boolean
  isPinned: boolean | null
  attachments: Array<{
    filenameOriginal: string
    fileUrl: string
    fileSize: number
    isImage: boolean
  }>
}

export default function EditNoticePage() {
  const params = useParams()
  const [post, setPost] = useState<PostData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`)
        if (!response.ok) {
          throw new Error('게시글을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-destructive">
          {error || '게시글을 찾을 수 없습니다.'}
        </p>
      </div>
    )
  }

  return (
    <PostForm
      boardType="NOTICE"
      initialData={{
        id: post.id,
        title: post.title,
        content: post.content || '',
        isPublished: post.isPublished,
        isPinned: post.isPinned ?? false,
        attachments: post.attachments,
      }}
      returnUrl="/admin/notices"
      pageTitle="공지사항 수정"
    />
  )
}

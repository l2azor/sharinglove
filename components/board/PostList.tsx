'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Eye, Paperclip, Pin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Post, Attachment } from '@prisma/client'

interface PostWithAttachments extends Post {
  attachments: Attachment[]
}

interface PostListProps {
  posts: PostWithAttachments[]
  basePath: string
  showFilters?: boolean
  showSearch?: boolean
}

export default function PostList({
  posts,
  basePath,
  showFilters = false,
  showSearch = true,
}: PostListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      {(showSearch || showFilters) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              {showSearch && (
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="검색어를 입력하세요"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              {showFilters && (
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="연도" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="구분" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="BUDGET">예산</SelectItem>
                      <SelectItem value="SETTLEMENT">결산</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 게시글 목록 */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              등록된 게시글이 없습니다.
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Link key={post.id} href={`${basePath}/${post.id}`}>
              <Card className="transition-all hover:border-primary hover:shadow-md">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {post.isPinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        <h3 className="font-semibold text-foreground hover:text-primary">
                          {post.title}
                        </h3>
                        {post.attachments.length > 0 && (
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatDate(post.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {post.views}
                        </span>
                        {post.year && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {post.year}년
                          </span>
                        )}
                        {post.budgetType && (
                          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                            {post.budgetType === 'BUDGET' ? '예산' : '결산'}
                          </span>
                        )}
                      </div>
                    </div>
                    {post.thumbnailUrl && (
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* 페이지네이션 (추후 구현) */}
      {posts.length > 0 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">
            이전
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            다음
          </Button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, FileText, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface Post {
  id: string
  title: string
  year: number | null
  budgetType: 'BUDGET' | 'SETTLEMENT' | null
  createdAt: string
  attachments: Array<{ id: string }>
}

export default function AdminBudgetSettlementPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // 연도 옵션 생성
  const yearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear + 1; year >= currentYear - 10; year--) {
      years.push(year)
    }
    return years
  }

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      let url = '/api/posts?boardType=BUDGET&limit=100'
      if (yearFilter !== 'all') {
        url += `&year=${yearFilter}`
      }
      if (typeFilter !== 'all') {
        url += `&budgetType=${typeFilter}`
      }

      const response = await fetch(url)
      const data = await response.json()
      setPosts(data.posts)
    } catch (err) {
      console.error('Error fetching posts:', err)
    } finally {
      setIsLoading(false)
    }
  }, [yearFilter, typeFilter])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

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

  const getBudgetTypeLabel = (type: 'BUDGET' | 'SETTLEMENT' | null) => {
    if (type === 'BUDGET') return '예산'
    if (type === 'SETTLEMENT') return '결산'
    return '-'
  }

  const getBudgetTypeBadgeVariant = (type: 'BUDGET' | 'SETTLEMENT' | null) => {
    if (type === 'BUDGET') return 'default'
    if (type === 'SETTLEMENT') return 'secondary'
    return 'outline'
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">예산/결산 관리</h1>
          <p className="text-muted-foreground">
            예산 및 결산 자료를 등록, 수정, 삭제할 수 있습니다
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/budget-settlement/new">
            <Plus className="mr-2 h-4 w-4" />
            새 글 작성
          </Link>
        </Button>
      </div>

      {/* 필터 */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">연도:</span>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {yearOptions().map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}년
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">구분:</span>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="BUDGET">예산</SelectItem>
                <SelectItem value="SETTLEMENT">결산</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 목록 */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              로딩 중...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              등록된 게시글이 없습니다.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">번호</TableHead>
                  <TableHead className="w-24">연도</TableHead>
                  <TableHead className="w-24">구분</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-24">첨부</TableHead>
                  <TableHead className="w-32">등록일</TableHead>
                  <TableHead className="w-32 text-center">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post, index) => (
                  <TableRow key={post.id}>
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {posts.length - index}
                    </TableCell>
                    <TableCell className="font-medium">
                      {post.year ? `${post.year}년` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBudgetTypeBadgeVariant(post.budgetType)}>
                        {getBudgetTypeLabel(post.budgetType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      {post.attachments.length > 0 && (
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />
                          {post.attachments.length}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/budget-settlement/${post.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

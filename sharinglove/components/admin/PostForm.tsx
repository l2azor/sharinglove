'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RichTextEditor } from './RichTextEditor'
import { FileUploader, UploadedFile } from './FileUploader'
import { ImageUploader } from './ImageUploader'

// BoardType 정의
type BoardType = 'NOTICE' | 'BUDGET' | 'RESOURCE' | 'GALLERY'
type BudgetType = 'BUDGET' | 'SETTLEMENT'

// 통합 스키마 (모든 필드 포함)
const formSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(100, '제목은 100자 이내로 입력해주세요.'),
  content: z.string().optional(),
  isPublished: z.boolean(),
  isPinned: z.boolean().optional(),
  year: z.number().optional(),
  budgetType: z.enum(['BUDGET', 'SETTLEMENT']).optional(),
  thumbnailUrl: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// 폼 데이터 타입
interface PostFormData {
  title: string
  content: string
  isPublished: boolean
  isPinned?: boolean
  year?: number
  budgetType?: BudgetType
  thumbnailUrl?: string | null
  attachments: UploadedFile[]
}

interface PostFormProps {
  boardType: BoardType
  initialData?: PostFormData & { id?: string }
  returnUrl: string
  pageTitle: string
}

// 게시판 타입별 레이블
const boardTypeLabels: Record<BoardType, string> = {
  NOTICE: '공지사항',
  BUDGET: '예산/결산',
  RESOURCE: '자료실',
  GALLERY: '갤러리',
}

export function PostForm({
  boardType,
  initialData,
  returnUrl,
  pageTitle,
}: PostFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attachments, setAttachments] = useState<UploadedFile[]>(
    initialData?.attachments || []
  )
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    initialData?.thumbnailUrl || null
  )

  const isEditing = !!initialData?.id

  // 기본값 설정
  const getDefaultValues = (): FormValues => {
    return {
      title: initialData?.title || '',
      content: initialData?.content || '',
      isPublished: initialData?.isPublished ?? true,
      isPinned: initialData?.isPinned ?? false,
      year: initialData?.year ?? new Date().getFullYear(),
      budgetType: initialData?.budgetType ?? 'BUDGET',
      thumbnailUrl: initialData?.thumbnailUrl || '',
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  })

  const onSubmit = async (data: FormValues) => {
    // 예산/결산은 첨부파일 필수
    if (boardType === 'BUDGET' && attachments.length === 0) {
      alert('예산/결산은 첨부파일이 필수입니다.')
      return
    }

    // 갤러리는 대표 이미지 필수
    if (boardType === 'GALLERY' && !thumbnailUrl) {
      alert('갤러리는 대표 이미지가 필수입니다.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        boardType,
        ...data,
        thumbnailUrl: boardType === 'GALLERY' ? thumbnailUrl : undefined,
        attachments: attachments.map((att) => ({
          filenameOriginal: att.filenameOriginal,
          fileUrl: att.fileUrl,
          fileSize: att.fileSize,
          isImage: att.isImage,
        })),
      }

      const url = isEditing ? `/api/posts/${initialData.id}` : '/api/posts'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '저장에 실패했습니다.')
      }

      alert(isEditing ? '수정되었습니다.' : '등록되었습니다.')
      router.push(returnUrl)
    } catch (error) {
      alert(error instanceof Error ? error.message : '저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 연도 선택 옵션 (현재 연도 ± 5년)
  const yearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear + 1; year >= currentYear - 10; year--) {
      years.push(year)
    }
    return years
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(returnUrl)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {boardTypeLabels[boardType]}을(를) {isEditing ? '수정' : '작성'}합니다
          </p>
        </div>
      </div>

      {/* 폼 */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 제목 */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목 *</FormLabel>
                    <FormControl>
                      <Input placeholder="제목을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 공지사항: 상단 고정 */}
              {boardType === 'NOTICE' && (
                <FormField
                  control={form.control}
                  name="isPinned"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>상단 고정</FormLabel>
                        <FormDescription>
                          최대 3개까지 상단에 고정할 수 있습니다
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              {/* 예산/결산: 연도 & 구분 */}
              {boardType === 'BUDGET' && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>연도 *</FormLabel>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="연도 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {yearOptions().map((year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}년
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budgetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>구분 *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="구분 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BUDGET">예산</SelectItem>
                            <SelectItem value="SETTLEMENT">결산</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* 공개 여부 */}
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>공개</FormLabel>
                      <FormDescription>
                        체크 해제 시 비공개 상태로 저장됩니다
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 갤러리: 대표 이미지 */}
          {boardType === 'GALLERY' && (
            <Card>
              <CardHeader>
                <CardTitle>대표 이미지 *</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader value={thumbnailUrl} onChange={setThumbnailUrl} />
              </CardContent>
            </Card>
          )}

          {/* 내용 (WYSIWYG) */}
          <Card>
            <CardHeader>
              <CardTitle>내용</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="내용을 입력하세요..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 첨부파일 */}
          <Card>
            <CardHeader>
              <CardTitle>
                첨부파일
                {boardType === 'BUDGET' && ' *'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                value={attachments}
                onChange={setAttachments}
                maxFiles={10}
              />
              {boardType === 'BUDGET' && attachments.length === 0 && (
                <p className="mt-2 text-sm text-destructive">
                  예산/결산은 첨부파일이 필수입니다
                </p>
              )}
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(returnUrl)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? '수정' : '등록'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

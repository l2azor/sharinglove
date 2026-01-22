'use client'

import { useCallback, useState } from 'react'
import { X, Loader2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  value: string | null
  onChange: (url: string | null) => void
  className?: string
}

export function ImageUploader({
  value,
  onChange,
  className,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const uploadImage = useCallback(async (file: File) => {
    // 이미지 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.')
      return
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('이미지 크기는 10MB 이하여야 합니다.')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('files', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '이미지 업로드에 실패했습니다.')
      }

      const data = await response.json()
      if (data.files && data.files.length > 0) {
        // 원본 URL 사용 (썸네일 아님)
        onChange(data.files[0].url)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      uploadImage(e.dataTransfer.files[0])
    }
  }, [uploadImage])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        uploadImage(e.target.files[0])
      }
      // Reset input
      e.target.value = ''
    },
    [uploadImage]
  )

  const handleRemove = useCallback(() => {
    onChange(null)
  }, [onChange])

  // 이미지가 있는 경우 미리보기 표시
  if (value) {
    return (
      <div className={cn('relative', className)}>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="대표 이미지"
            className="h-full w-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="absolute right-2 top-2"
          >
            <X className="mr-1 h-4 w-4" />
            삭제
          </Button>
        </div>
      </div>
    )
  }

  // 이미지가 없는 경우 업로드 영역 표시
  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">업로드 중...</p>
          </>
        ) : (
          <>
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              대표 이미지를 드래그하거나 클릭하여 선택
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, WebP (최대 10MB)
            </p>
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}

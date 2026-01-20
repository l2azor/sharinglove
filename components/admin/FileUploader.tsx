'use client'

import { useCallback, useState } from 'react'
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface UploadedFile {
  filenameOriginal: string
  fileUrl: string
  fileSize: number
  mimeType?: string
  isImage: boolean
  thumbnailUrl?: string
}

interface FileUploaderProps {
  value: UploadedFile[]
  onChange: (files: UploadedFile[]) => void
  maxFiles?: number
  accept?: string
  className?: string
}

export function FileUploader({
  value = [],
  onChange,
  maxFiles = 10,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.zip,.hwp,.jpg,.jpeg,.png,.webp',
  className,
}: FileUploaderProps) {
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

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const remainingSlots = maxFiles - value.length

    if (fileArray.length > remainingSlots) {
      alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`)
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      fileArray.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '파일 업로드에 실패했습니다.')
      }

      interface ApiFile {
        filename: string
        url: string
        size: number
        mimetype: string
        isImage: boolean
        thumbnailUrl?: string
      }

      const data = await response.json()
      const uploadedFiles: UploadedFile[] = data.files.map((file: ApiFile) => ({
        filenameOriginal: file.filename,
        fileUrl: file.url,
        fileSize: file.size,
        mimeType: file.mimetype,
        isImage: file.isImage,
        thumbnailUrl: file.thumbnailUrl,
      }))

      onChange([...value, ...uploadedFiles])
    } catch (err) {
      alert(err instanceof Error ? err.message : '파일 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }, [maxFiles, value, onChange])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files)
      }
    },
    [uploadFiles]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        uploadFiles(e.target.files)
      }
      // Reset input
      e.target.value = ''
    },
    [uploadFiles]
  )

  const handleRemove = useCallback(
    (index: number) => {
      const newFiles = [...value]
      newFiles.splice(index, 1)
      onChange(newFiles)
    },
    [value, onChange]
  )

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 드롭존 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        {isUploading ? (
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-10 w-10 text-muted-foreground" />
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {isUploading
            ? '업로드 중...'
            : '파일을 여기에 드래그하거나 클릭하여 선택'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          최대 {maxFiles}개 파일, 이미지 10MB / 문서 20MB 이하
        </p>
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>

      {/* 업로드된 파일 목록 */}
      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((file, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3"
            >
              {/* 아이콘/썸네일 */}
              {file.isImage && file.thumbnailUrl ? (
                <img
                  src={file.thumbnailUrl}
                  alt={file.filenameOriginal}
                  className="h-10 w-10 rounded object-cover"
                />
              ) : file.isImage ? (
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              ) : (
                <FileText className="h-10 w-10 text-muted-foreground" />
              )}

              {/* 파일 정보 */}
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {file.filenameOriginal}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.fileSize)}
                </p>
              </div>

              {/* 삭제 버튼 */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

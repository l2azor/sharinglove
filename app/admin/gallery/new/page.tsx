'use client'

import { PostForm } from '@/components/admin/PostForm'

export default function NewGalleryPage() {
  return (
    <PostForm
      boardType="GALLERY"
      returnUrl="/admin/gallery"
      pageTitle="갤러리 작성"
    />
  )
}

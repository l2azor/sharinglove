'use client'

import { PostForm } from '@/components/admin/PostForm'

export default function NewResourcePage() {
  return (
    <PostForm
      boardType="RESOURCE"
      returnUrl="/admin/resources"
      pageTitle="자료실 작성"
    />
  )
}

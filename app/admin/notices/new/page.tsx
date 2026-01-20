'use client'

import { PostForm } from '@/components/admin/PostForm'

export default function NewNoticePage() {
  return (
    <PostForm
      boardType="NOTICE"
      returnUrl="/admin/notices"
      pageTitle="공지사항 작성"
    />
  )
}

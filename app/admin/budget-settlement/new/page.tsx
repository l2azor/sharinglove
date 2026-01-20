'use client'

import { PostForm } from '@/components/admin/PostForm'

export default function NewBudgetSettlementPage() {
  return (
    <PostForm
      boardType="BUDGET"
      returnUrl="/admin/budget-settlement"
      pageTitle="예산/결산 작성"
    />
  )
}

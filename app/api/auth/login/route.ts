import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, setAuthCookie } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = loginSchema.parse(body)

    const admin = await prisma.admin.findUnique({
      where: { username },
    })

    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    await setAuthCookie(admin.id, admin.username)

    return NextResponse.json({ success: true, username: admin.username })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

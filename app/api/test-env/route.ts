import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '설정됨' : '미설정',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '설정됨' : '미설정',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  })
}

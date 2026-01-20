import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
})

export const metadata: Metadata = {
  title: {
    default: '사랑나눔복지센터',
    template: '%s | 사랑나눔복지센터',
  },
  description: '장애인 활동지원 및 방문목욕 서비스를 제공하는 사랑나눔복지센터입니다.',
  keywords: ['사랑나눔복지센터', '장애인활동지원', '방문목욕', '천안시', '복지센터'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}

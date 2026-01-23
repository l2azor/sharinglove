import { Network } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export const metadata = {
  title: '조직도',
  description: '사랑나눔복지센터 조직 구조',
}

export default function OrgChartPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <Network className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-foreground">조직도</h1>
        <p className="text-lg text-muted-foreground">
          사랑나눔복지센터의 조직 구조
        </p>
      </div>

      {/* 조직도 이미지 */}
      <div className="mx-auto max-w-6xl">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-secondary/50 to-accent/10">
          <CardContent className="p-6">
            <div className="flex justify-center">
              <Image
                src="/images/jojik_image.jpg"
                alt="사랑나눔복지센터 조직도"
                width={1200}
                height={800}
                className="h-auto w-full rounded-lg"
                priority
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

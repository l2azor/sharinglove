import { Network, Construction } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

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

      {/* 준비중 메시지 */}
      <div className="mx-auto max-w-2xl">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-secondary/50 to-accent/10">
          <CardContent className="py-20 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20">
              <Construction className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              페이지 준비중입니다
            </h2>
            <p className="text-lg text-muted-foreground">
              보다 나은 정보를 제공하기 위해 준비하고 있습니다.
              <br />
              빠른 시일 내에 찾아뵙겠습니다.
            </p>
          </CardContent>
        </Card>

        {/* 임시 조직 정보 */}
        <div className="mt-8 rounded-2xl border border-border/40 bg-card p-6">
          <h3 className="mb-4 text-center font-bold text-foreground">
            센터 운영 정보
          </h3>
          <div className="space-y-3 text-center text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">대표:</span> 황현종
            </p>
            <p>
              <span className="font-medium text-foreground">주요 사업:</span>{' '}
              장애인활동지원, 방문목욕
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

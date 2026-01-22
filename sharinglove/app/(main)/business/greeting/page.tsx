import { Heart, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: '인사말',
  description: '사랑나눔복지센터 대표 인사말',
}

export default function GreetingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <Heart className="h-8 w-8 fill-white text-white" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-foreground">인사말</h1>
        <p className="text-lg text-muted-foreground">
          사랑나눔복지센터 대표 황현종의 인사말
        </p>
      </div>

      {/* 인사말 본문 */}
      <div className="mx-auto max-w-4xl">
        <Card className="overflow-hidden border-2 border-primary/20">
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 md:p-12">
            <div className="mb-8 flex items-center justify-center">
              <div className="rounded-full bg-white p-4 shadow-lg">
                <Quote className="h-8 w-8 text-primary" />
              </div>
            </div>

            <CardContent className="space-y-6 text-lg leading-relaxed">
              <p className="text-center text-2xl font-bold text-foreground">
                사랑나눔복지센터 홈페이지를 방문해 주신<br />
                모든 분들께 감사드립니다.
              </p>

              <div className="my-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              <p className="text-foreground/80">
                저희 사랑나눔복지센터는 2011년부터 장애인의 자립생활과 사회참여를 지원하는
                전문 복지기관으로서 한 걸음 한 걸음 성실하게 걸어왔습니다.
              </p>

              <p className="text-foreground/80">
                우리는 제도와 숫자보다 <span className="font-bold text-primary">사람의 삶을 먼저 생각</span>합니다.
                장애인 한 분 한 분의 일상생활과 사회활동을 돕는 것이 단순한 서비스 제공이 아닌,
                함께 삶을 만들어가는 동반자의 역할이라고 믿습니다.
              </p>

              <p className="text-foreground/80">
                전문적인 활동지원사와 요양보호사가 장애인의 <span className="font-bold text-primary">존엄성과 자립성을 존중</span>하며,
                일상생활 지원, 사회활동 참여, 방문목욕 등 다양한 서비스를 제공하고 있습니다.
              </p>

              <p className="text-foreground/80">
                앞으로도 저희 사랑나눔복지센터는 장애인과 그 가족의 삶의 질 향상을 위해
                더욱 노력하겠습니다. 사랑과 책임으로 함께 걸어가는 진정한 동반자가 되겠습니다.
              </p>

              <div className="my-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              <p className="text-foreground/80">
                여러분의 관심과 성원을 부탁드립니다.
              </p>

              <div className="mt-12 text-right">
                <p className="mb-2 text-xl font-bold text-foreground">
                  사랑나눔복지센터 대표
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  황현종
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* 하단 메시지 */}
        <div className="mt-8 text-center">
          <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="py-8">
              <Quote className="mx-auto mb-4 h-6 w-6 text-accent" />
              <p className="text-xl font-medium italic text-foreground/70">
                &ldquo;우리는 제도와 숫자보다 사람의 삶을 먼저 생각합니다&rdquo;
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { Heart, Target, Users, HandHeart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: '센터 소개',
  description: '사랑나눔복지센터의 비전과 사명을 소개합니다.',
}

export default function IntroPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <Heart className="h-8 w-8 fill-white text-white" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-foreground">센터 소개</h1>
        <p className="text-lg text-muted-foreground">
          사랑나눔복지센터는 장애인의 자립생활과 사회참여를 지원합니다
        </p>
      </div>

      {/* 센터 소개 */}
      <div className="mb-16 rounded-3xl bg-gradient-to-br from-secondary/50 to-accent/10 p-8 md:p-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold text-foreground">
            사랑과 책임으로 함께 걸어온 길
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-foreground/80">
            <p>
              사랑나눔복지센터는 2011년부터 장애인의 자립생활과 사회참여를 지원하는
              전문 복지기관으로서 활동해왔습니다.
            </p>
            <p>
              우리는 제도와 숫자보다 사람의 삶을 먼저 생각하며, 장애인 한 분 한 분의
              일상생활과 사회활동을 돕는 것을 최우선 가치로 삼고 있습니다.
            </p>
            <p>
              전문적인 활동지원사와 요양보호사가 함께하며, 장애인의 존엄성과
              자립성을 존중하는 서비스를 제공합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 우리의 가치 */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
          우리의 가치
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2 transition-all hover:border-primary hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <Target className="h-7 w-7 text-white" />
              </div>
              <CardTitle>사람 중심</CardTitle>
              <CardDescription>제도보다 사람의 삶을 먼저 생각합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                복지 서비스의 중심에는 항상 사람이 있어야 한다는 신념으로,
                이용자 개개인의 필요와 상황을 최우선으로 고려합니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <CardTitle>전문성</CardTitle>
              <CardDescription>전문 인력과 체계적인 서비스</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                자격을 갖춘 전문 활동지원사와 요양보호사가 체계적인 교육과
                관리를 통해 질 높은 서비스를 제공합니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <HandHeart className="h-7 w-7 text-white" />
              </div>
              <CardTitle>동반자 정신</CardTitle>
              <CardDescription>함께 걸어가는 진정한 파트너</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                단순한 서비스 제공자가 아닌, 장애인의 일상과 꿈을 함께 만들어가는
                동반자로서 책임감을 가지고 임합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 사업 범위 */}
      <div className="rounded-3xl border-2 border-primary/20 bg-card p-8 md:p-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
          주요 사업
        </h2>
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-2xl bg-secondary/30 p-6">
            <h3 className="mb-3 text-xl font-bold text-foreground">
              장애인 활동지원 서비스
            </h3>
            <p className="text-muted-foreground">
              장애인의 일상생활과 사회활동을 지원하는 핵심 서비스로,
              전문 활동지원사가 신체활동, 가사활동, 사회활동 등을 돕습니다.
            </p>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-6">
            <h3 className="mb-3 text-xl font-bold text-foreground">
              방문목욕 서비스
            </h3>
            <p className="text-muted-foreground">
              전문 장비를 갖춘 차량으로 가정을 방문하여,
              활동지원인력인 요양보호사가 안전하고 편안한 목욕 서비스를 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

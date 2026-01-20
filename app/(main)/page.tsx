import Link from 'next/link'
import { ArrowRight, Heart, Users, Home, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="w-full">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm">
              <Heart className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-medium text-primary">
                함께 걸어가는 동반자
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
              사랑과 책임으로
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                함께 걸어온 길
              </span>
            </h1>

            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              2011년부터 장애인의 자립생활과 사회참여를 지원하는
              <br className="hidden md:block" />
              사랑나눔복지센터와 함께해주세요
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="group">
                <Link href="/center/intro">
                  센터 소개 보기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/business/activity-support">
                  사업 안내
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 서비스 */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            주요 사업
          </h2>
          <p className="text-muted-foreground">
            우리는 제도와 숫자보다 사람의 삶을 먼저 생각합니다
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="group overflow-hidden border-2 transition-all hover:border-primary hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg transition-transform group-hover:scale-110">
                <Users className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl">활동보조</CardTitle>
              <CardDescription>일상생활 지원 및 사회참여 활동 보조</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                장애인의 일상생활과 사회참여를 지원하는 핵심 서비스입니다.
                전문 활동지원사가 함께합니다.
              </p>
              <Button variant="link" asChild className="p-0">
                <Link href="/business/activity-support">
                  자세히 보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border-2 transition-all hover:border-primary hover:shadow-xl">
            <CardHeader>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary shadow-lg transition-transform group-hover:scale-110">
                <Home className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl">방문목욕</CardTitle>
              <CardDescription>전문 요양보호사의 가정 방문 목욕 지원</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                활동지원인력인 요양보호사가 전문 장비를 갖춘 차량으로
                방문하여 목욕 서비스를 제공합니다.
              </p>
              <Button variant="link" asChild className="p-0">
                <Link href="/business/activity-support">
                  자세히 보기 <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 공지사항 */}
      <section className="border-t border-border/40 bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-foreground">
                공지·소식
              </h2>
              <p className="text-muted-foreground">
                센터의 최신 소식을 확인하세요
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link href="/news/notices">
                전체 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">공지사항</span>
                </div>
                <CardTitle className="text-xl">최신 공지사항</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  센터 운영 및 서비스 관련 중요한 공지사항을 확인하세요
                </p>
                <Button variant="link" asChild className="p-0">
                  <Link href="/news/notices">
                    공지사항 보기 <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium text-accent">갤러리</span>
                </div>
                <CardTitle className="text-xl">활동 사진</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  센터의 다양한 활동과 행사 사진을 만나보세요
                </p>
                <Button variant="link" asChild className="p-0">
                  <Link href="/news/gallery">
                    갤러리 보기 <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-accent p-12 text-center text-white shadow-2xl">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            함께 걸어가고 싶으신가요?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            사랑나눔복지센터는 여러분의 동반자가 되겠습니다
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/center/location">
              오시는길 안내 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

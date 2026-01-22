'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart, Users, Home, Newspaper, ChevronLeft, ChevronRight, Phone, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const heroSlides = [
  {
    id: 1,
    title: '사랑과 책임으로',
    subtitle: '함께 걸어온 길',
    description: '2011년부터 장애인의 자립생활과 사회참여를 지원하는 사랑나눔복지센터',
    gradient: 'from-amber-900/80 via-orange-800/70 to-rose-900/80',
    accentColor: 'from-amber-400 to-orange-500',
    image: '/images/hero1.jpeg',
  },
  {
    id: 2,
    title: '따뜻한 손길로',
    subtitle: '세상을 밝히다',
    description: '전문 활동지원사와 함께하는 맞춤형 돌봄 서비스',
    gradient: 'from-teal-900/80 via-emerald-800/70 to-cyan-900/80',
    accentColor: 'from-emerald-400 to-teal-500',
    image: '/images/hero2.jpeg',
  },
  {
    id: 3,
    title: '함께라서',
    subtitle: '더 행복한 내일',
    description: '모든 사람이 존엄하게 살아갈 수 있는 사회를 만들어갑니다',
    gradient: 'from-violet-900/80 via-purple-800/70 to-indigo-900/80',
    accentColor: 'from-violet-400 to-purple-500',
    image: '/images/hero3.jpeg',
  },
]

const services = [
  {
    icon: Users,
    title: '활동보조',
    description: '일상생활 지원 및 사회참여 활동 보조',
    detail: '장애인의 일상생활과 사회참여를 지원하는 핵심 서비스입니다. 전문 활동지원사가 함께합니다.',
    href: '/business/activity-support',
    color: 'from-orange-500 to-amber-500',
    hoverColor: 'group-hover:from-orange-600 group-hover:to-amber-600',
  },
  {
    icon: Home,
    title: '방문목욕',
    description: '전문 요양보호사의 가정 방문 목욕 지원',
    detail: '활동지원인력인 요양보호사가 전문 장비를 갖춘 차량으로 방문하여 목욕 서비스를 제공합니다.',
    href: '/business/activity-support',
    color: 'from-teal-500 to-emerald-500',
    hoverColor: 'group-hover:from-teal-600 group-hover:to-emerald-600',
  },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')

  const nextSlide = useCallback(() => {
    setSlideDirection('right')
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setSlideDirection('left')
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [])

  const goToSlide = (index: number) => {
    setSlideDirection(index > currentSlide ? 'right' : 'left')
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  return (
    <div className="w-full overflow-hidden">
      {/* 풀스크린 히어로 슬라이더 */}
      <section
        className="relative h-[100svh] min-h-[600px] w-full"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* 배경 이미지들 */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentSlide
                ? 'opacity-100 scale-100'
                : slideDirection === 'right'
                  ? 'opacity-0 scale-105'
                  : 'opacity-0 scale-95'
            }`}
          >
            {/* 배경 이미지 */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)',
              }}
            />
            {/* 하단 그라데이션 (텍스트 영역만) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        ))}

        {/* 히어로 콘텐츠 */}
        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`transition-all duration-700 ${
                    index === currentSlide
                      ? 'translate-y-0 opacity-100'
                      : 'pointer-events-none absolute translate-y-8 opacity-0'
                  }`}
                >
                  {/* 배지 */}
                  <div
                    className={`mb-8 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 backdrop-blur-md transition-all duration-700 delay-100 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    <Heart className="h-5 w-5 fill-white text-white animate-pulse" />
                    <span className="text-sm font-medium tracking-wide text-white">
                      함께 걸어가는 동반자
                    </span>
                  </div>

                  {/* 타이틀 */}
                  <h1
                    className={`mb-4 text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl transition-all duration-700 delay-200 drop-shadow-2xl ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 4px 30px rgba(0,0,0,0.4)' }}
                  >
                    {slide.title}
                  </h1>

                  {/* 서브타이틀 */}
                  <h2
                    className={`mb-8 text-4xl font-bold text-white md:text-5xl lg:text-6xl transition-all duration-700 delay-300 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 4px 30px rgba(0,0,0,0.4)' }}
                  >
                    {slide.subtitle}
                  </h2>

                  {/* 설명 */}
                  <p
                    className={`mb-12 max-w-2xl text-xl text-white md:text-2xl transition-all duration-700 delay-[400ms] drop-shadow-lg ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5), 0 2px 15px rgba(0,0,0,0.3)' }}
                  >
                    {slide.description}
                  </p>

                  {/* 버튼 그룹 */}
                  <div
                    className={`flex flex-col gap-4 sm:flex-row transition-all duration-700 delay-500 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    <Button
                      size="lg"
                      asChild
                      className="group relative overflow-hidden bg-white px-8 py-6 text-lg font-semibold text-gray-900 transition-all hover:scale-105 hover:shadow-2xl"
                    >
                      <Link href="/center/intro">
                        <span className="relative z-10 flex items-center">
                          센터 소개 보기
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} opacity-0 transition-opacity group-hover:opacity-100`} />
                        <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 transition-opacity group-hover:opacity-100">
                          센터 소개 보기
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="border-2 border-white/50 bg-white/10 px-8 py-6 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white hover:bg-white/20"
                    >
                      <Link href="/business/activity-support">
                        사업 안내
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 슬라이드 네비게이션 */}
        <div className="absolute bottom-32 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
          {/* 이전 버튼 */}
          <button
            onClick={prevSlide}
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="h-6 w-6 text-white transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* 인디케이터 */}
          <div className="flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-3 overflow-hidden rounded-full transition-all duration-500 ${
                  index === currentSlide ? 'w-12 bg-white' : 'w-3 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`슬라이드 ${index + 1}`}
              >
                {index === currentSlide && (
                  <div
                    className="absolute inset-y-0 left-0 bg-white/60 animate-progress"
                    style={{
                      animation: isAutoPlaying ? 'progress 5s linear' : 'none',
                      width: isAutoPlaying ? '0%' : '100%',
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* 다음 버튼 */}
          <button
            onClick={nextSlide}
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="h-6 w-6 text-white transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 right-8 z-20 hidden lg:block">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium tracking-widest text-white/70">SCROLL</span>
            <div className="h-16 w-px bg-gradient-to-b from-white/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* 퀵 정보 바 */}
      <section className="relative z-10 -mt-20 px-4">
        <div className="container mx-auto">
          <div className="grid gap-4 rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-lg md:grid-cols-3 md:p-0">
            {[
              { icon: Phone, label: '상담전화', value: '041-555-1234', color: 'text-orange-500' },
              { icon: Clock, label: '운영시간', value: '평일 09:00 - 18:00', color: 'text-teal-500' },
              { icon: MapPin, label: '위치', value: '충남 아산시 배방읍', color: 'text-violet-500' },
            ].map((item, index) => (
              <div
                key={index}
                className={`group flex items-center gap-4 p-6 transition-all hover:bg-gray-50 ${
                  index < 2 ? 'md:border-r md:border-gray-100' : ''
                }`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 transition-all group-hover:scale-110 group-hover:shadow-lg`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  <p className="text-lg font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 주요 서비스 */}
      <section className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Our Services
          </span>
          <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            주요 사업
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            우리는 제도와 숫자보다 사람의 삶을 먼저 생각합니다
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="group block"
            >
              <Card className="relative h-full overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-gray-100/50 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                {/* 배경 장식 */}
                <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br ${service.color} opacity-10 transition-all duration-500 group-hover:scale-150 group-hover:opacity-20`} />
                <div className={`absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-br ${service.color} opacity-5 transition-all duration-500 group-hover:scale-150 group-hover:opacity-10`} />

                <CardHeader className="relative">
                  <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} ${service.hoverColor} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl transition-colors group-hover:text-primary">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <p className="mb-6 text-muted-foreground">
                    {service.detail}
                  </p>
                  <div className="flex items-center font-semibold text-primary transition-all group-hover:translate-x-2">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 공지사항 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
                News & Notice
              </span>
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                공지·소식
              </h2>
              <p className="text-lg text-white/70">
                센터의 최신 소식을 확인하세요
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="border-white/30 bg-white/5 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white/50 hover:bg-white/10"
            >
              <Link href="/news/notices">
                전체 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                icon: Newspaper,
                iconColor: 'text-orange-400',
                bgGradient: 'from-orange-500/20 to-amber-500/20',
                label: '공지사항',
                title: '최신 공지사항',
                description: '센터 운영 및 서비스 관련 중요한 공지사항을 확인하세요',
                href: '/news/notices',
                linkText: '공지사항 보기'
              },
              {
                icon: Newspaper,
                iconColor: 'text-teal-400',
                bgGradient: 'from-teal-500/20 to-emerald-500/20',
                label: '갤러리',
                title: '활동 사진',
                description: '센터의 다양한 활동과 행사 사진을 만나보세요',
                href: '/news/gallery',
                linkText: '갤러리 보기'
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 bg-white/5 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl"
              >
                {/* 호버 시 배경 그라데이션 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                <CardHeader className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all group-hover:scale-110">
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                    <span className={`text-sm font-semibold ${item.iconColor}`}>
                      {item.label}
                    </span>
                  </div>
                  <CardTitle className="text-2xl text-white transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="mb-6 text-white/70">
                    {item.description}
                  </p>
                  <Button variant="link" asChild className="p-0 text-white/90 transition-all group-hover:translate-x-2">
                    <Link href={item.href}>
                      {item.linkText} <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="container mx-auto px-4 py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-orange-500 to-accent p-12 text-center shadow-2xl md:p-20">
          {/* 배경 장식 */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
          </div>

          {/* 패턴 오버레이 */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 backdrop-blur-sm">
              <Heart className="h-5 w-5 fill-white text-white" />
              <span className="text-sm font-semibold text-white">Contact Us</span>
            </div>

            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              함께 걸어가고 싶으신가요?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-white/90">
              사랑나눔복지센터는 여러분의 동반자가 되겠습니다
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="group px-8 py-6 text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl"
              >
                <Link href="/center/location">
                  오시는길 안내
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-white/50 bg-transparent px-8 py-6 text-lg font-semibold text-white transition-all hover:scale-105 hover:border-white hover:bg-white/10"
              >
                <Link href="/center/intro">
                  센터 소개
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

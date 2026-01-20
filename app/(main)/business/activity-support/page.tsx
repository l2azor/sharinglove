'use client'

import { useState } from 'react'
import { Users, Home, CheckCircle2, Clock, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ActivitySupportPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <Heart className="h-8 w-8 fill-white text-white" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-foreground">장애인활동지원</h1>
        <p className="text-lg text-muted-foreground">
          장애인의 자립생활과 사회참여를 위한 전문 서비스
        </p>
      </div>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="activity" className="mx-auto max-w-5xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activity" className="text-base">
            <Users className="mr-2 h-5 w-5" />
            활동보조
          </TabsTrigger>
          <TabsTrigger value="bath" className="text-base">
            <Home className="mr-2 h-5 w-5" />
            방문목욕
          </TabsTrigger>
        </TabsList>

        {/* 활동보조 */}
        <TabsContent value="activity" className="mt-8 space-y-8">
          {/* 서비스 소개 */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">활동보조 서비스란?</CardTitle>
              <CardDescription className="text-base">
                장애인의 일상생활과 사회활동을 지원하는 핵심 서비스
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                장애인활동지원 서비스는 혼자서 일상생활과 사회생활을 하기 어려운 장애인에게
                활동지원급여를 제공함으로써 장애인의 자립생활과 사회참여를 지원하고,
                그 가족의 부담을 줄여 장애인의 삶의 질을 높이는 제도입니다.
              </p>
            </CardContent>
          </Card>

          {/* 서비스 내용 */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">서비스 내용</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>신체활동 지원</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>개인위생 관리</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>식사 도움</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>실내 이동 지원</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>체위 변경</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>가사활동 지원</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                      <span>청소 및 주변 정돈</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                      <span>세탁</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                      <span>취사</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                      <span>생활용품 구매</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>사회활동 지원</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>외출 시 동행</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>관공서 방문 지원</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>문화/여가 활동 지원</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>이동 및 동행</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 이용 안내 */}
          <Card className="bg-gradient-to-br from-secondary/50 to-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                이용 안내
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-bold text-foreground">이용 대상</h3>
                <p className="text-muted-foreground">
                  만 6세 이상부터 만 65세 미만의 「장애인복지법」상 등록 장애인 중
                  혼자서 일상생활과 사회생활을 하기 어려운 장애인
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-bold text-foreground">신청 방법</h3>
                <p className="text-muted-foreground">
                  거주지 읍·면·동 주민센터 또는 국민연금공단 지사에 방문하여 신청
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-bold text-foreground">서비스 시간</h3>
                <p className="text-muted-foreground">
                  월~일 24시간 (이용자의 필요에 따라 탄력적 운영)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 방문목욕 */}
        <TabsContent value="bath" className="mt-8 space-y-8">
          {/* 서비스 소개 */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">방문목욕 서비스란?</CardTitle>
              <CardDescription className="text-base">
                전문 요양보호사가 가정을 방문하여 제공하는 목욕 서비스
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                활동지원인력인 요양보호사가 전문 장비를 갖춘 차량으로 가정을 방문하여
                목욕이 어려운 장애인에게 안전하고 편안한 목욕 서비스를 제공합니다.
              </p>
            </CardContent>
          </Card>

          {/* 서비스 특징 */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">서비스 특징</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>전문 장비</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    이동식 욕조, 온수 시스템 등 전문 목욕 장비를 갖춘 차량으로
                    방문하여 안전하고 위생적인 목욕 서비스를 제공합니다.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>전문 인력</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    자격을 갖춘 활동지원인력인 요양보호사 2~3명이 팀을 이루어
                    체계적이고 안전한 목욕 서비스를 제공합니다.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>가정 방문</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    이동이 불편한 장애인의 가정을 직접 방문하여 서비스를 제공하므로
                    이동의 번거로움이 없습니다.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary">
                    <Heart className="h-6 w-6 fill-white text-white" />
                  </div>
                  <CardTitle>맞춤 서비스</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    이용자의 건강 상태와 신체 특성을 고려한 맞춤형 목욕 서비스를
                    제공합니다.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 이용 안내 */}
          <Card className="bg-gradient-to-br from-secondary/50 to-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                이용 안내
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-bold text-foreground">이용 대상</h3>
                <p className="text-muted-foreground">
                  장애인활동지원 서비스 이용자 중 목욕이 필요한 장애인
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-bold text-foreground">서비스 시간</h3>
                <p className="text-muted-foreground">
                  1회 약 60~90분 소요 (이용자 상태에 따라 조정)
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-bold text-foreground">서비스 내용</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>전신 목욕 (머리 감기 포함)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>피부 관리 및 보습</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>용변 처리</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>체위 변경 및 간단한 운동</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { Heart, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-background to-secondary/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* 센터 정보 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Heart className="h-5 w-5 fill-white text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                사랑나눔복지센터
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              장애인의 자립생활과 사회참여를 지원하는 전문기관으로서
              사랑과 책임으로 함께 걸어가겠습니다.
            </p>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="font-bold text-foreground mb-4">연락처</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">주소</p>
                  <p className="text-muted-foreground leading-relaxed">
                    충남 천안시 서북구 성거읍<br />
                    천흥4길 72-7
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 대표 */}
          <div>
            <h4 className="font-bold text-foreground mb-4">운영정보</h4>
            <div className="text-sm space-y-2">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">대표:</span> 황현종
              </p>
              <p className="text-muted-foreground text-xs mt-4">
                © {new Date().getFullYear()} 사랑나눔복지센터.<br />
                All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* 하단 메시지 */}
        <div className="mt-8 pt-6 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground italic">
            &ldquo;우리는 제도와 숫자보다 사람의 삶을 먼저 생각합니다&rdquo;
          </p>
        </div>
      </div>
    </footer>
  )
}

import { MapPin, Car, Bus, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: '오시는길',
  description: '사랑나눔복지센터 찾아오시는 길 안내',
}

export default function LocationPage() {
  const address = '충남 천안시 서북구 성거읍 천흥4길 72-7'
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(address)}`
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <MapPin className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-foreground">오시는길</h1>
        <p className="text-lg text-muted-foreground">
          사랑나눔복지센터를 찾아주시는 길을 안내해드립니다
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-8">
        {/* 주소 정보 */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              주소
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-foreground">{address}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={kakaoMapUrl} target="_blank" rel="noopener noreferrer">
                  카카오맵에서 보기
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={naverMapUrl} target="_blank" rel="noopener noreferrer">
                  네이버지도에서 보기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 대중교통 이용 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Bus className="h-6 w-6 text-primary" />
              대중교통 이용
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-secondary/30 p-6">
              <h3 className="mb-3 font-bold text-foreground">버스 이용</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span>
                    천안시내버스 또는 마을버스를 이용하여 성거읍 방면으로 이동
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span>
                    성거읍사무소 정류장 하차 후 도보 약 10분
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground">
              * 정확한 버스 노선 및 배차 정보는 카카오맵 또는 네이버지도 앱에서 확인하실 수 있습니다.
            </p>
          </CardContent>
        </Card>

        {/* 자가용 이용 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Car className="h-6 w-6 text-primary" />
              자가용 이용
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-secondary/30 p-6">
              <h3 className="mb-3 font-bold text-foreground">천안IC 방면</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                  <span>
                    천안IC → 천안시 방면 → 성거읍 방향 → 천흥4길
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-secondary/30 p-6">
              <h3 className="mb-3 font-bold text-foreground">천안시내 방면</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                  <span>
                    천안시내 → 성거읍 방향 → 천흥4길 72-7
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-4">
              <p className="text-sm font-medium text-foreground">
                💡 주차 안내: 센터 앞 주차 공간을 이용하실 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 연락처 */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-primary" />
              문의
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              오시는 길에 대한 자세한 문의는 센터로 연락 주시기 바랍니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

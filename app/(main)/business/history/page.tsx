import { Calendar, Award } from 'lucide-react'

export const metadata = {
  title: '연혁',
  description: '사랑나눔복지센터의 성장 과정과 주요 연혁',
}

interface HistoryItem {
  year: string
  events: {
    date: string
    title: string
  }[]
}

const historyData: HistoryItem[] = [
  {
    year: '2025',
    events: [
      { date: '2025', title: '현재까지 장애인 활동지원 서비스 지속 제공' },
    ],
  },
  {
    year: '2011',
    events: [
      { date: '2011', title: '사랑나눔복지센터 설립' },
      { date: '2011', title: '장애인활동지원사업 개시' },
      { date: '2011', title: '방문목욕 서비스 시작' },
    ],
  },
  {
    year: '2008',
    events: [
      { date: '2008', title: '황현종 대표 복지사업 준비 시작' },
    ],
  },
]

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <Calendar className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-foreground">연혁</h1>
        <p className="text-lg text-muted-foreground">
          사랑나눔복지센터가 걸어온 길
        </p>
      </div>

      {/* 타임라인 */}
      <div className="mx-auto max-w-4xl">
        <div className="relative">
          {/* 타임라인 라인 */}
          <div className="absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary/20 md:left-1/2 md:-ml-0.5" />

          <div className="space-y-12">
            {historyData.map((item, index) => (
              <div
                key={item.year}
                className={`relative ${
                  index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'
                }`}
              >
                {/* 연도 표시 */}
                <div className="mb-6 flex items-center gap-4 md:absolute md:left-1/2 md:top-0 md:-ml-16 md:w-32 md:justify-center">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-xl">
                    <span className="text-xl font-bold text-white">
                      {item.year}
                    </span>
                  </div>
                </div>

                {/* 이벤트 카드 */}
                <div
                  className={`ml-16 md:ml-0 ${
                    index % 2 === 0 ? 'md:pr-20' : 'md:pl-20'
                  }`}
                >
                  <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg transition-all hover:border-primary hover:shadow-xl">
                    <div className="mb-2 flex items-center gap-2">
                      <Award className="h-5 w-5 text-accent" />
                      <span className="font-bold text-primary">
                        {item.year}년
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {item.events.map((event, eventIndex) => (
                        <li
                          key={eventIndex}
                          className="flex items-start gap-3"
                        >
                          <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">
                              {event.date}
                            </span>
                            <p className="text-foreground">{event.title}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 연결점 */}
                <div className="absolute left-8 top-8 h-4 w-4 rounded-full border-4 border-background bg-primary shadow-lg md:left-1/2 md:-ml-2" />
              </div>
            ))}
          </div>
        </div>

        {/* 하단 메시지 */}
        <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 text-center">
          <p className="text-lg font-medium text-foreground/80">
            2008년 준비를 시작하여 2011년 설립 이후,
            <br />
            <span className="font-bold text-primary">
              사랑과 책임으로 장애인과 함께 걸어온
            </span>
            <br />
            사랑나눔복지센터의 발자취입니다.
          </p>
        </div>
      </div>
    </div>
  )
}

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('데이터베이스 시딩 시작...')

  // 공지사항 3개 추가 (1개는 고정)
  const notice1 = await prisma.post.create({
    data: {
      boardType: 'NOTICE',
      title: '[공지] 사랑나눔복지센터 홈페이지를 방문해주셔서 감사합니다',
      content: '<p>안녕하세요. 사랑나눔복지센터 홈페이지를 방문해주셔서 감사합니다.</p><p>저희 센터는 2011년부터 장애인의 자립생활과 사회참여를 지원하는 전문 복지기관으로서 활동해왔습니다.</p>',
      isPublished: true,
      isPinned: true,
      views: 150,
    },
  })

  const notice2 = await prisma.post.create({
    data: {
      boardType: 'NOTICE',
      title: '2025년 설 연휴 운영 안내',
      content: '<p>2025년 설 연휴 기간 센터 운영 안내입니다.</p><p>1월 28일(화)부터 1월 30일(목)까지 휴무입니다.</p>',
      isPublished: true,
      isPinned: false,
      views: 89,
    },
  })

  const notice3 = await prisma.post.create({
    data: {
      boardType: 'NOTICE',
      title: '활동지원사 교육 일정 안내',
      content: '<p>2025년 상반기 활동지원사 교육 일정을 안내드립니다.</p><p>교육 참가를 희망하시는 분은 센터로 연락주시기 바랍니다.</p>',
      isPublished: true,
      isPinned: false,
      views: 67,
    },
  })

  console.log('공지사항 3개 생성 완료')

  // 예산/결산 2개 추가
  const budget1 = await prisma.post.create({
    data: {
      boardType: 'BUDGET',
      title: '2024년 결산서 공개',
      content: '<p>2024년 사랑나눔복지센터 결산서를 공개합니다.</p><p>투명한 재정 운영을 위해 노력하겠습니다.</p>',
      isPublished: true,
      year: 2024,
      budgetType: 'SETTLEMENT',
      views: 234,
    },
  })

  const budget2 = await prisma.post.create({
    data: {
      boardType: 'BUDGET',
      title: '2025년 예산안',
      content: '<p>2025년 사랑나눔복지센터 예산안입니다.</p>',
      isPublished: true,
      year: 2025,
      budgetType: 'BUDGET',
      views: 178,
    },
  })

  console.log('예산/결산 2개 생성 완료')

  // 자료실 2개 추가
  const resource1 = await prisma.post.create({
    data: {
      boardType: 'RESOURCE',
      title: '장애인활동지원 서비스 이용 안내',
      content: '<p>장애인활동지원 서비스 이용 방법에 대한 안내 자료입니다.</p>',
      isPublished: true,
      views: 445,
    },
  })

  const resource2 = await prisma.post.create({
    data: {
      boardType: 'RESOURCE',
      title: '방문목욕 서비스 신청서',
      content: '<p>방문목욕 서비스 신청서 양식입니다.</p>',
      isPublished: true,
      views: 312,
    },
  })

  console.log('자료실 2개 생성 완료')

  // 갤러리 2개 추가 (썸네일 없이)
  const gallery1 = await prisma.post.create({
    data: {
      boardType: 'GALLERY',
      title: '2024년 가을 나들이 행사',
      content: '<p>2024년 가을 나들이 행사 사진입니다.</p>',
      isPublished: true,
      views: 523,
    },
  })

  const gallery2 = await prisma.post.create({
    data: {
      boardType: 'GALLERY',
      title: '센터 시설 소개',
      content: '<p>사랑나눔복지센터 시설을 소개합니다.</p>',
      isPublished: true,
      views: 389,
    },
  })

  console.log('갤러리 2개 생성 완료')

  console.log('✅ 시딩 완료!')
  console.log(`- 공지사항: 3개`)
  console.log(`- 예산/결산: 2개`)
  console.log(`- 자료실: 2개`)
  console.log(`- 갤러리: 2개`)
}

main()
  .catch((e) => {
    console.error('시딩 중 오류 발생:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

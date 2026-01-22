import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// 환경 변수 로드
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function setupStorage() {
  console.log('Supabase Storage 버킷 설정 중...\n')

  // 이미지 버킷 생성
  const { data: imagesBucket, error: imagesError } = await supabase.storage
    .createBucket('images', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    })

  if (imagesError && imagesError.message !== 'Bucket already exists') {
    console.error('이미지 버킷 생성 실패:', imagesError)
  } else {
    console.log('✅ images 버킷 준비 완료')
  }

  // 문서 버킷 생성
  const { data: documentsBucket, error: documentsError } = await supabase.storage
    .createBucket('documents', {
      public: true,
      fileSizeLimit: 20971520, // 20MB
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip',
      ],
    })

  if (documentsError && documentsError.message !== 'Bucket already exists') {
    console.error('문서 버킷 생성 실패:', documentsError)
  } else {
    console.log('✅ documents 버킷 준비 완료')
  }

  // 버킷 목록 확인
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('버킷 목록 조회 실패:', listError)
  } else {
    console.log('\n현재 버킷 목록:')
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (공개: ${bucket.public})`)
    })
  }

  console.log('\n✅ Supabase Storage 설정 완료!')
}

setupStorage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('오류 발생:', error)
    process.exit(1)
  })

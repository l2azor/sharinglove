# 사랑나눔복지센터 홈페이지

사랑나눔복지센터의 공식 홈페이지입니다. 장애인활동지원 및 방문목욕 서비스를 제공하는 복지기관의 온라인 플랫폼으로, 센터 소개, 사업 안내, 게시판 기능을 제공합니다.

## 🚀 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Sharp (이미지 처리)

## 📁 프로젝트 구조

```
sharinglove/
├── app/
│   ├── (main)/              # 프론트엔드 페이지
│   │   ├── page.tsx         # 홈페이지
│   │   ├── center/          # 센터 소개, 오시는길
│   │   ├── business/        # 사업소개 (활동지원, 인사말, 연혁, 조직도)
│   │   └── news/            # 게시판 (공지사항, 예산/결산, 자료실, 갤러리)
│   ├── admin/               # 관리자 페이지
│   └── api/                 # API Routes
├── components/
│   ├── ui/                  # shadcn/ui 컴포넌트
│   ├── layout/              # 헤더, 푸터, 네비게이션
│   └── board/               # 게시판 컴포넌트
├── lib/                     # 유틸리티 함수
├── prisma/                  # 데이터베이스 스키마 및 시드
└── public/uploads/          # 파일 저장소
```

## 🛠️ 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/l2azor/sharinglove.git
cd sharinglove
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# 데이터베이스 연결 URL
DATABASE_URL="postgresql://username:password@localhost:5432/sharinglove?schema=public"

# JWT 시크릿 키 (랜덤 문자열)
JWT_SECRET="your-secret-key-here"
```

### 4. 데이터베이스 설정

```bash
# Prisma 마이그레이션 실행
npx prisma migrate deploy

# 관리자 계정 생성
npx tsx prisma/seed.ts

# 테스트 게시글 생성 (선택사항)
npx tsx prisma/seed-posts.ts
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 👤 기본 관리자 계정

- **아이디**: `admin`
- **비밀번호**: `admin1234`

관리자 페이지: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 📄 구현된 페이지

### 프론트엔드 (11개)

#### 센터 소개 (2개)
- ✅ 센터 소개 (`/center/intro`)
- ✅ 오시는길 (`/center/location`)

#### 사업소개 (4개)
- ✅ 장애인활동지원 (`/business/activity-support`)
- ✅ 인사말 (`/business/greeting`)
- ✅ 연혁 (`/business/history`)
- ✅ 조직도 (`/business/org-chart`)

#### 게시판 (4종 × 2페이지 = 8개)
- ✅ 공지사항 목록/상세 (`/news/notices`)
- ✅ 예산/결산 목록/상세 (`/news/budget-settlement`)
- ✅ 자료실 목록/상세 (`/news/resources`)
- ✅ 갤러리 목록/상세 (`/news/gallery`)

### 관리자 (5개)
- ✅ 로그인 (`/admin/login`)
- ✅ 공지사항 관리 (`/admin/notices`)
- 🚧 예산/결산 관리 (`/admin/budget-settlement`) - 목록만 구현
- 🚧 자료실 관리 (`/admin/resources`) - 목록만 구현
- 🚧 갤러리 관리 (`/admin/gallery`) - 목록만 구현

## 🔑 주요 기능

### 인증 시스템
- JWT 기반 관리자 인증
- HttpOnly 쿠키를 통한 토큰 저장
- Middleware로 관리자 페이지 보호

### 게시판 시스템
- **공지사항**: 상단 고정 기능 (최대 3개)
- **예산/결산**: 연도 및 구분(예산/결산) 필터
- **자료실**: 다중 첨부파일 지원
- **갤러리**: 이미지 썸네일 자동 생성, 그리드 레이아웃

### 파일 업로드
- 이미지: jpg/png/webp (최대 10MB)
- 문서: pdf/doc/docx/xls/xlsx/hwp/zip (최대 20MB)
- Sharp를 이용한 이미지 썸네일 자동 생성
- 최대 10개 파일/게시물

## 🎨 디자인

- **컬러**: 따뜻한 오렌지-레드 (Primary), 골드 악센트 (Accent)
- **폰트**: Noto Sans KR
- **반응형**: 모바일/태블릿/데스크톱 지원
- **접근성**: 44px 터치 영역, 높은 대비

## 📊 데이터베이스 스키마

### Admin (관리자)
- id, username, passwordHash, createdAt, updatedAt

### Post (게시글)
- id, boardType (NOTICE/BUDGET/RESOURCE/GALLERY)
- title, content, isPublished, views
- isPinned (공지사항), year, budgetType (예산/결산)
- thumbnailUrl (갤러리), createdAt, updatedAt

### Attachment (첨부파일)
- id, postId, filenameOriginal, fileUrl
- fileSize, isImage, displayOrder

## 🚧 추가 구현 필요 사항

### 우선순위 높음
1. **관리자 게시글 등록/수정 폼**
   - WYSIWYG 에디터 (react-quill)
   - 파일 업로드 UI
   - 이미지 미리보기

2. **나머지 관리자 페이지**
   - 예산/결산 관리 (등록/수정 페이지)
   - 자료실 관리 (등록/수정 페이지)
   - 갤러리 관리 (등록/수정 페이지)

### 우선순위 중간
3. **페이지네이션 동작 구현**
4. **검색 기능 구현**
5. **필터 기능 구현** (예산/결산 연도/구분)

### 우선순위 낮음
6. **SEO 최적화** (sitemap.xml, robots.txt)
7. **이미지 최적화** (WebP 포맷)
8. **관리자 비밀번호 변경 기능**

## 🔧 주요 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start

# Prisma Studio 실행 (DB GUI)
npx prisma studio

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 타입 체크
npm run type-check
```

## 📝 환경별 설정

### 개발 환경
- JWT 토큰: HttpOnly 쿠키 (secure: false)
- 데이터베이스: 로컬 PostgreSQL

### 프로덕션 환경
- JWT 토큰: HttpOnly 쿠키 (secure: true)
- 데이터베이스: 프로덕션 PostgreSQL
- 환경 변수 설정 필수

## 📚 참고 문서

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 라이선스

Copyright © 2025 사랑나눔복지센터. All rights reserved.

---

## 🤝 기여자

이 프로젝트는 Claude Sonnet 4.5와 함께 개발되었습니다.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

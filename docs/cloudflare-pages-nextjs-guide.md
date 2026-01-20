# Cloudflare Pages + Next.js + PostgreSQL 배포 가이드

## 개요
Next.js 풀스택 앱을 Cloudflare Pages에 배포할 때 발생하는 문제들과 해결 방법을 정리합니다.

---

## 핵심 제약사항

Cloudflare Pages는 **Edge Runtime**을 사용하므로 Node.js 전용 모듈이 작동하지 않습니다.

### 사용 불가 모듈
- `bcryptjs`, `bcrypt` - 비밀번호 해싱
- `jose` - JWT 라이브러리 (async_hooks 의존)
- `jsonwebtoken` - JWT 라이브러리
- `next/font/google` - 폰트 로딩 (일부 환경에서 문제)
- `crypto` (Node.js 내장) - 일부 기능
- `async_hooks` - Next.js middleware에서 간접 사용

---

## 필수 설정

### 1. 패키지 설치

```bash
npm install @cloudflare/next-on-pages wrangler @neondatabase/serverless @prisma/adapter-neon
```

### 2. wrangler.toml 생성

```toml
name = "프로젝트명"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

### 3. package.json 스크립트 추가

```json
{
  "scripts": {
    "pages:build": "npx @cloudflare/next-on-pages",
    "pages:deploy": "wrangler pages deploy .vercel/output/static"
  }
}
```

---

## Edge Runtime 호환 코드

### 비밀번호 해싱 (bcryptjs 대체)

```typescript
// lib/auth.ts
async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  return crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  )
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const derivedKey = await deriveKey(password, salt)
  const saltBase64 = arrayBufferToBase64(salt.buffer as ArrayBuffer)
  const hashBase64 = arrayBufferToBase64(derivedKey)
  return `${saltBase64}:${hashBase64}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [saltBase64, storedHashBase64] = hash.split(':')
    if (!saltBase64 || !storedHashBase64) return false

    const salt = base64ToArrayBuffer(saltBase64)
    const derivedKey = await deriveKey(password, salt)
    const derivedHashBase64 = arrayBufferToBase64(derivedKey)

    return derivedHashBase64 === storedHashBase64
  } catch {
    return false
  }
}
```

### JWT 토큰 (jose 대체)

```typescript
// lib/auth.ts
function base64UrlEncode(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(data: string): string {
  const padded = data + '==='.slice(0, (4 - (data.length % 4)) % 4)
  return atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
}

async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  const bytes = new Uint8Array(signature)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return base64UrlEncode(binary)
}

export async function generateToken(payload: object): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 60 * 60 * 24 * 7 // 7일

  const fullPayload = { ...payload, exp, iat: now }

  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload))
  const signature = await createSignature(`${headerB64}.${payloadB64}`, JWT_SECRET)

  return `${headerB64}.${payloadB64}.${signature}`
}

export async function verifyToken(token: string): Promise<object | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerB64, payloadB64, signatureB64] = parts

    const expectedSignature = await createSignature(`${headerB64}.${payloadB64}`, JWT_SECRET)
    if (signatureB64 !== expectedSignature) return null

    const payload = JSON.parse(base64UrlDecode(payloadB64))

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
```

### Prisma + Neon 설정

```typescript
// lib/prisma.ts
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  // @ts-expect-error - Type compatibility issue
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 폰트 로딩 (next/font 대체)

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

```typescript
// tailwind.config.ts
fontFamily: {
  sans: ['"Noto Sans KR"', 'system-ui', 'sans-serif'],
},
```

---

## Middleware 주의사항

**Cloudflare Pages에서 Next.js middleware는 사용하지 마세요!**

middleware가 `async_hooks` 모듈을 간접적으로 사용하여 에러 발생:
```
Error: No such module "__next-on-pages-dist__/functions/async_hooks"
```

### 대안
- 클라이언트 사이드에서 인증 체크 후 리다이렉트
- API 라우트에서 토큰 검증

---

## API 라우트 설정

모든 동적 API 라우트에 Edge Runtime 설정 추가:

```typescript
// app/api/*/route.ts
export const runtime = 'edge'
```

---

## Cloudflare Pages 설정

### 환경 변수
- `DATABASE_URL` - Neon PostgreSQL 연결 문자열
- `JWT_SECRET` - JWT 서명용 시크릿

### 빌드 설정
- Framework preset: Next.js
- Build command: `npx @cloudflare/next-on-pages`
- Build output directory: `.vercel/output/static`

---

## 파일 업로드

Cloudflare Pages는 정적 호스팅이므로 파일 저장 불가.

### 권장 솔루션: Cloudflare R2
- S3 호환 객체 스토리지
- 무료: 10GB 저장, 월 1천만 읽기

```typescript
// app/api/upload/route.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const runtime = 'edge'

const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  const buffer = await file.arrayBuffer()
  const key = `uploads/${Date.now()}-${file.name}`

  await S3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: new Uint8Array(buffer),
    ContentType: file.type,
  }))

  return Response.json({ url: `${process.env.R2_PUBLIC_URL}/${key}` })
}
```

---

## 대안 플랫폼 비교

| 플랫폼 | 장점 | 단점 |
|--------|------|------|
| **Cloudflare Pages** | 빠름, 무료 넉넉 | Edge Runtime 제약 많음 |
| **Vercel** | Next.js 완벽 호환 | 파일 스토리지 별도 |
| **Railway** | 올인원 | 무료 티어 제한적 |

### 추천 조합
- **편의성 최우선**: Vercel + Supabase (DB + Storage 통합)
- **무료 최대화**: Cloudflare Pages + Neon + R2

---

## 트러블슈팅

### 500 Internal Server Error
1. Cloudflare 대시보드 > Functions > Logs 확인
2. `async_hooks` 에러 → middleware 제거
3. `bcrypt` 에러 → Web Crypto API로 대체

### 빌드 실패
1. `export const runtime = 'edge'` 모든 동적 라우트에 추가
2. Node.js 전용 모듈 사용 여부 확인

### DB 연결 실패
1. `DATABASE_URL` 환경 변수 확인
2. Neon adapter 사용 여부 확인

---

## 체크리스트

- [ ] `@cloudflare/next-on-pages` 설치
- [ ] `wrangler.toml` 생성
- [ ] Prisma Neon adapter 설정
- [ ] bcryptjs → Web Crypto API
- [ ] jose/jsonwebtoken → 직접 구현
- [ ] next/font → Google Fonts CDN
- [ ] middleware.ts 제거
- [ ] 모든 API 라우트에 `export const runtime = 'edge'`
- [ ] 환경 변수 설정 (DATABASE_URL, JWT_SECRET)

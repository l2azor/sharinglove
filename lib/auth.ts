import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const TOKEN_NAME = 'admin-token'

export interface JwtPayload {
  adminId: string
  username: string
  exp?: number
  [key: string]: unknown
}

// Base64URL 인코딩/디코딩
function base64UrlEncode(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(data: string): string {
  const padded = data + '==='.slice(0, (4 - (data.length % 4)) % 4)
  return atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
}

// HMAC-SHA256 서명 생성
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

// JWT 생성 (Web Crypto API)
export async function generateToken(payload: Omit<JwtPayload, 'exp'>): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 60 * 60 * 24 * 7 // 7일

  const fullPayload = { ...payload, exp, iat: now }

  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload))
  const signature = await createSignature(`${headerB64}.${payloadB64}`, JWT_SECRET)

  return `${headerB64}.${payloadB64}.${signature}`
}

// JWT 검증 (Web Crypto API)
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerB64, payloadB64, signatureB64] = parts

    // 서명 검증
    const expectedSignature = await createSignature(`${headerB64}.${payloadB64}`, JWT_SECRET)
    if (signatureB64 !== expectedSignature) return null

    // 페이로드 파싱
    const payload = JSON.parse(base64UrlDecode(payloadB64)) as JwtPayload

    // 만료 확인
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

// Edge Runtime 호환 비밀번호 해싱 (Web Crypto API 사용)
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

export async function setAuthCookie(adminId: string, username: string) {
  const token = await generateToken({ adminId, username })
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_NAME)
}

export async function getAuthUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAuth(): Promise<JwtPayload> {
  const user = await getAuthUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

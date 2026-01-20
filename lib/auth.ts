import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret'
)
const TOKEN_NAME = 'admin-token'

export interface JwtPayload {
  adminId: string
  username: string
  [key: string]: unknown
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

export async function generateToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JwtPayload
  } catch {
    return null
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

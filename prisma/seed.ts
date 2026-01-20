import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { webcrypto } from 'crypto'

const prisma = new PrismaClient()

// Edge Runtime 호환 비밀번호 해싱 (Web Crypto API 사용)
async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const encoder = new TextEncoder()
  const keyMaterial = await webcrypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  return webcrypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
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
  return Buffer.from(binary, 'binary').toString('base64')
}

async function hashPassword(password: string): Promise<string> {
  const salt = webcrypto.getRandomValues(new Uint8Array(16))
  const derivedKey = await deriveKey(password, salt)
  const saltBase64 = arrayBufferToBase64(salt.buffer as ArrayBuffer)
  const hashBase64 = arrayBufferToBase64(derivedKey)
  return `${saltBase64}:${hashBase64}`
}

async function main() {
  console.log('Start seeding ...')

  // 기본 관리자 계정 생성
  const hashedPassword = await hashPassword('admin1234')

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      username: 'admin',
      passwordHash: hashedPassword,
    },
  })

  console.log(`✅ Created admin user: ${admin.username}`)
  console.log('   Username: admin')
  console.log('   Password: admin1234')
  console.log('\nSeeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

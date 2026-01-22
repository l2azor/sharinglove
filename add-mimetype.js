const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Attachment" ADD COLUMN IF NOT EXISTS "mimeType" TEXT;
    `)
    console.log('✅ Added mimeType column to Attachment table')
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()

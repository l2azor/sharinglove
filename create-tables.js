const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Creating tables in Supabase...')

  try {
    // Create tables using raw SQL
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Admin" (
        "id" TEXT PRIMARY KEY,
        "username" TEXT NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('✅ Created Admin table')

    await prisma.$executeRawUnsafe(`
      CREATE TYPE "BoardType" AS ENUM ('NOTICE', 'BUDGET', 'RESOURCE', 'GALLERY');
    `)
    console.log('✅ Created BoardType enum')

    await prisma.$executeRawUnsafe(`
      CREATE TYPE "BudgetType" AS ENUM ('BUDGET', 'SETTLEMENT');
    `)
    console.log('✅ Created BudgetType enum')

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Post" (
        "id" TEXT PRIMARY KEY,
        "boardType" "BoardType" NOT NULL,
        "title" VARCHAR(100) NOT NULL,
        "content" TEXT,
        "isPublished" BOOLEAN NOT NULL DEFAULT true,
        "views" INTEGER NOT NULL DEFAULT 0,
        "isPinned" BOOLEAN DEFAULT false,
        "year" INTEGER,
        "budgetType" "BudgetType",
        "thumbnailUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('✅ Created Post table')

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Attachment" (
        "id" TEXT PRIMARY KEY,
        "postId" TEXT NOT NULL,
        "filenameOriginal" TEXT NOT NULL,
        "fileUrl" TEXT NOT NULL,
        "fileSize" INTEGER,
        "isImage" BOOLEAN NOT NULL DEFAULT false,
        "displayOrder" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "Attachment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)
    console.log('✅ Created Attachment table')

    console.log('\n✅ All tables created successfully!')
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Tables already exist, skipping creation')
    } else {
      console.error('❌ Error creating tables:', error.message)
      throw error
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()

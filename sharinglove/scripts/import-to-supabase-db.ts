#!/usr/bin/env tsx
/**
 * Import data to Supabase PostgreSQL database
 * Run: npx tsx scripts/import-to-supabase-db.ts
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import type { MigrationData } from './migration-types'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Ensure we're using Supabase database URL
if (!process.env.DATABASE_URL?.includes('supabase')) {
  console.warn('⚠️  Warning: DATABASE_URL does not appear to be a Supabase connection string')
  console.warn('   Please verify you are importing to the correct database')
}

const prisma = new PrismaClient()

async function importToSupabase() {
  console.log('🔄 Starting data import to Supabase...')

  // Read exported data
  const dataPath = path.join(process.cwd(), 'migration-backup', 'data.json')
  if (!fs.existsSync(dataPath)) {
    throw new Error('data.json not found. Run export-from-neon.ts first.')
  }

  const migrationData: MigrationData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  // Read URL mapping
  const urlMappingPath = path.join(process.cwd(), 'migration-backup', 'url-mapping.json')
  if (!fs.existsSync(urlMappingPath)) {
    throw new Error('url-mapping.json not found. Run upload-to-supabase.ts first.')
  }

  const urlMapping: Record<string, string> = JSON.parse(fs.readFileSync(urlMappingPath, 'utf-8'))

  try {
    // Clear existing data (optional - be careful!)
    console.log('🗑️  Clearing existing posts and attachments...')
    await prisma.attachment.deleteMany({})
    await prisma.post.deleteMany({})

    // Import admin accounts (preserve IDs and passwords)
    console.log('👤 Importing admin accounts...')
    for (const admin of migrationData.admins) {
      await prisma.admin.upsert({
        where: { username: admin.username },
        update: {},
        create: {
          id: admin.id,
          username: admin.username,
          passwordHash: admin.passwordHash,
          createdAt: new Date(admin.createdAt),
        },
      })
    }
    console.log(`✅ Imported ${migrationData.admins.length} admin account(s)`)

    // Import posts with new file URLs
    console.log('📦 Importing posts and attachments...')
    let postCount = 0
    let attachmentCount = 0

    for (const post of migrationData.posts) {
      // Update thumbnail URL if exists
      const thumbnailUrl = post.thumbnailUrl
        ? urlMapping[post.thumbnailUrl] || post.thumbnailUrl
        : null

      // Create post
      await prisma.post.create({
        data: {
          id: post.id,
          boardType: post.boardType as any,
          title: post.title,
          content: post.content,
          isPublished: post.isPublished,
          isPinned: post.isPinned,
          views: post.views,
          year: post.year,
          budgetType: post.budgetType as any,
          thumbnailUrl,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          attachments: {
            create: post.attachments.map((att) => ({
              id: att.id,
              filenameOriginal: att.filenameOriginal,
              fileUrl: urlMapping[att.fileUrl] || att.fileUrl, // Use new URL
              fileSize: att.fileSize,
              isImage: att.isImage,
              displayOrder: att.displayOrder,
              createdAt: new Date(att.createdAt),
            })),
          },
        },
      })

      postCount++
      attachmentCount += post.attachments.length

      if (postCount % 10 === 0) {
        console.log(`   Progress: ${postCount}/${migrationData.posts.length} posts`)
      }
    }

    console.log(`✅ Imported ${postCount} posts`)
    console.log(`✅ Imported ${attachmentCount} attachments`)

    // Verify import
    console.log('\n🔍 Verifying import...')
    const verifyPosts = await prisma.post.count()
    const verifyAttachments = await prisma.attachment.count()
    const verifyAdmins = await prisma.admin.count()

    console.log(`   Posts: ${verifyPosts} (expected: ${migrationData.posts.length})`)
    console.log(`   Attachments: ${verifyAttachments}`)
    console.log(`   Admins: ${verifyAdmins} (expected: ${migrationData.admins.length})`)

    // Check for unmapped URLs (files that weren't uploaded)
    const unmappedUrls = new Set<string>()
    migrationData.posts.forEach((post) => {
      post.attachments.forEach((att) => {
        if (!urlMapping[att.fileUrl]) {
          unmappedUrls.add(att.fileUrl)
        }
      })
      if (post.thumbnailUrl && !urlMapping[post.thumbnailUrl]) {
        unmappedUrls.add(post.thumbnailUrl)
      }
    })

    if (unmappedUrls.size > 0) {
      console.warn('\n⚠️  Warning: Some file URLs were not mapped to new Supabase URLs:')
      Array.from(unmappedUrls).slice(0, 10).forEach((url) => {
        console.warn(`   - ${url}`)
      })
      if (unmappedUrls.size > 10) {
        console.warn(`   ... and ${unmappedUrls.size - 10} more`)
      }
    }

    console.log('\n📊 Import summary by board type:')
    const boardCounts = await prisma.post.groupBy({
      by: ['boardType'],
      _count: true,
    })
    boardCounts.forEach(({ boardType, _count }) => {
      console.log(`   ${boardType}: ${_count}`)
    })
  } catch (error) {
    console.error('❌ Import failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

importToSupabase()
  .then(() => {
    console.log('\n✨ Import completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  })

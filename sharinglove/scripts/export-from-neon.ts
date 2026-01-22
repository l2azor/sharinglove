#!/usr/bin/env tsx
/**
 * Export data from Neon PostgreSQL database
 * Run: npx tsx scripts/export-from-neon.ts
 */

import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import type { MigrationData } from './migration-types'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

async function exportFromNeon() {
  console.log('🔄 Starting data export from Neon...')

  // Create Neon Prisma client
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  // @ts-expect-error - Type compatibility issue
  const adapter = new PrismaNeon(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    // Export all posts with attachments
    console.log('📦 Exporting posts and attachments...')
    const posts = await prisma.post.findMany({
      include: {
        attachments: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Export admin accounts
    console.log('👤 Exporting admin accounts...')
    const admins = await prisma.admin.findMany()

    const migrationData: MigrationData = {
      posts,
      admins,
      exportedAt: new Date(),
    }

    // Save to JSON file
    const outputPath = path.join(process.cwd(), 'migration-backup', 'data.json')
    fs.writeFileSync(outputPath, JSON.stringify(migrationData, null, 2), 'utf-8')

    console.log(`✅ Data exported successfully!`)
    console.log(`   Posts: ${posts.length}`)
    console.log(`   Attachments: ${posts.reduce((acc, p) => acc + p.attachments.length, 0)}`)
    console.log(`   Admins: ${admins.length}`)
    console.log(`   File: ${outputPath}`)

    // Print board type breakdown
    const boardCounts = posts.reduce((acc, post) => {
      acc[post.boardType] = (acc[post.boardType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('\n📊 Posts by board type:')
    Object.entries(boardCounts).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`)
    })
  } catch (error) {
    console.error('❌ Export failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

exportFromNeon()
  .then(() => {
    console.log('\n✨ Export completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Export failed:', error)
    process.exit(1)
  })

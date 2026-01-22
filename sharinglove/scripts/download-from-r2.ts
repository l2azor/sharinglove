#!/usr/bin/env tsx
/**
 * Download all files from Cloudflare R2 storage
 * Run: npx tsx scripts/download-from-r2.ts
 */

import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import type { MigrationData } from './migration-types'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

async function downloadFromR2() {
  console.log('🔄 Starting file download from R2...')

  // Read exported data to get list of files
  const dataPath = path.join(process.cwd(), 'migration-backup', 'data.json')
  if (!fs.existsSync(dataPath)) {
    throw new Error('data.json not found. Run export-from-neon.ts first.')
  }

  const migrationData: MigrationData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  // Collect all file URLs from attachments
  const fileUrls = new Set<string>()
  migrationData.posts.forEach((post) => {
    post.attachments.forEach((att) => {
      fileUrls.add(att.fileUrl)
    })
    if (post.thumbnailUrl) {
      fileUrls.add(post.thumbnailUrl)
    }
  })

  console.log(`📦 Found ${fileUrls.size} files to download`)

  const filesDir = path.join(process.cwd(), 'migration-backup', 'files')
  let downloadedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const fileUrl of fileUrls) {
    try {
      // Extract key from URL
      // URL format: https://[domain]/uploads/[filename]
      const urlParts = fileUrl.split('/uploads/')
      if (urlParts.length < 2) {
        console.warn(`⚠️  Invalid URL format: ${fileUrl}`)
        errorCount++
        continue
      }

      const fileName = urlParts[1]
      const key = `uploads/${fileName}`
      const localPath = path.join(filesDir, fileName)

      // Skip if already downloaded
      if (fs.existsSync(localPath)) {
        console.log(`⏭️  Skipping (already exists): ${fileName}`)
        skippedCount++
        continue
      }

      // Download from R2
      console.log(`⬇️  Downloading: ${fileName}`)
      const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      })

      const response = await S3.send(command)
      const bodyBytes = await response.Body?.transformToByteArray()

      if (!bodyBytes) {
        throw new Error('Empty response body')
      }

      // Save to local file
      fs.writeFileSync(localPath, bodyBytes)
      downloadedCount++
      console.log(`✅ Downloaded: ${fileName} (${bodyBytes.length} bytes)`)
    } catch (error) {
      console.error(`❌ Failed to download ${fileUrl}:`, error)
      errorCount++
    }
  }

  console.log('\n📊 Download summary:')
  console.log(`   Total files: ${fileUrls.size}`)
  console.log(`   Downloaded: ${downloadedCount}`)
  console.log(`   Skipped: ${skippedCount}`)
  console.log(`   Errors: ${errorCount}`)

  // Save file mapping
  const fileMapping = Array.from(fileUrls).map((url) => {
    const urlParts = url.split('/uploads/')
    const fileName = urlParts.length > 1 ? urlParts[1] : url
    return {
      originalUrl: url,
      fileName,
      localPath: path.join(filesDir, fileName),
    }
  })

  const mappingPath = path.join(process.cwd(), 'migration-backup', 'file-mapping.json')
  fs.writeFileSync(mappingPath, JSON.stringify(fileMapping, null, 2), 'utf-8')
  console.log(`\n💾 File mapping saved to: ${mappingPath}`)
}

downloadFromR2()
  .then(() => {
    console.log('\n✨ Download completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Download failed:', error)
    process.exit(1)
  })

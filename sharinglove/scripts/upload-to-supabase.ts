#!/usr/bin/env tsx
/**
 * Upload files from local backup to Supabase Storage
 * Run: npx tsx scripts/upload-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import type { UploadedFile } from './migration-types'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const storage = supabase.storage.from('uploads')

async function uploadToSupabase() {
  console.log('🔄 Starting file upload to Supabase...')

  // Read file mapping
  const mappingPath = path.join(process.cwd(), 'migration-backup', 'file-mapping.json')
  if (!fs.existsSync(mappingPath)) {
    throw new Error('file-mapping.json not found. Run download-from-r2.ts first.')
  }

  const fileMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'))

  console.log(`📦 Found ${fileMapping.length} files to upload`)

  const uploadedFiles: UploadedFile[] = []
  let uploadedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const file of fileMapping) {
    try {
      const { fileName, localPath, originalUrl } = file

      // Check if file exists locally
      if (!fs.existsSync(localPath)) {
        console.warn(`⚠️  File not found: ${localPath}`)
        errorCount++
        continue
      }

      // Read file
      const fileBuffer = fs.readFileSync(localPath)
      const fileSize = fileBuffer.length

      // Determine content type from file extension
      const ext = path.extname(fileName).toLowerCase()
      const contentTypeMap: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.zip': 'application/zip',
        '.hwp': 'application/x-hwp',
      }
      const contentType = contentTypeMap[ext] || 'application/octet-stream'

      console.log(`⬆️  Uploading: ${fileName} (${fileSize} bytes)`)

      // Upload to Supabase Storage
      const { data, error } = await storage.upload(fileName, fileBuffer, {
        contentType,
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
      })

      if (error) {
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = storage.getPublicUrl(data.path)

      uploadedFiles.push({
        originalPath: originalUrl,
        newPath: data.path,
        newUrl: publicUrl,
        size: fileSize,
      })

      uploadedCount++
      console.log(`✅ Uploaded: ${fileName} -> ${publicUrl}`)
    } catch (error) {
      console.error(`❌ Failed to upload ${file.fileName}:`, error)
      errorCount++
    }
  }

  console.log('\n📊 Upload summary:')
  console.log(`   Total files: ${fileMapping.length}`)
  console.log(`   Uploaded: ${uploadedCount}`)
  console.log(`   Skipped: ${skippedCount}`)
  console.log(`   Errors: ${errorCount}`)

  // Save upload mapping (old URL -> new URL)
  const urlMappingPath = path.join(process.cwd(), 'migration-backup', 'url-mapping.json')
  const urlMapping = uploadedFiles.reduce((acc, file) => {
    acc[file.originalPath] = file.newUrl
    return acc
  }, {} as Record<string, string>)

  fs.writeFileSync(urlMappingPath, JSON.stringify(urlMapping, null, 2), 'utf-8')
  console.log(`\n💾 URL mapping saved to: ${urlMappingPath}`)
}

uploadToSupabase()
  .then(() => {
    console.log('\n✨ Upload completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Upload failed:', error)
    process.exit(1)
  })

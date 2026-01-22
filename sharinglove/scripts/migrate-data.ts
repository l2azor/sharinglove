#!/usr/bin/env tsx
/**
 * Main data migration orchestrator
 * Runs all migration steps in sequence
 * Run: npx tsx scripts/migrate-data.ts
 */

import { execSync } from 'child_process'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

function runScript(scriptName: string, description: string) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🚀 ${description}`)
  console.log('='.repeat(60))

  try {
    execSync(`npx tsx scripts/${scriptName}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
    console.log(`✅ ${description} completed\n`)
  } catch (error) {
    console.error(`❌ ${description} failed\n`)
    throw error
  }
}

async function migrate() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   DATA MIGRATION: Neon + R2 → Supabase                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)

  console.log('This script will perform the following steps:')
  console.log('  1. Export data from Neon PostgreSQL')
  console.log('  2. Download files from Cloudflare R2')
  console.log('  3. Upload files to Supabase Storage')
  console.log('  4. Import data to Supabase PostgreSQL')
  console.log('')
  console.log('⚠️  IMPORTANT:')
  console.log('  - Make sure you have set up Supabase first (run SQL in supabase-setup.sql)')
  console.log('  - Update .env.local with Supabase credentials')
  console.log('  - This will CLEAR all existing data in Supabase')
  console.log('  - Keep Neon and R2 active until migration is verified')
  console.log('')

  const confirm = await question('Do you want to continue? (yes/no): ')

  if (confirm.toLowerCase() !== 'yes') {
    console.log('Migration cancelled.')
    rl.close()
    process.exit(0)
  }

  try {
    // Step 1: Export from Neon
    runScript('export-from-neon.ts', 'Step 1: Export from Neon')

    // Step 2: Download from R2
    runScript('download-from-r2.ts', 'Step 2: Download from R2')

    // Step 3: Upload to Supabase Storage
    runScript('upload-to-supabase.ts', 'Step 3: Upload to Supabase Storage')

    // Step 4: Import to Supabase DB
    runScript('import-to-supabase-db.ts', 'Step 4: Import to Supabase DB')

    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✨ MIGRATION COMPLETED SUCCESSFULLY! ✨                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Next steps:
  1. Verify data integrity in Supabase
  2. Test the application locally
  3. Deploy to Vercel
  4. Verify production deployment
  5. After 2 weeks, decommission Neon and R2

Migration artifacts saved in: migration-backup/
  - data.json: Exported data from Neon
  - files/: Downloaded files from R2
  - file-mapping.json: File download mapping
  - url-mapping.json: Old URL → New URL mapping
`)
  } catch (error) {
    console.error('\n❌ Migration failed. Please check the error above.')
    process.exit(1)
  } finally {
    rl.close()
  }
}

migrate()

# Migration Guide: Cloudflare Pages + Neon + R2 → Vercel + Supabase

This guide walks you through the complete migration from Cloudflare Pages, Neon PostgreSQL, and Cloudflare R2 to Vercel and Supabase.

## Prerequisites

- Supabase account
- Vercel account
- Node.js 18+ installed
- Access to current Neon and R2 credentials

## Phase 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - Project name: `sharinglove` (or your choice)
   - Database password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 1.2 Configure Storage

1. In Supabase dashboard, go to **Storage**
2. Run the SQL script in `supabase-setup.sql`:
   - Go to **SQL Editor** in Supabase dashboard
   - Click **New query**
   - Copy and paste contents of `supabase-setup.sql`
   - Click **Run**
3. Verify the `uploads` bucket was created in Storage

### 1.3 Get Supabase Credentials

From your Supabase project dashboard, collect:

1. **Project URL**: Settings → API → Project URL
   - Format: `https://[project-ref].supabase.co`

2. **Anon Key**: Settings → API → Project API keys → `anon` `public`

3. **Service Role Key**: Settings → API → Project API keys → `service_role` (keep secret!)

4. **Database URLs**: Settings → Database → Connection string
   - **Transaction pooler** (for DATABASE_URL)
   - **Session pooler** (for DIRECT_URL, used by Prisma migrations)

### 1.4 Update Environment Variables

Update your `.env.local` file:

```env
# Supabase (NEW)
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_STORAGE_BUCKET=uploads

# Database (UPDATE to Supabase)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# Keep existing
JWT_SECRET=your-existing-jwt-secret

# Keep for migration (remove after migration complete)
R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-r2-domain.com
```

### 1.5 Set Up Database Schema

```bash
# Generate Prisma client with new database
npm run db:generate

# Push schema to Supabase
npm run db:push

# Create admin account
npm run db:seed
```

Verify in Supabase:
- Go to **Table Editor**
- Check that tables exist: `Admin`, `Post`, `Attachment`

## Phase 2: Code Migration (ALREADY COMPLETED)

The following code changes have already been implemented:

✅ Updated `package.json` - removed Cloudflare/Neon deps, added Supabase
✅ Replaced `lib/prisma.ts` - standard Prisma (no adapter)
✅ Created `lib/supabase.ts` - Supabase client
✅ Updated `app/api/upload/route.ts` - uses Supabase Storage
✅ Updated `app/api/posts/[id]/route.ts` - deletes files on post delete
✅ Removed edge runtime from all API routes and layouts
✅ Re-enabled middleware
✅ Updated `next.config.mjs` - added Supabase image domain
✅ Deleted `wrangler.toml`

### Install New Dependencies

```bash
npm install
```

This will:
- Remove: `@cloudflare/next-on-pages`, `wrangler`, `@neondatabase/serverless`, `@prisma/adapter-neon`, `@aws-sdk/client-s3`
- Add: `@supabase/supabase-js`, `@supabase/ssr`

## Phase 3: Data Migration

### 3.1 Backup Current Data (from Neon and R2)

Run the automated migration script:

```bash
npx tsx scripts/migrate-data.ts
```

This script will:
1. Export all data from Neon to `migration-backup/data.json`
2. Download all files from R2 to `migration-backup/files/`
3. Upload all files to Supabase Storage
4. Import all data to Supabase with updated URLs

**OR** run steps individually:

```bash
# Step 1: Export from Neon
npx tsx scripts/export-from-neon.ts

# Step 2: Download from R2
npx tsx scripts/download-from-r2.ts

# Step 3: Upload to Supabase
npx tsx scripts/upload-to-supabase.ts

# Step 4: Import to Supabase DB
npx tsx scripts/import-to-supabase-db.ts
```

### 3.2 Verify Migration

Check the migration results:

```sql
-- Run in Supabase SQL Editor
SELECT boardType, COUNT(*) FROM "Post" GROUP BY boardType;
SELECT COUNT(*) FROM "Attachment";
SELECT COUNT(*) FROM "Admin";
```

Compare counts with Neon database.

Check files in Supabase Storage:
- Go to **Storage** → `uploads` bucket
- Verify files are present

## Phase 4: Local Testing

### 4.1 Test Build

```bash
npm run build
```

Fix any TypeScript or build errors.

### 4.2 Test Locally

```bash
npm run dev
```

Test all functionality:
- ✅ Admin login works
- ✅ Create post in each board type (NOTICE, BUDGET, RESOURCE, GALLERY)
- ✅ Upload images (< 10MB)
- ✅ Upload documents (< 20MB)
- ✅ Files display correctly
- ✅ Edit existing post
- ✅ Delete post - verify files are deleted from Supabase Storage
- ✅ Pagination works
- ✅ Search works
- ✅ Budget/settlement filters work

### 4.3 Verify File Deletion

Critical test for new feature:

1. Create a test post with file attachments
2. Note the file URLs
3. Delete the post
4. Check Supabase Storage - files should be deleted
5. Try accessing old URLs - should return 404

## Phase 5: Vercel Deployment

### 5.1 Connect to Vercel

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link project
vercel link

# Or create new project
vercel
```

### 5.2 Set Environment Variables

In Vercel dashboard or CLI:

```bash
vercel env add DATABASE_URL
# Paste: postgresql://postgres.[project-ref]:[password]@...?pgbouncer=true

vercel env add DIRECT_URL
# Paste: postgresql://postgres.[project-ref]:[password]@...

vercel env add JWT_SECRET
# Paste your existing JWT secret

vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://[project-ref].supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your Supabase service role key

vercel env add SUPABASE_STORAGE_BUCKET
# Value: uploads
```

### 5.3 Deploy to Production

```bash
vercel --prod
```

### 5.4 Verify Production Deployment

Visit your Vercel URL and test:
- Admin login
- Create/edit/delete posts
- File upload/download
- File deletion on post delete
- All board types work correctly

## Phase 6: Verification Checklist

### Functionality Tests
- [ ] Admin login works
- [ ] Create post in NOTICE board
- [ ] Create post in BUDGET board
- [ ] Create post in RESOURCE board
- [ ] Create post in GALLERY board
- [ ] Upload images (< 10MB)
- [ ] Upload documents (< 20MB)
- [ ] Files display with correct URLs
- [ ] Edit existing post
- [ ] Delete post - files are deleted from Supabase Storage
- [ ] Pagination works
- [ ] Search works
- [ ] Budget/settlement filters work
- [ ] Unauthenticated users redirected from /admin routes

### Data Integrity
```sql
-- Run in Supabase SQL Editor
SELECT boardType, COUNT(*) FROM "Post" GROUP BY boardType;
SELECT COUNT(*) FROM "Attachment";
SELECT COUNT(*) FROM "Attachment"
WHERE "fileUrl" NOT LIKE '%supabase.co%';
```

Last query should return 0 (all files should be Supabase URLs).

### Performance
- [ ] Page load < 2s
- [ ] Image loading acceptable
- [ ] File upload completes successfully

## Rollback Plan

If issues arise:

1. Keep Neon and R2 active for 2 weeks
2. Revert code changes:
   ```bash
   git revert <commit-hash>
   git push
   ```
3. Redeploy to Cloudflare Pages
4. Investigate and fix issues
5. Retry migration

## Post-Migration (After 2 Weeks)

Once verified and stable:

- [ ] Decommission Neon database
- [ ] Delete R2 bucket
- [ ] Cancel Cloudflare Pages subscription
- [ ] Remove old environment variables from `.env.local`:
  - `R2_ENDPOINT`
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET_NAME`
  - `R2_PUBLIC_URL`
- [ ] Update documentation

## Troubleshooting

### Build Errors

**Error**: `Cannot find module '@supabase/supabase-js'`
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error**: Prisma client errors
```bash
npm run db:generate
```

### Migration Errors

**Error**: `file-mapping.json not found`
- Run scripts in order: export → download → upload → import

**Error**: `Missing Supabase environment variables`
- Check `.env.local` has all required Supabase vars

### Runtime Errors

**Error**: Files not uploading
- Check Supabase Storage bucket exists
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check storage policies in Supabase

**Error**: Files not deleting
- Check app/api/posts/[id]/route.ts:198-216
- Verify URL parsing logic matches your Supabase URL format

## Key Improvements

1. **File deletion**: Files now auto-delete from storage when posts removed
2. **Simpler deployment**: Standard Next.js on Vercel (no edge runtime complexity)
3. **Re-enabled middleware**: Better route protection
4. **Integrated stack**: Supabase provides database + storage in one platform
5. **Better DX**: No need for Cloudflare-specific build tools

## Support

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs

## Migration Files Reference

- `supabase-setup.sql` - SQL script for Supabase setup
- `scripts/migrate-data.ts` - Main migration orchestrator
- `scripts/export-from-neon.ts` - Export from Neon
- `scripts/download-from-r2.ts` - Download from R2
- `scripts/upload-to-supabase.ts` - Upload to Supabase Storage
- `scripts/import-to-supabase-db.ts` - Import to Supabase DB
- `migration-backup/` - All migration artifacts (gitignored)

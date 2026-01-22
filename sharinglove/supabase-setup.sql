-- Supabase Setup Script
-- Run this in Supabase SQL Editor after creating your project

-- 1. Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up storage policies for public read access
CREATE POLICY "Public can read files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');

-- 3. Set up storage policies for authenticated uploads/deletes
CREATE POLICY "Service role can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Service role can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploads');

CREATE POLICY "Service role can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'uploads');

-- Note: After running this script:
-- 1. Update .env with Supabase connection strings
-- 2. Run: npx prisma db push
-- 3. Run: npx prisma db seed

-- Add business registration columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS registration_number text,
ADD COLUMN IF NOT EXISTS certificate_url text;

-- Create storage bucket for certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own certificate
CREATE POLICY "Users can upload their own certificate"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own certificate
CREATE POLICY "Users can view their own certificate"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own certificate
CREATE POLICY "Users can update their own certificate"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own certificate
CREATE POLICY "Users can delete their own certificate"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);
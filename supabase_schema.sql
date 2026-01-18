-- =============================================
-- 快乐储蓄罐 Supabase 数据库架构
-- Happy Piggy Bank - Supabase Database Schema
-- =============================================
-- 请在 Supabase Dashboard > SQL Editor 中执行此脚本
-- Run this script in Supabase Dashboard > SQL Editor

-- 1. 创建 joy_moments 表
CREATE TABLE IF NOT EXISTS public.joy_moments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    color TEXT CHECK (color IN ('yellow', 'mint', 'primary', 'blue')) DEFAULT 'yellow',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_joy_moments_user_id ON public.joy_moments(user_id);
CREATE INDEX IF NOT EXISTS idx_joy_moments_created_at ON public.joy_moments(created_at DESC);

-- 3. 启用 RLS (Row Level Security)
ALTER TABLE public.joy_moments ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略 - 用户只能查看自己的记录
DROP POLICY IF EXISTS "Users can view own moments" ON public.joy_moments;
CREATE POLICY "Users can view own moments" ON public.joy_moments
    FOR SELECT
    USING (auth.uid() = user_id);

-- 5. 创建 RLS 策略 - 用户只能创建自己的记录
DROP POLICY IF EXISTS "Users can create own moments" ON public.joy_moments;
CREATE POLICY "Users can create own moments" ON public.joy_moments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 6. 创建 RLS 策略 - 用户只能删除自己的记录
DROP POLICY IF EXISTS "Users can delete own moments" ON public.joy_moments;
CREATE POLICY "Users can delete own moments" ON public.joy_moments
    FOR DELETE
    USING (auth.uid() = user_id);

-- 7. 创建 RLS 策略 - 用户只能更新自己的记录
DROP POLICY IF EXISTS "Users can update own moments" ON public.joy_moments;
CREATE POLICY "Users can update own moments" ON public.joy_moments
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- Storage Bucket 配置
-- =============================================
-- 请在 Supabase Dashboard > Storage 中手动创建名为 'joy-images' 的 bucket
-- 并设置为 public bucket，或者运行以下 SQL：

-- 创建 Storage Bucket (如果使用 SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('joy-images', 'joy-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS 策略
DROP POLICY IF EXISTS "Users can upload own images" ON storage.objects;
CREATE POLICY "Users can upload own images" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'joy-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Users can view own images" ON storage.objects;
CREATE POLICY "Users can view own images" ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'joy-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
CREATE POLICY "Users can delete own images" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'joy-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- 允许公开访问图片 (用于显示)
DROP POLICY IF EXISTS "Public can view all images" ON storage.objects;
CREATE POLICY "Public can view all images" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'joy-images');

-- =============================================
-- 完成提示
-- =============================================
-- 执行完成后，请确保：
-- 1. 在 Authentication > Providers 中启用 Google 和 Apple OAuth
-- 2. 配置正确的 OAuth 回调 URL

-- =============================================
-- Profiles Table & Avatar Storage
-- =============================================

-- 8. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 10. Profiles RLS Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 11. Initial profile creation trigger (Optional but recommended)
-- This ensures a profile row exists when a user signs up.
-- (This part might be risky if auth.users already has data, but good for new users)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 12. Storage for Avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public access
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Policy: Authenticated users can upload to their own folder
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update their own avatar
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own avatar
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );


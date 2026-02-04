-- Supabase Database Setup Script
-- Run this script in your Supabase SQL Editor
-- Database > SQL Editor > New Query

-- ============================================
-- 1. Create authorized_emails table
-- ============================================

CREATE TABLE IF NOT EXISTS authorized_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users
);

-- Enable RLS on authorized_emails
ALTER TABLE authorized_emails ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check if an email is authorized (needed for signup validation)
CREATE POLICY "Anyone can check if email is authorized"
ON authorized_emails FOR SELECT
USING (true);

-- ============================================
-- 2. Create tasks table
-- ============================================

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  task_name TEXT NOT NULL,
  project TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_ms BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_start_time ON tasks(start_time);

-- Enable RLS on tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks table
CREATE POLICY "Users can view their own tasks"
ON tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
ON tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
ON tasks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
ON tasks FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 3. Create user_preferences table (optional)
-- ============================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users UNIQUE NOT NULL,
  theme TEXT DEFAULT 'light',
  pomodoro_work_duration INTEGER DEFAULT 25,
  pomodoro_break_duration INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
ON user_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
ON user_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON user_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- 4. Add initial authorized email(s)
-- ============================================

-- Replace 'your-email@example.com' with your actual email address
-- Add more INSERT statements for additional authorized users
INSERT INTO authorized_emails (email)
VALUES ('your-email@example.com')
ON CONFLICT (email) DO NOTHING;

-- Example: Add multiple emails
-- INSERT INTO authorized_emails (email) VALUES
--   ('user1@example.com'),
--   ('user2@example.com'),
--   ('user3@example.com')
-- ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 5. Verify setup
-- ============================================

-- Check that tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('authorized_emails', 'tasks', 'user_preferences');

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('authorized_emails', 'tasks', 'user_preferences');

-- Check authorized emails
SELECT * FROM authorized_emails;

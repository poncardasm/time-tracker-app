# Supabase Setup Guide

This directory contains SQL scripts and configuration for setting up your Supabase backend.

## Step 1: Run the Database Setup Script

1. Open your Supabase project dashboard at [supabase.com](https://supabase.com)
2. Navigate to **Database** → **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `setup.sql`
5. **IMPORTANT**: Replace `'your-email@example.com'` with your actual email address (around line 99)
6. Click **Run** (or press Cmd/Ctrl + Enter)

The script will create:
- `authorized_emails` table - Controls who can sign up
- `tasks` table - Stores all time tracking tasks
- `user_preferences` table - Stores user settings (optional)
- Row Level Security (RLS) policies - Ensures users can only access their own data
- Indexes for better performance

## Step 2: Verify the Setup

After running the script, you should see output showing:
- Tables created successfully
- RLS enabled on all tables
- Your email in the authorized_emails table

You can verify by running these queries in the SQL Editor:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('authorized_emails', 'tasks', 'user_preferences');

-- Check your authorized email was added
SELECT * FROM authorized_emails;
```

## Step 3: Configure Authentication (Optional)

By default, Supabase uses email/password authentication. If you want to customize:

1. Go to **Authentication** → **Providers**
2. Enable/disable providers (Email, Google, GitHub, etc.)
3. Configure email templates under **Authentication** → **Email Templates**

## Step 4: Set Up Local Environment

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   - Get **Project URL** from **Project Settings** → **API**
   - Get **Publishable API Key** from **Project Settings** → **API**

3. The `.env.local` file is already in `.gitignore` and will not be committed

## Adding More Authorized Users

To authorize additional email addresses to sign up:

```sql
INSERT INTO authorized_emails (email)
VALUES ('newuser@example.com')
ON CONFLICT (email) DO NOTHING;
```

Or add multiple at once:

```sql
INSERT INTO authorized_emails (email) VALUES
  ('user1@example.com'),
  ('user2@example.com'),
  ('user3@example.com')
ON CONFLICT (email) DO NOTHING;
```

## Security Notes

- **Publishable API Key** (anon key) is safe to use in client-side code
- **Service Role Key** should NEVER be exposed in client code
- Row Level Security (RLS) ensures users can only access their own data
- All database policies are tested in Phase 1, Task 5 of the implementation plan

## Troubleshooting

### "relation already exists" error
This means the tables are already created. You can either:
- Skip the script (tables already exist)
- Drop the tables first: `DROP TABLE IF EXISTS tasks, authorized_emails, user_preferences CASCADE;`

### Can't see tables in Table Editor
Make sure you're looking at the **public** schema, not **auth** or other schemas.

### RLS preventing access
Make sure:
1. You're authenticated as a user
2. The user's `auth.uid()` matches the `user_id` in the table
3. RLS policies are correctly configured

## Next Steps

Once database setup is complete, proceed to:
- Phase 2: Install Supabase client library and implement authentication
- See `docs/supabase-implementation-plan.md` for full implementation details

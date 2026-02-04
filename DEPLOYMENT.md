# Deployment Guide

This guide walks you through deploying the Time Tracker PWA to production hosting.

## Prerequisites

Before deploying, ensure you have:

1. **Supabase Project**: A Supabase project with the database schema set up
   - See `supabase/README.md` for setup instructions
   - Run `supabase/setup.sql` in your Supabase SQL Editor
   - Add authorized emails to the `authorized_emails` table

2. **Supabase Credentials**:
   - Project URL: `https://your-project.supabase.co`
   - Publishable API Key (anon key): Found in Project Settings → API

3. **Git Repository**: Your code pushed to a Git provider (GitHub, GitLab, Bitbucket)

## Environment Variables

The application requires the following environment variables in production:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdefgh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase publishable API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**Important**: Never commit these values to your repository. They should only be set in your deployment platform's environment variable settings.

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

Vercel provides automatic deployments, serverless functions, and excellent performance for Vite applications.

#### Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Configure project:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add environment variables:
     - Click "Environment Variables"
     - Add `VITE_SUPABASE_URL` with your Supabase project URL
     - Add `VITE_SUPABASE_ANON_KEY` with your publishable API key
   - Click "Deploy"

3. **Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow the prompts and set environment variables when asked.

4. **Set Production Environment Variables**:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

5. **Redeploy** (if needed):
   ```bash
   vercel --prod
   ```

#### Vercel Configuration

Create `vercel.json` in your project root (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        },
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    }
  ]
}
```

### Option 2: Deploy to Netlify

Netlify offers similar features with a different interface and workflow.

#### Steps:

1. **Deploy via Netlify Dashboard**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Add environment variables:
     - Go to "Site settings" → "Environment variables"
     - Add `VITE_SUPABASE_URL`
     - Add `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy site"

2. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

#### Netlify Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    Service-Worker-Allowed = "/"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Deploy to Other Platforms

The app can be deployed to any static hosting provider that supports Vite/SPA applications:

- **GitHub Pages**: Requires `vite.config.js` base path configuration
- **Cloudflare Pages**: Similar to Vercel/Netlify
- **Firebase Hosting**: Requires Firebase CLI
- **AWS S3 + CloudFront**: For AWS ecosystem

For all platforms:
1. Build the project: `npm run build`
2. Upload the `dist/` folder contents
3. Configure environment variables
4. Ensure proper headers for Service Worker and manifest.json

## Post-Deployment Checklist

After deploying, verify the following:

### 1. Application Loads
- [ ] Navigate to your deployment URL
- [ ] Page loads without errors
- [ ] Dark mode toggle works
- [ ] UI renders correctly

### 2. Authentication Works
- [ ] Sign up with authorized email succeeds
- [ ] Sign up with unauthorized email is rejected
- [ ] Login with correct credentials works
- [ ] Login with incorrect credentials fails
- [ ] Session persists after page refresh
- [ ] Sign out clears session

### 3. Task Operations Work
- [ ] Create a new task (stopwatch mode)
- [ ] Create a new task (Pomodoro mode)
- [ ] Add manual time entry
- [ ] Edit existing task
- [ ] Delete task(s)
- [ ] Task list displays correctly
- [ ] Export to CSV works

### 4. Sync Features Work
- [ ] SyncStatus shows "Synced" when online
- [ ] Tasks sync across different devices/browsers
- [ ] Offline indicator shows when network is disabled
- [ ] Error toasts display for failed operations

### 5. PWA Features Work
- [ ] Service Worker registers successfully
- [ ] App can be installed (Add to Home Screen)
- [ ] App works offline (loads cached version)
- [ ] Push notifications work (Pomodoro timer)

### 6. Data Migration Works (if applicable)
- [ ] Migration modal appears for users with localStorage data
- [ ] Import legacy tasks succeeds
- [ ] Skip migration works
- [ ] Legacy data cleared after successful migration

## Environment Variable Security

### Best Practices:

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use separate Supabase projects** for development and production
3. **Rotate API keys** if accidentally exposed
4. **Enable Row Level Security (RLS)** on all Supabase tables
5. **Restrict authorized emails** to trusted users only

### Supabase Security Settings:

In your Supabase project dashboard:

1. **Authentication** → **Providers**:
   - Disable unused providers (keep only Email)
   - Enable email confirmations (optional but recommended)

2. **Authentication** → **URL Configuration**:
   - Add your production domain to "Site URL"
   - Add production domain to "Redirect URLs"

3. **Database** → **Replication**:
   - Enable Point-in-Time Recovery (PITR) for production

4. **Settings** → **API**:
   - Keep `anon` key public (safe with RLS)
   - Never expose `service_role` key in client code

## Monitoring and Maintenance

### Recommended Monitoring:

1. **Supabase Dashboard**:
   - Monitor API usage in "Home" → "Usage"
   - Check database size and connections
   - Review authentication logs

2. **Platform Monitoring**:
   - Vercel/Netlify: Check deployment logs and analytics
   - Set up error monitoring (Sentry, LogRocket, etc.)

3. **User Feedback**:
   - Monitor toast error notifications
   - Check browser console for client-side errors

### Updating the Application:

1. Make changes in your local environment
2. Test thoroughly with local Supabase project
3. Commit and push to Git
4. Automatic deployment triggers (Vercel/Netlify)
5. Verify deployment in production
6. Test critical flows (auth, tasks, sync)

### Service Worker Updates:

When updating cached resources:

1. Increment `CACHE_NAME` in `public/sw.js`
2. Deploy the update
3. Service Worker will update automatically
4. Users see new version on next page load

## Troubleshooting

### Issue: "User not authenticated" errors

**Cause**: Environment variables not set correctly

**Solution**:
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in deployment platform
2. Ensure variables start with `VITE_` prefix
3. Redeploy after adding variables

### Issue: "Email not authorized" on signup

**Cause**: Email not in `authorized_emails` table

**Solution**:
1. Go to Supabase Dashboard → Table Editor → `authorized_emails`
2. Insert a row with the email address
3. Try signup again

### Issue: Tasks not syncing

**Cause**: RLS policies not configured or user not authenticated

**Solution**:
1. Verify RLS policies are enabled (run `supabase/setup.sql`)
2. Check browser console for authentication errors
3. Ensure user is signed in
4. Verify Supabase credentials are correct

### Issue: Service Worker not registering

**Cause**: Not served over HTTPS or incorrect headers

**Solution**:
1. Ensure production URL uses HTTPS
2. Verify `Service-Worker-Allowed` header is set
3. Check browser console for Service Worker errors
4. Clear browser cache and reload

### Issue: CORS errors in production

**Cause**: Supabase domain restrictions

**Solution**:
1. Go to Supabase → Settings → API
2. Add your production domain to allowed origins
3. Save and redeploy

### Issue: Build fails on deployment platform

**Cause**: Missing dependencies or build configuration

**Solution**:
1. Ensure `package.json` includes all dependencies
2. Verify build command is `npm run build`
3. Check Node.js version compatibility
4. Review build logs for specific errors

## Support

For issues specific to:
- **Time Tracker App**: Check GitHub Issues or create a new one
- **Supabase**: Visit [supabase.com/docs](https://supabase.com/docs)
- **Vercel**: Visit [vercel.com/docs](https://vercel.com/docs)
- **Netlify**: Visit [docs.netlify.com](https://docs.netlify.com)

## License

See LICENSE file in the project repository.

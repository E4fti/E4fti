# Deploy to Vercel with GitHub

## Prerequisites
- GitHub account (https://github.com)
- Vercel account (https://vercel.com)
- Database URL from Railway or Supabase (already set in `.env.local`)

## Step-by-Step Deployment

### 1. Push to GitHub

Create a new repository on GitHub, then:

```bash
# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repo
4. Click Import
5. Skip "Create Team" if prompted
6. Under **Environment Variables**, add:
   - Name: `DATABASE_URL`
   - Value: (Your Railway/Supabase connection string)
7. Click **Deploy**
8. Wait 2-3 minutes for deployment to complete

**Option B: Using Vercel CLI**
```bash
npm install -g vercel
vercel
# Follow prompts, add DATABASE_URL when asked for environment variables
```

### 3. Configure Environment Variables in Vercel

If you didn't add `DATABASE_URL` during deployment:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Click "Add New"
3. Set:
   - Name: `DATABASE_URL`
   - Value: `postgresql://postgres:CrCZcSZwlRpXMpEbzfgUHgGUFjIVxSpr@yamanote.proxy.rlwy.net:29173/railway`
4. Apply to **Production**, **Preview**, and **Development**
5. Redeploy your app

### 4. Your app is live!

Visit: `https://your-project-name.vercel.app`

## What happens on deployment

1. **Build**: Vite builds your React frontend → `dist/public/`
2. **Build**: esbuild bundles your Express backend → `dist/index.cjs`
3. **Start**: Node.js runs your Express server on port specified by Vercel
4. **Database**: Connects to your Railway/Supabase PostgreSQL
5. **Static files**: Express serves your React build from `dist/public/`

## Automatic Deployments

After connecting GitHub:
- **Production**: Every push to `main` branch auto-deploys
- **Preview**: Every pull request gets a preview deployment
- **Rollback**: Easy rollback to previous deployments in Vercel dashboard

## Troubleshooting

**"DATABASE_URL is not set"**
- Go to Vercel Settings > Environment Variables
- Add DATABASE_URL with your Railway/Supabase connection string
- Trigger a redeploy (Deployments → click latest → Redeploy)

**"Build failed"**
- Check build logs in Vercel dashboard
- Run `npm run build` locally to debug
- Run `npm run check` for TypeScript errors

**"Cannot connect to database"**
- Verify DATABASE_URL is correct in Vercel env vars
- Check Railway/Supabase database is running
- Ensure whitelist/firewall allows Vercel IPs (usually automatic)

## Environment-Specific Notes

- **Local dev**: Uses `.env.local`
- **Vercel (all environments)**: Uses Vercel dashboard env vars
- **Production**: Only uses Vercel environment variables

For more info: https://vercel.com/docs

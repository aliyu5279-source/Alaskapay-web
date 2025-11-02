# Deploy to Vercel Instead of Netlify

If Netlify keeps failing, Vercel is an excellent alternative that often handles builds better.

## Quick Vercel Deployment

### Method 1: Vercel Dashboard (Easiest)
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Vercel auto-detects settings
6. Click "Deploy"

### Method 2: Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (run from project root)
vercel

# Deploy to production
vercel --prod
```

## Vercel Configuration

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_PAYSTACK_PUBLIC_KEY
- VITE_STRIPE_PUBLIC_KEY

## Advantages of Vercel
- Better build error messages
- Faster builds
- Automatic HTTPS
- Better React/Vite support
- Free SSL certificates
- Global CDN

## Custom Domain on Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as shown
4. Wait for verification (usually 5-10 minutes)

## Vercel is Ready!
Your site will be live at: `https://your-project.vercel.app`

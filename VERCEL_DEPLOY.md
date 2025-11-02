# 🚀 Deploy AlaskaPay to Vercel

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alaskapay/alaskapay&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY,VITE_PAYSTACK_PUBLIC_KEY,VITE_STRIPE_PUBLIC_KEY&project-name=alaskapay&repository-name=alaskapay)

Click the button above to deploy AlaskaPay to Vercel in seconds!

## Manual Deployment

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## First-Time Setup

### 1. Environment Variables
After clicking "Deploy with Vercel", you'll be prompted to add:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_PAYSTACK_PUBLIC_KEY`: Your Paystack public key
- `VITE_STRIPE_PUBLIC_KEY`: Your Stripe public key (optional)

### 2. Configure via Dashboard
Go to: **Project Settings → Environment Variables**

Add each variable for all environments (Production, Preview, Development)

### 3. Redeploy
After adding variables:
```bash
vercel --prod
```

## Automatic Deployments

### Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure build settings (auto-detected)
5. Add environment variables
6. Click "Deploy"

**Every push to main branch = automatic production deployment**
**Every PR = automatic preview deployment**

## Custom Domain Setup

### 1. Add Domain in Vercel
```bash
vercel domains add yourdomain.com
```

Or via dashboard: **Project Settings → Domains**

### 2. Configure DNS
Add these records to your domain provider:

**For Root Domain (alaskapay.ng):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Verify Domain
```bash
vercel domains verify yourdomain.com
```

## Advanced Configuration

### Custom Build Settings
Edit `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Environment-Specific Variables
```bash
# Production only
vercel env add VITE_API_URL production

# Preview only
vercel env add VITE_API_URL preview

# Development only
vercel env add VITE_API_URL development
```

### Serverless Functions
Create API routes in `/api` directory:
```typescript
// api/hello.ts
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' });
}
```

## Performance Optimization

### Edge Network
Vercel automatically deploys to 100+ edge locations worldwide for ultra-fast loading.

### Image Optimization
Use Vercel's built-in image optimization:
```tsx
import Image from 'next/image'
// Automatic optimization, lazy loading, WebP conversion
```

### Analytics
Enable Vercel Analytics:
```bash
npm install @vercel/analytics
```

```tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

## Monitoring & Logs

### View Deployment Logs
```bash
vercel logs [deployment-url]
```

### Real-time Logs
```bash
vercel logs --follow
```

### View in Dashboard
Go to: **Deployments → Select Deployment → Logs**

## Troubleshooting

### Build Failures
```bash
# Check build logs
vercel logs [deployment-url]

# Test build locally
npm run build
```

### Environment Variables Not Working
```bash
# List all environment variables
vercel env ls

# Pull environment variables locally
vercel env pull
```

### Domain Not Working
```bash
# Check domain status
vercel domains ls

# Inspect domain configuration
vercel domains inspect yourdomain.com
```

### Clear Build Cache
```bash
vercel --force
```

## Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# View project info
vercel inspect

# Link local project
vercel link

# Pull environment variables
vercel env pull

# Add environment variable
vercel env add [NAME]

# List domains
vercel domains ls

# Add domain
vercel domains add [domain]

# View logs
vercel logs

# Open project in browser
vercel open
```

## Comparison: Vercel vs Netlify

| Feature | Vercel | Netlify |
|---------|--------|---------|
| **Build Speed** | ⚡ Faster | Fast |
| **Edge Network** | 100+ locations | 190+ locations |
| **Serverless Functions** | ✅ Excellent | ✅ Good |
| **Preview Deployments** | ✅ Automatic | ✅ Automatic |
| **Custom Domains** | ✅ Free SSL | ✅ Free SSL |
| **Analytics** | ✅ Built-in (paid) | ✅ Built-in (paid) |
| **Image Optimization** | ✅ Automatic | ⚠️ Manual |
| **Framework Support** | ⭐ Excellent | ⭐ Excellent |
| **Free Tier** | 100GB bandwidth | 100GB bandwidth |
| **Best For** | Next.js, React | Static sites, JAMstack |

## Support

- 📚 [Vercel Documentation](https://vercel.com/docs)
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)
- 🐛 [Report Issues](https://github.com/vercel/vercel/issues)

---

**🎉 Your AlaskaPay is now live on Vercel!**

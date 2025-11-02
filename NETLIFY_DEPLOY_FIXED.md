# Netlify Deployment - FIXED

## The Error Was Fixed ✅

**Problem:** Base directory configuration was causing Netlify to look for `/opt/build`
**Solution:** Removed base directory from netlify.toml

## Deploy Now (3 Methods)

### Method 1: GitHub Auto-Deploy (Recommended)
1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Netlify config"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repo: `aliyu5279-source/Alaska-pay`
   - Netlify will auto-detect settings from netlify.toml
   - Click "Deploy site"

3. **Add Environment Variables:**
   - Go to Site settings → Environment variables
   - Add these:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_key
     VITE_PAYSTACK_PUBLIC_KEY=your_paystack_key
     VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
     ```

### Method 2: Netlify CLI
```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Build locally
npm install --legacy-peer-deps
npm run build

# Deploy
netlify deploy --prod
```

### Method 3: Drag & Drop
1. Build locally: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder
4. Done!

## What Changed in netlify.toml

**Before (Broken):**
```toml
base = "."  # This caused the error
```

**After (Fixed):**
```toml
# No base directory needed for standard React projects
command = "npm install --legacy-peer-deps && npm run build"
publish = "dist"
```

## Troubleshooting

**Build fails with dependency errors?**
- The `--legacy-peer-deps` flag is now in the build command

**Environment variables not working?**
- Make sure they start with `VITE_` prefix
- Add them in Netlify dashboard, not in code

**404 on page refresh?**
- The redirects are configured in netlify.toml
- All routes redirect to index.html for SPA routing

## Custom Domain Setup

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS instructions
4. SSL certificate auto-generates

## Success! 🎉

Your site will be live at: `https://your-site-name.netlify.app`

Every push to `main` branch auto-deploys!

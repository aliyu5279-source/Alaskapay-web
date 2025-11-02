# 🔧 Netlify Build Fix & Auto-Deploy Guide

## Project ID: a49be8e7-5d3e-442a-962f-42cc53fce437

## ✅ What Was Fixed

1. **Updated netlify.toml**:
   - Set Node version to 20
   - Changed `npm install` to `npm ci` for faster, more reliable builds
   - Added `--legacy-peer-deps` flag for dependency resolution
   - Kept all redirects and security headers

2. **Created Auto-Deploy Scripts**:
   - `AUTO_FIX_AND_DEPLOY.sh` (Mac/Linux)
   - `AUTO_FIX_AND_DEPLOY.bat` (Windows)

## 🚀 Quick Deploy to GitHub

### Option 1: Use Auto-Deploy Script

**For Mac/Linux:**
```bash
chmod +x AUTO_FIX_AND_DEPLOY.sh
./AUTO_FIX_AND_DEPLOY.sh
```

**For Windows:**
```cmd
AUTO_FIX_AND_DEPLOY.bat
```

### Option 2: Manual Deploy

```bash
git add .
git commit -m "Fix: Netlify build configuration"
git push origin main
```

## 🌐 Get Your Deployed Link

After pushing to GitHub, Netlify will auto-deploy. Get your link:

1. **Via Netlify Dashboard**:
   - Go to: https://app.netlify.com/sites/a49be8e7-5d3e-442a-962f-42cc53fce437
   - Your site URL will be shown at the top

2. **Via Netlify CLI**:
   ```bash
   netlify open --site a49be8e7-5d3e-442a-962f-42cc53fce437
   ```

## 🔍 Troubleshooting

### If build still fails:

1. **Check Netlify Site Settings**:
   - Go to Site Settings → Build & Deploy
   - Ensure "Base directory" is empty or set to `.`
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`

2. **Check Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add any required VITE_ variables

3. **Clear Build Cache**:
   - Go to Deploys → Trigger Deploy → Clear cache and deploy site

## 📝 Your Site URLs

Once deployed, you'll have:
- **Netlify URL**: `https://[site-name].netlify.app`
- **Custom Domain** (if configured): `https://alaskapay.com`

Check deployment status at:
https://app.netlify.com/sites/a49be8e7-5d3e-442a-962f-42cc53fce437/deploys

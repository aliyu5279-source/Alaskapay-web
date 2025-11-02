# Force Rebuild Netlify (When Stuck)

## 🎯 Quick Fix - 3 Steps

### 1️⃣ Cancel Current Build
```
Netlify Dashboard → Deploys → Click stuck deploy → Cancel deploy
```

### 2️⃣ Clear Cache & Redeploy
```
Deploys → Trigger deploy → Clear cache and deploy site
```

### 3️⃣ Watch Logs (Should finish in 3-5 min)
```
Click on new deploy → View build logs
```

---

## 🔧 If Still Stuck: Update Build Settings

### In Netlify Dashboard:
**Site Settings → Build & Deploy → Build Settings**

```
Build command: npm ci --legacy-peer-deps && npm run build
Publish directory: dist
```

**Environment Variables** (Site Settings → Environment Variables):
```
NODE_VERSION = 18
NPM_FLAGS = --legacy-peer-deps
VITE_SUPABASE_URL = (your value)
VITE_SUPABASE_ANON_KEY = (your value)
```

---

## 🚀 Alternative: Deploy via CLI (2 minutes)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Build locally
npm run build

# Deploy to production
netlify deploy --prod --dir=dist
```

**Done!** Your site is live in 2 minutes.

---

## 🔍 Debug: Check What's Wrong

### View Full Build Log:
1. Netlify Dashboard → Deploys
2. Click the stuck/failed deploy
3. Scroll through logs
4. Look for red error messages

### Common Errors:

**"ELIFECYCLE Command failed"**
→ Build script error. Run `npm run build` locally.

**"Out of memory"**
→ Too many dependencies. Upgrade plan or optimize.

**Stuck on "Installing dependencies"**
→ Delete package-lock.json, commit, push.

---

## ⚡ Fastest Solution: Switch to Vercel

If Netlify keeps failing:

```bash
npm install -g vercel
vercel login
vercel --prod
```

Vercel typically deploys in 2-3 minutes with zero config! 🎉

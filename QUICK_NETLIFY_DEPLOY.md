# ⚡ Quick Netlify Deploy - 5 Minutes

## 🚀 Super Fast Deployment

### Step 1: Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Deploy Alaska Pay"
git push origin main
```

### Step 2: Connect Netlify (1 minute)

1. Go to: https://app.netlify.com
2. Click: **"Add new site"** → **"Import an existing project"**
3. Select: **GitHub** → Choose your repository
4. Click: **"Deploy site"**

**Build Settings (Auto-detected):**
- Build command: `npm run build`
- Publish directory: `dist`

### Step 3: Add Environment Variables (2 minutes)

Go to: **Site settings** → **Environment variables** → **Add a variable**

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your-key
VITE_APP_URL=https://your-site.netlify.app
```

### Step 4: Redeploy

1. Go to: **Deploys** tab
2. Click: **"Trigger deploy"** → **"Deploy site"**

---

## ✅ Done! Your Site is Live

**URL**: Check your Netlify dashboard for your live URL

---

## 🔧 Quick Fixes

### Build Failed?

```bash
# Test locally first
npm install
npm run build

# If it works locally, push again
git push origin main
```

### Need Custom Domain?

1. **Site settings** → **Domain management**
2. **Add custom domain** → Enter `alaskapay.com`
3. **Add DNS records** (provided by Netlify)
4. **Wait 24 hours** for SSL certificate

---

## 🎯 CLI Deploy (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## 📱 Automatic Deployments Enabled

Every `git push` automatically deploys! 🎉

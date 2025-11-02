# ⚡ Quick Deploy Guide - 5 Minutes to Production

## 🎯 Fastest Path to Deployment

### Step 1: Get Your API Keys (2 minutes)

**Supabase (Required):**
1. Go to https://supabase.com/dashboard
2. Create new project
3. Copy URL and anon key from Settings → API

**Paystack (Required for payments):**
1. Go to https://dashboard.paystack.com
2. Settings → API Keys & Webhooks
3. Copy Public Key

### Step 2: Deploy to Netlify (1 minute)

**Option A: GitHub (Recommended)**
```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Deploy via Netlify UI
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import from Git"
3. Select your repository
4. Build command: npm run build
5. Publish directory: dist
6. Click "Deploy site"
```

**Option B: CLI**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Step 3: Add Environment Variables (1 minute)

In Netlify Dashboard → Site settings → Environment variables:

```
VITE_SUPABASE_URL = https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJxxx...
VITE_PAYSTACK_PUBLIC_KEY = pk_test_xxx
```

### Step 4: Redeploy (30 seconds)

Click "Trigger deploy" in Netlify dashboard

### Step 5: Test (30 seconds)

Visit your site URL and verify:
- ✅ Homepage loads
- ✅ Can click "Get Started"
- ✅ Services are clickable

---

## 🚀 Alternative: Vercel Deploy

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add environment variables in Vercel dashboard.

---

## 📱 Mobile Apps (Optional)

See `CI_CD_MOBILE_SETUP.md` for iOS/Android deployment.

---

## ✅ Done!

Your AlaskaPay platform is now live! 🎉

**Next Steps:**
- Set up custom domain
- Configure payment webhooks
- Invite beta testers
- Enable analytics

**Need Help?**
- Full guide: `DEPLOYMENT_READY.md`
- Mobile CI/CD: `CI_CD_MOBILE_SETUP.md`
- Secrets: `SECRETS_SETUP_CHECKLIST.md`

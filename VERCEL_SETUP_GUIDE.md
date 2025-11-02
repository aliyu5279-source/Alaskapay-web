# 🚀 Vercel Deployment Guide - Alaska Pay

## Complete Setup in 10 Minutes

---

## 📋 Prerequisites

- GitHub account with Alaska Pay repository
- Vercel account (free tier works)
- Supabase project with API keys
- Paystack account (optional for payments)

---

## 🔧 Step 1: Environment Variables

### Get Your API Keys:

**Supabase:**
1. Go to https://supabase.com/dashboard
2. Select your project → Settings → API
3. Copy `URL` and `anon public` key

**Paystack:**
1. Go to https://dashboard.paystack.com
2. Settings → API Keys & Webhooks
3. Copy `Public Key`

---

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Dashboard (Recommended)

1. **Visit:** https://vercel.com/new
2. **Import Git Repository:** Select Alaska Pay repo
3. **Configure Project:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
   VITE_STRIPE_PUBLIC_KEY=pk_test_xxx (optional)
   ```

5. **Click Deploy** 🚀

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production
vercel --prod
```

---

## ✅ Step 3: Verify Deployment

### Check Build Logs:
1. Vercel Dashboard → Deployments
2. Click latest deployment
3. View "Building" tab for errors

### Test Your Site:
- Homepage: `https://your-site.vercel.app`
- Dashboard: `https://your-site.vercel.app/dashboard`
- Wallet: `https://your-site.vercel.app/wallet`

**All routes should work without 404 errors!**

---

## 🔄 Step 4: Enable Auto-Deploy

Already configured! Every push to `main` branch auto-deploys.

```bash
git add .
git commit -m "update: feature"
git push origin main
# Vercel automatically deploys
```

---

## 🐛 Common Issues & Fixes

### Issue: "404: NOT_FOUND"
**Cause:** Missing environment variables or build failure

**Fix:**
```bash
# Test build locally
npm run build

# If successful, check Vercel env vars
# Dashboard → Settings → Environment Variables
```

### Issue: Blank Page
**Cause:** Environment variables not set

**Fix:** Add all `VITE_*` variables in Vercel Dashboard

### Issue: API Errors
**Cause:** Incorrect Supabase URL/Key

**Fix:** 
1. Verify keys in Supabase Dashboard
2. Update in Vercel → Settings → Environment Variables
3. Redeploy from Deployments tab

### Issue: Build Timeout
**Cause:** Large dependencies

**Fix:** Vercel settings → Build & Development:
- Build timeout: 15 minutes (Pro plan)
- Or optimize dependencies in `package.json`

---

## 🎯 Production Checklist

- [ ] All environment variables added
- [ ] Build succeeds (green checkmark)
- [ ] Homepage loads correctly
- [ ] All routes accessible (no 404)
- [ ] Login/Signup works
- [ ] API calls succeed
- [ ] Custom domain added (optional)
- [ ] SSL certificate active (auto)

---

## 🌐 Custom Domain Setup

1. **Vercel Dashboard** → Project → Settings → Domains
2. **Add Domain:** `alaskapay.ng`
3. **Configure DNS** (at your registrar):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. **Wait 24-48 hours** for DNS propagation

---

## 📊 Monitor Your Deployment

### Analytics (Built-in):
- Vercel Dashboard → Analytics
- View page views, performance, errors

### Error Tracking:
- Vercel Dashboard → Logs
- Real-time error monitoring

---

## 🆘 Need Help?

**Vercel Support:** https://vercel.com/support
**Documentation:** https://vercel.com/docs

**Alaska Pay Docs:**
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `DEPLOYMENT_FIX_404.md` - Troubleshooting 404 errors
- `.env.example` - Required environment variables

---

## ✨ Success!

Your Alaska Pay app is now live on Vercel! 🎉

**Share your deployment:**
- Production URL: `https://your-site.vercel.app`
- Custom domain: `https://alaskapay.ng` (if configured)

---

**Pro Tip:** Enable Vercel's Preview Deployments for every PR to test changes before merging!

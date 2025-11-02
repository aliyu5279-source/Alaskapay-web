# 🔧 Fix 404 NOT_FOUND Deployment Error

## Error Code: `cdg1::5qsqq-1760333165375-7ef713d5e54a`

This error indicates a **Vercel deployment issue**. Here's how to fix it:

---

## ✅ Quick Fix (5 minutes)

### Step 1: Check Environment Variables
```bash
# Create .env file with required variables
cp .env.example .env
```

**Required variables in Vercel Dashboard:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PAYSTACK_PUBLIC_KEY`
- `VITE_STRIPE_PUBLIC_KEY`

### Step 2: Fix Build Command
In Vercel Dashboard → Settings → Build & Development:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 3: Redeploy
```bash
git add .
git commit -m "fix: deployment configuration"
git push origin main
```

---

## 🔍 Detailed Troubleshooting

### Issue 1: Missing Environment Variables
**Symptom:** Build succeeds but app shows blank page or errors

**Fix:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all `VITE_*` variables from `.env.example`
3. Redeploy from Deployments tab

### Issue 2: Build Failure
**Symptom:** 404 error with no deployment

**Fix:**
```bash
# Test build locally first
npm install
npm run build

# If build fails, check for errors
npm run lint
```

### Issue 3: Incorrect Output Directory
**Symptom:** Vercel can't find files

**Fix in vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Issue 4: SPA Routing Not Working
**Symptom:** Homepage works, but /dashboard gives 404

**Fix:** Already configured in `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🚀 Alternative: Deploy to Netlify

If Vercel issues persist, try Netlify:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Netlify auto-detects:** Build command, output directory, and SPA routing.

---

## 📋 Deployment Checklist

- [ ] All environment variables added to hosting platform
- [ ] Build succeeds locally (`npm run build`)
- [ ] Output directory is `dist`
- [ ] SPA rewrites configured
- [ ] Git repository connected to Vercel/Netlify
- [ ] Latest code pushed to main branch

---

## 🆘 Still Having Issues?

### Check Deployment Logs:
1. Vercel Dashboard → Deployments → Click failed deployment
2. View build logs for specific errors

### Common Errors:
- **Module not found:** Run `npm install` locally
- **Type errors:** Run `npm run lint` to check
- **Missing env vars:** Shows as `undefined` in logs

### Test Locally:
```bash
npm run build
npm run preview
# Visit http://localhost:4173
```

---

## ✨ Success Indicators

✅ Build completes without errors
✅ Deployment shows "Ready" status
✅ Homepage loads correctly
✅ All routes work (no 404 on refresh)
✅ API calls succeed (check browser console)

---

**Need Help?** Check `DEPLOYMENT_GUIDE.md` for complete instructions.

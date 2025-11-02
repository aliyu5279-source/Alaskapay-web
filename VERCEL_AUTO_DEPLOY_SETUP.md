# 🚀 Automatic Vercel Deployment Setup

## Complete GitHub Integration with Auto-Deploy

---

## 📦 Quick Setup (5 Minutes)

### Step 1: Connect GitHub to Vercel

1. **Go to:** https://vercel.com/new
2. **Click:** "Import Git Repository"
3. **Select:** Your GitHub account
4. **Choose:** Alaska Pay repository
5. **Click:** "Import"

---

## ⚙️ Step 2: Configure Build Settings

Vercel auto-detects Vite, but verify:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Root Directory: ./
```

**✅ Leave as detected - don't change!**

---

## 🔐 Step 3: Add Environment Variables

### Required Variables:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=production
```

### Optional (if using):

```bash
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
VITE_GOOGLE_MAPS_API_KEY=AIzaSyxxxxx
```

### How to Add:

1. In Vercel import screen → **Environment Variables**
2. Click **"Add"** for each variable
3. Select: **Production, Preview, Development** (all)
4. Click **"Deploy"**

---

## 🎯 Step 4: Get GitHub Secrets (for Workflows)

After first deployment:

1. **Vercel Dashboard** → Settings → General
2. Copy these values:

```bash
VERCEL_TOKEN: Settings → Tokens → Create Token
VERCEL_ORG_ID: Settings → General → Team ID
VERCEL_PROJECT_ID: Settings → General → Project ID
```

3. **Add to GitHub:**
   - Go to: `github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`
   - Click: **"New repository secret"**
   - Add each secret

---

## 🔄 Step 5: Enable Auto-Deploy

### Already Configured! ✅

Your repo has GitHub Actions that auto-deploy on:
- ✅ Every push to `main` branch
- ✅ Manual trigger via Actions tab
- ✅ Pull request previews

### Files that enable this:
```
.github/workflows/deploy-vercel-production.yml
.github/workflows/deploy-vercel-staging.yml
vercel.json
```

---

## 🌐 Step 6: Add Custom Domain

### Add Your Domain:

1. **Vercel Dashboard** → Project → **Settings** → **Domains**
2. **Add Domain:** `yourdomain.com`
3. Vercel shows DNS records needed

### Configure DNS (at your domain registrar):

**For Root Domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For WWW (www.yourdomain.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Verify:
- Wait 5-60 minutes for DNS propagation
- Vercel auto-issues SSL certificate
- Domain shows "Valid Configuration" ✅

---

## 🧪 Test Auto-Deploy

```bash
# Make a small change
echo "# Test" >> README.md

# Commit and push
git add .
git commit -m "test: auto-deploy"
git push origin main

# Watch deployment:
# 1. GitHub Actions tab shows workflow running
# 2. Vercel dashboard shows new deployment
# 3. Site updates automatically in ~2 minutes
```

---

## 📊 Monitor Deployments

### Vercel Dashboard:
- **Deployments:** See all builds and their status
- **Analytics:** Traffic and performance metrics
- **Logs:** Real-time application logs
- **Speed Insights:** Core Web Vitals

### GitHub Actions:
- **Actions tab:** View workflow runs
- **Email notifications:** On build failures
- **Status badges:** Add to README

---

## 🔧 Advanced Configuration

### Preview Deployments (Auto-Enabled):

Every PR gets a unique preview URL:
```
https://alaska-pay-git-feature-branch.vercel.app
```

### Environment-Specific Variables:

```bash
# Production only
VITE_API_URL=https://api.production.com

# Preview only  
VITE_API_URL=https://api.staging.com

# Development only
VITE_API_URL=http://localhost:3000
```

### Custom Build Commands:

Edit `vercel.json`:
```json
{
  "buildCommand": "npm run build && npm run post-build",
  "framework": "vite"
}
```

---

## 🐛 Troubleshooting

### Build Fails:

```bash
# Test locally first
npm install
npm run build

# If successful, check Vercel logs
# Dashboard → Deployments → Click failed build → View logs
```

### Environment Variables Not Working:

1. Check variable names start with `VITE_`
2. Verify added to correct environment (Production)
3. Redeploy: Deployments → ⋯ → Redeploy

### Domain Not Working:

```bash
# Check DNS propagation
nslookup yourdomain.com

# Should show: 76.76.21.21
# If not, wait longer or check DNS settings
```

### Auto-Deploy Not Triggering:

1. Check GitHub Actions enabled: Settings → Actions → General
2. Verify workflow file exists: `.github/workflows/deploy-vercel-production.yml`
3. Check GitHub secrets are set correctly

---

## ✅ Deployment Checklist

- [ ] GitHub repo connected to Vercel
- [ ] All environment variables added
- [ ] First deployment successful
- [ ] GitHub secrets configured (VERCEL_TOKEN, etc.)
- [ ] Auto-deploy tested (push to main)
- [ ] Custom domain added (optional)
- [ ] DNS configured and verified
- [ ] SSL certificate active
- [ ] Preview deployments working
- [ ] Team members invited (if needed)

---

## 🎉 You're Done!

### Your Setup:
✅ **Automatic deployments** on every push
✅ **Preview URLs** for every pull request  
✅ **Custom domain** with auto-SSL
✅ **Environment variables** secured
✅ **Build logs** and monitoring

### Deployment URLs:
- **Production:** https://your-project.vercel.app
- **Custom Domain:** https://yourdomain.com
- **Preview:** Auto-generated per PR

---

## 📚 Next Steps

1. **Add Status Badge** to README:
   ```markdown
   ![Vercel](https://vercelbadges.vercel.app/api/YOUR_USERNAME/YOUR_PROJECT)
   ```

2. **Enable Vercel Analytics:**
   - Dashboard → Analytics → Enable

3. **Set Up Monitoring:**
   - Add error tracking (Sentry)
   - Set up uptime monitoring

4. **Invite Team:**
   - Settings → Team → Invite members

---

## 🆘 Support

- **Vercel Docs:** https://vercel.com/docs
- **GitHub Actions:** https://docs.github.com/actions
- **Community:** https://github.com/vercel/vercel/discussions

**Your app deploys automatically now! 🚀**

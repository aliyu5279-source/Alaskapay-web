# GitHub Pages Deployment Guide for AlaskaPay

## 🚀 Quick Start - Go Live in 3 Steps

### Step 1: Push the Workflow File ✅
The workflow file `.github/workflows/deploy-pages.yml` has been created and is ready to push.

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

### Step 2: Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar under "Code and automation")
4. Under **Source**, select: **GitHub Actions**
5. Click **Save**

### Step 3: Configure Environment Secrets

Add these secrets in **Settings → Secrets and variables → Actions**:

**Required Secrets:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `VITE_PAYSTACK_PUBLIC_KEY` - Paystack public key

## 📋 Deployment Process

Once enabled, the workflow will:
1. ✅ Trigger automatically on every push to `main` branch
2. ✅ Install dependencies
3. ✅ Build the React/Vite application
4. ✅ Deploy to GitHub Pages
5. ✅ Make AlaskaPay live at: `https://[username].github.io/[repo-name]`

## 🌐 Custom Domain Setup (Optional)

### Add Custom Domain to GitHub Pages:
1. Go to **Settings → Pages**
2. Under **Custom domain**, enter: `alaskapay.ng`
3. Click **Save**
4. Wait for DNS check to complete

### Configure DNS Records:
Add these records at your domain registrar:

```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: [username].github.io
```

## 🔍 Verify Deployment

### Check Workflow Status:
1. Go to **Actions** tab in your repository
2. Look for "Deploy to GitHub Pages" workflow
3. Ensure it shows green checkmark ✅

### Access Your Live Site:
- Default URL: `https://[username].github.io/[repo-name]`
- Custom domain: `https://alaskapay.ng` (after DNS setup)

## 🛠️ Workflow Features

- **Automatic Deployment**: Deploys on every push to main
- **Manual Trigger**: Can be triggered manually from Actions tab
- **Environment Variables**: Securely injects API keys during build
- **Optimized Build**: Uses npm ci for faster, reproducible builds
- **Node 20**: Latest LTS version for best performance

## 📊 Monitoring

### View Deployment Logs:
1. Go to **Actions** tab
2. Click on latest workflow run
3. Expand build/deploy steps to see logs

### Check Site Status:
- GitHub provides automatic SSL certificate
- Site is served over HTTPS
- CDN-backed for global performance

## 🔄 Updating the Site

Simply push changes to main branch:
```bash
git add .
git commit -m "Update AlaskaPay features"
git push origin main
```

The site will automatically rebuild and redeploy!

## ⚠️ Troubleshooting

### Build Fails:
- Check that all secrets are configured correctly
- Verify Node.js version compatibility
- Review build logs in Actions tab

### Site Not Loading:
- Wait 2-3 minutes after first deployment
- Clear browser cache
- Check that GitHub Pages is enabled

### Custom Domain Issues:
- DNS propagation can take 24-48 hours
- Verify DNS records with `dig alaskapay.ng`
- Ensure HTTPS is enforced in Pages settings

## 🎉 You're Live!

Once deployed, AlaskaPay will be accessible worldwide with:
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN distribution
- ✅ Automatic deployments
- ✅ Zero hosting costs
- ✅ 99.9% uptime

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Review GitHub Pages documentation
3. Verify all environment secrets are set
4. Ensure repository is public (or GitHub Pro for private repos)

---

**Ready to launch? Follow Steps 1-3 above and AlaskaPay will be live!** 🚀

# 🚀 AlaskaPay GitHub Pages Setup

## ✅ Files Created
- `.github/workflows/deploy-pages.yml` - Automated deployment workflow
- `GITHUB_PAGES_DEPLOYMENT.md` - Complete deployment guide
- `vite.config.pages.ts` - GitHub Pages optimized config

## 🎯 3-Step Deployment Process

### 1️⃣ Push to Repository
```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### 2️⃣ Enable GitHub Pages
1. Go to repository **Settings**
2. Navigate to **Pages** (left sidebar)
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### 3️⃣ Add Environment Secrets
Go to **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_PAYSTACK_PUBLIC_KEY`

## 🌐 Your Site Will Be Live At:
`https://[your-username].github.io/[repo-name]`

## 📖 Full Documentation
See `GITHUB_PAGES_DEPLOYMENT.md` for complete guide including:
- Custom domain setup
- DNS configuration
- Troubleshooting
- Monitoring deployments

## ⚡ Automatic Deployments
Every push to `main` branch will automatically:
1. Build the application
2. Deploy to GitHub Pages
3. Make changes live in ~2 minutes

---
**Note**: You must manually complete steps 2 & 3 as they require repository owner permissions.

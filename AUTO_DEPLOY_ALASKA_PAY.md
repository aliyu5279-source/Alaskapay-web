# 🚀 Alaska Pay - Automatic Deployment Guide

## ⚡ Instant Deploy (Choose Your Method)

### Method 1: GitHub Actions (Recommended - Fully Automated)

**Setup Once, Deploy Forever:**

1. **Add GitHub Secrets** (2 minutes):
   - Go to: `https://github.com/YOUR_USERNAME/alaskamega/settings/secrets/actions`
   - Click "New repository secret"
   - Add these secrets:
     - `NETLIFY_AUTH_TOKEN` - Get from https://app.netlify.com/user/applications
     - `NETLIFY_SITE_ID` - Get from https://app.netlify.com/sites/alaskamega/settings
     - `VITE_SUPABASE_URL` - Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

2. **Deploy Automatically**:
   ```bash
   git add .
   git commit -m "Deploy Alaska Pay"
   git push origin main
   ```
   
   ✅ **Done!** Every push to `main` auto-deploys to production.

3. **Monitor Deployment**:
   - GitHub Actions: `https://github.com/YOUR_USERNAME/alaskamega/actions`
   - Netlify Dashboard: `https://app.netlify.com/sites/alaskamega/deploys`

---

### Method 2: Netlify CLI (Manual Deploy)

**Quick one-time deployment:**

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Build and deploy
npm run build
netlify deploy --prod
```

---

### Method 3: Netlify Dashboard (No Code)

1. Go to: https://app.netlify.com/sites/alaskamega/deploys
2. Drag and drop your `dist` folder
3. Done!

---

## 🔧 Environment Variables Setup

### Required Variables:

Create a `.env` file in the root directory:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Paystack
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# Optional
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Add to Netlify:

1. Go to: https://app.netlify.com/sites/alaskamega/settings/deploys#environment
2. Click "Add variable"
3. Add each variable from your `.env` file

---

## 📊 Deployment Status

### Check Build Status:
- **GitHub Actions**: https://github.com/YOUR_USERNAME/alaskamega/actions
- **Netlify Logs**: https://app.netlify.com/sites/alaskamega/deploys

### Live URLs:
- **Production**: https://alaskapay.netlify.app
- **Custom Domain**: https://alaskapay.com (after DNS setup)

---

## 🎯 Quick Deploy Commands

```bash
# Build for production
npm run build

# Preview build locally
npm run preview

# Deploy to Netlify (after CLI setup)
netlify deploy --prod

# Deploy with build
netlify deploy --build --prod
```

---

## 🔄 Continuous Deployment Workflow

**Current Setup:**
1. Push code to `main` branch
2. GitHub Actions triggers automatically
3. Builds the project with Vite
4. Deploys to Netlify production
5. Site goes live in ~2 minutes

**Workflow File**: `.github/workflows/deploy-netlify-production.yml`

---

## 🆘 Troubleshooting

### Build Fails?
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install --legacy-peer-deps
npm run build
```

### Environment Variables Not Working?
- Check Netlify dashboard for correct variable names
- Ensure variables start with `VITE_` for Vite to expose them
- Redeploy after adding variables

### Deploy Not Triggering?
- Check GitHub Actions is enabled in repo settings
- Verify secrets are added correctly
- Check workflow file syntax

---

## 📱 Mobile App Deployment

### iOS (TestFlight):
```bash
# Build iOS app
npm run build
npx cap sync ios

# Open in Xcode
npx cap open ios

# Archive and upload to TestFlight via Xcode
```

### Android (Play Store):
```bash
# Build Android app
npm run build
npx cap sync android

# Open in Android Studio
npx cap open android

# Generate signed APK/AAB via Android Studio
```

---

## 🎉 Success Checklist

- [ ] GitHub secrets configured
- [ ] Environment variables added to Netlify
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow completed
- [ ] Site accessible at production URL
- [ ] All features working correctly
- [ ] Supabase connection verified
- [ ] Paystack integration tested

---

## 📚 Additional Resources

- **Full Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Netlify Setup**: `NETLIFY_DEPLOY.md`
- **GitHub Actions Setup**: `GITHUB_ACTIONS_SETUP.md`
- **Environment Setup**: `ENVIRONMENT_SETUP.md`
- **Custom Domain**: `CUSTOM_DOMAIN_SETUP.md`

---

## 🚀 Deploy Now!

**Fastest Method:**
```bash
git add .
git commit -m "Deploy Alaska Pay with subscription system"
git push origin main
```

**Your app will be live in 2-3 minutes!** 🎉

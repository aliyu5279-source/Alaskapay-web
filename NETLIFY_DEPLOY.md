# 🚀 Easy Netlify Deployment Guide

## One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/alaskapay/alaskapay)

Click the button above to deploy AlaskaPay to Netlify in seconds!

---

## Manual Deployment (3 Steps)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```
This will open your browser to authenticate.

### Step 3: Deploy
```bash
# Build the project
npm run build

# Deploy to production
netlify deploy --prod
```

---

## First Time Setup

### 1. Create Netlify Account
- Go to [netlify.com](https://netlify.com)
- Sign up with GitHub (recommended) or email

### 2. Link Repository
```bash
# Navigate to your project
cd alaskapay

# Link to Netlify
netlify link
```

### 3. Configure Environment Variables
In Netlify Dashboard:
1. Go to **Site Settings** > **Environment Variables**
2. Add these required variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### 4. Deploy
```bash
npm run build
netlify deploy --prod
```

---

## Automatic Deployment with GitHub

### Enable Continuous Deployment
1. Go to Netlify Dashboard
2. Click **New site from Git**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables
6. Click **Deploy site**

Now every push to `main` branch auto-deploys! 🎉

---

## Quick Commands

```bash
# Deploy to production
netlify deploy --prod

# Deploy preview (staging)
netlify deploy

# Check deployment status
netlify status

# View live logs
netlify logs --live

# Rollback to previous version
netlify rollback

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin
```

---

## Custom Domain Setup

### 1. Add Domain in Netlify
```bash
netlify domains:add alaskapay.ng
```

### 2. Configure DNS Records
Add these records at your domain registrar:

**A Record:**
```
Type: A
Name: @
Value: 75.2.60.5
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: your-site.netlify.app
```

### 3. Enable HTTPS
Netlify automatically provisions SSL certificates via Let's Encrypt!

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
netlify build --clear-cache

# Check build logs
netlify logs
```

### Environment Variables Not Working
1. Ensure all variables start with `VITE_`
2. Redeploy after adding variables
3. Check for typos in variable names

### Site Not Updating
```bash
# Force new deployment
netlify deploy --prod --force

# Clear CDN cache
netlify cache:clear
```

### Deployment Stuck
```bash
# Unlink and relink
netlify unlink
netlify link
netlify deploy --prod
```

---

## Performance Optimization

### Enable Asset Optimization
In `netlify.toml`:
```toml
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.images]
  compress = true
```

### Enable Netlify Analytics
```bash
netlify analytics:enable
```

---

## Monitoring

### View Analytics
```bash
netlify analytics
```

### Check Site Health
```bash
netlify status
```

### View Deployment History
Go to: **Deploys** tab in Netlify Dashboard

---

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Support**: https://answers.netlify.com
- **AlaskaPay Support**: support@alaskapay.ng

---

## Quick Reference Card

| Action | Command |
|--------|---------|
| Deploy to production | `netlify deploy --prod` |
| Deploy preview | `netlify deploy` |
| Check status | `netlify status` |
| View logs | `netlify logs --live` |
| Rollback | `netlify rollback` |
| Open site | `netlify open:site` |
| Open dashboard | `netlify open:admin` |

---

**🎉 Your site is now live at: `https://your-site.netlify.app`**

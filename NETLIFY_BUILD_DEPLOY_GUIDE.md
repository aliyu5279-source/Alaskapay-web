# 🚀 Alaska Pay - Complete Netlify Build & Deploy Guide

## ✅ Prerequisites Checklist

Before you start, make sure you have:
- [ ] GitHub account with Alaska Pay repository
- [ ] Netlify account (free tier works perfectly)
- [ ] Node.js 18+ installed locally
- [ ] Git installed on your computer

---

## 📋 Step 1: Prepare Your Repository

### Push Code to GitHub (if not done yet)

```bash
# Initialize git (if needed)
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for Netlify deployment"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/alaska-pay.git

# Push to GitHub
git push -u origin main
```

---

## 🌐 Step 2: Connect to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Go to Netlify**: https://app.netlify.com
2. **Click**: "Add new site" → "Import an existing project"
3. **Select**: "Deploy with GitHub"
4. **Authorize**: Netlify to access your GitHub account
5. **Choose**: Your Alaska Pay repository
6. **Configure**: Build settings (see below)

### Build Settings Configuration

```
Build command: npm run build
Publish directory: dist
Node version: 18
```

---

## 🔧 Step 3: Configure Environment Variables

### Required Environment Variables

In Netlify Dashboard:
1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add each variable below:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here

# Stripe Configuration (Optional)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here

# App Configuration
VITE_APP_URL=https://alaskapay.netlify.app
VITE_ENVIRONMENT=production
```

### Where to Get API Keys

**Supabase Keys:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API → Copy URL and anon key

**Paystack Keys:**
1. Go to https://dashboard.paystack.com
2. Settings → API Keys & Webhooks
3. Copy Public Key

---

## 🚀 Step 4: Deploy

### First Deployment

1. **Click**: "Deploy site" button
2. **Wait**: 2-5 minutes for build to complete
3. **Check**: Build logs for any errors

### Build Success Indicators

✅ Build command completed
✅ Deploy uploaded
✅ Site is live

---

## 🔗 Step 5: Custom Domain Setup (alaskapay.com)

### Add Custom Domain

1. **Go to**: Site settings → Domain management
2. **Click**: "Add custom domain"
3. **Enter**: `alaskapay.com`
4. **Click**: "Verify"

### Configure DNS Records

Add these records to your domain registrar:

**For Root Domain (alaskapay.com):**
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
TTL: 3600
```

### Enable HTTPS

1. **Wait**: 24 hours for DNS propagation
2. **Netlify**: Automatically provisions SSL certificate
3. **Verify**: https://alaskapay.com loads securely

---

## 🔄 Step 6: Automatic Deployments

### Enable Continuous Deployment

Netlify automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main

# Netlify automatically builds and deploys!
```

### Deploy Notifications

Enable in: Site settings → Build & deploy → Deploy notifications
- Email notifications
- Slack notifications
- Webhook notifications

---

## 🛠️ Troubleshooting Common Issues

### Build Fails

**Error: "Command failed with exit code 1"**
```bash
# Test build locally first
npm install
npm run build

# Check for errors
# Fix issues, then push again
```

**Error: "Module not found"**
```bash
# Ensure all dependencies are in package.json
npm install --save missing-package
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push
```

### Environment Variables Not Working

1. **Check**: Variables are set in Netlify dashboard
2. **Verify**: Variable names start with `VITE_`
3. **Redeploy**: Trigger new deployment after adding variables

### Domain Not Working

1. **Check DNS**: Use https://dnschecker.org
2. **Wait**: DNS can take 24-48 hours to propagate
3. **Verify**: Records are correct in domain registrar

### SSL Certificate Issues

1. **Wait**: 24 hours after DNS configuration
2. **Check**: Domain is verified in Netlify
3. **Retry**: Site settings → Domain management → Verify DNS

---

## 📊 Step 7: Monitor Your Deployment

### Check Site Status

- **Site URL**: https://app.netlify.com/sites/YOUR_SITE
- **Build logs**: Click on latest deploy
- **Analytics**: Built-in traffic analytics

### Performance Optimization

Netlify automatically provides:
- ✅ CDN distribution
- ✅ Asset optimization
- ✅ Automatic HTTPS
- ✅ HTTP/2 support
- ✅ Brotli compression

---

## 🎯 Quick Deploy Commands

### Deploy from Command Line

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to existing site
netlify link

# Deploy to production
netlify deploy --prod
```

### One-Command Deploy

```bash
# Build and deploy in one command
npm run build && netlify deploy --prod --dir=dist
```

---

## 🔐 Security Best Practices

### Enable Security Headers

Already configured in `netlify.toml`:
- ✅ HTTPS redirect
- ✅ HSTS enabled
- ✅ XSS protection
- ✅ Content Security Policy

### Protect Environment Variables

- ✅ Never commit `.env` files
- ✅ Use Netlify's environment variables
- ✅ Rotate keys regularly

---

## 📞 Need Help?

### Resources

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Support**: https://answers.netlify.com
- **Build Logs**: Check for specific error messages

### Common Support Topics

1. Build configuration issues
2. Domain setup problems
3. Environment variable questions
4. SSL certificate troubleshooting

---

## ✨ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Site connected to Netlify
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Custom domain added (optional)
- [ ] DNS records configured (optional)
- [ ] HTTPS working
- [ ] Automatic deployments enabled

---

## 🎉 Your Site is Live!

**Default URL**: https://your-site-name.netlify.app
**Custom Domain**: https://alaskapay.com (after DNS setup)

Every push to GitHub automatically deploys to production! 🚀

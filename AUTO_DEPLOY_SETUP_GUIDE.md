# 🚀 Automatic Deployment Setup Guide

This guide will help you set up automatic deployments to Netlify or Vercel using GitHub Actions.

## ✅ What's Already Done

- ✅ GitHub Actions workflows created
- ✅ Workflows configured for Netlify and Vercel
- ✅ Auto-deploy on push to main branch
- ✅ Preview deployments for pull requests

## 📋 Setup Steps

### Option 1: Netlify Auto-Deploy

#### Step 1: Get Netlify Credentials

1. Go to https://app.netlify.com
2. Click on your site (or create a new one)
3. Go to **Site settings** → **General** → Copy your **Site ID**
4. Go to **User settings** (top right avatar) → **Applications** → **Personal access tokens**
5. Click **New access token** → Name it "GitHub Actions" → Copy the token

#### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

```
NETLIFY_AUTH_TOKEN = <your-netlify-token>
NETLIFY_SITE_ID = <your-site-id>
VITE_SUPABASE_URL = <your-supabase-url>
VITE_SUPABASE_ANON_KEY = <your-supabase-key>
VITE_PAYSTACK_PUBLIC_KEY = <your-paystack-key>
```

#### Step 3: Push to Main

```bash
git add .
git commit -m "Enable auto-deploy"
git push origin main
```

✅ **Done!** Every push to main will now auto-deploy to Netlify.

---

### Option 2: Vercel Auto-Deploy

#### Step 1: Get Vercel Credentials

1. Go to https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Run: `vercel login`
4. Run: `vercel link` (link to your project)
5. Run these commands to get IDs:

```bash
vercel project ls
# Copy your project ID

cat .vercel/project.json
# Copy orgId and projectId
```

6. Get token: Go to https://vercel.com/account/tokens → Create token

#### Step 2: Add GitHub Secrets

Add these secrets to your GitHub repository:

```
VERCEL_TOKEN = <your-vercel-token>
VERCEL_ORG_ID = <your-org-id>
VERCEL_PROJECT_ID = <your-project-id>
VITE_SUPABASE_URL = <your-supabase-url>
VITE_SUPABASE_ANON_KEY = <your-supabase-key>
VITE_PAYSTACK_PUBLIC_KEY = <your-paystack-key>
```

#### Step 3: Push to Main

```bash
git push origin main
```

✅ **Done!** Auto-deploy is now active.

---

## 🎯 What Happens Now

### On Every Push to Main:
- ✅ Code is automatically built
- ✅ Tests run (if configured)
- ✅ Deployed to production
- ✅ You get a deployment URL

### On Pull Requests:
- ✅ Preview deployment created
- ✅ Comment added to PR with preview URL
- ✅ Test your changes before merging

## 📊 View Deployment Status

Add these badges to your README.md:

```markdown
![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)
![Vercel Status](https://img.shields.io/github/deployments/YOUR-USERNAME/YOUR-REPO/production?label=vercel&logo=vercel)
```

## 🔧 Troubleshooting

### Build Fails?
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure environment variables are correct

### Deployment Succeeds but Site is Broken?
- Check browser console for errors
- Verify API keys are production keys
- Check Supabase URL is correct

## 🎉 Success!

Once set up, you can:
- Push code → Automatic deployment
- Create PR → Get preview link
- Merge PR → Auto-deploy to production
- No manual deployment needed!

## 📞 Need Help?

Check the workflow logs:
1. Go to your GitHub repo
2. Click **Actions** tab
3. Click on the latest workflow run
4. View logs for any errors

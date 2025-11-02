# ⚡ Quick CI/CD Setup (5 Minutes)

## 🎯 Goal
Get your CI/CD pipeline running in 5 minutes with automatic deployments to Vercel.

## 📋 Prerequisites
- GitHub repository created
- Vercel account (free tier works!)
- 5 minutes of your time

## 🚀 Step-by-Step Setup

### Step 1: Get Vercel Credentials (2 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project (follow prompts)
vercel link

# This creates .vercel/project.json
# Open it and copy orgId and projectId
```

**Or use Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Import your GitHub repo
3. Go to Project Settings → General
4. Copy Project ID and Team ID

### Step 2: Create Vercel Token (1 minute)

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: `GitHub Actions`
4. Scope: Full Account
5. **Copy the token** (you won't see it again!)

### Step 3: Add GitHub Secrets (2 minutes)

Go to: `https://github.com/aliyu5279-source/alaskapayment/settings/secrets/actions`

Click **New repository secret** and add these **3 required secrets**:

```
Name: VERCEL_TOKEN
Value: [paste token from Step 2]

Name: VERCEL_ORG_ID
Value: [paste orgId from .vercel/project.json]

Name: VERCEL_PROJECT_ID
Value: [paste projectId from .vercel/project.json]
```

**Add your app secrets:**
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_PAYSTACK_PUBLIC_KEY
```

### Step 4: Enable GitHub Actions (30 seconds)

1. Go to Settings → Actions → General
2. Under "Workflow permissions":
   - ✅ Select "Read and write permissions"
   - ✅ Check "Allow GitHub Actions to create and approve pull requests"
3. Click **Save**

### Step 5: Push and Deploy! (30 seconds)

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

## ✅ That's It!

Go to the **Actions** tab in your GitHub repo to watch your first deployment!

## 🎉 What You Get

### Automatic on Every Push:
- ✅ Tests run automatically
- ✅ Code quality checks
- ✅ Production build
- ✅ Deploy to Vercel
- ✅ Deployment URL in logs

### On Pull Requests:
- ✅ Preview deployments
- ✅ Test results in PR
- ✅ Build verification

## 📊 View Your Pipeline

**GitHub Actions:**
https://github.com/aliyu5279-source/alaskapayment/actions

**Vercel Dashboard:**
https://vercel.com/dashboard

## 🔔 Optional: Add Notifications

### Slack (1 minute)
```bash
# Create webhook at: https://api.slack.com/apps
gh secret set SLACK_WEBHOOK_URL
```

### Discord (1 minute)
```bash
# Create webhook in Discord channel settings
gh secret set DISCORD_WEBHOOK
```

## 🐛 Troubleshooting

### Pipeline Fails?
1. Check secrets are set correctly
2. Verify Vercel token is valid
3. Check workflow logs in Actions tab

### Deployment Fails?
1. Verify VERCEL_ORG_ID and VERCEL_PROJECT_ID
2. Check Vercel token permissions
3. Ensure project is linked in Vercel

### Need Help?
- Check logs in Actions tab
- See full guide: [CI_CD_SETUP_GUIDE.md](CI_CD_SETUP_GUIDE.md)

## 🎯 Next Steps

Your CI/CD is now live! Every push to main will:
1. Run tests
2. Build your app
3. Deploy to production
4. Show deployment URL

**No manual deployment ever again!** 🚀

---

**Quick Commands:**
```bash
# View workflow status
gh run list

# View latest run
gh run view

# Re-run failed workflow
gh run rerun
```

# 🚀 CI/CD Pipeline Setup Guide

## Overview

This project uses GitHub Actions for a complete CI/CD pipeline that automatically tests, builds, and deploys your application to Vercel on every push to the main branch.

## 📋 Pipeline Stages

### Stage 1: Code Quality & Testing
- ✅ Type checking with TypeScript
- ✅ Code linting with ESLint
- ✅ Unit and integration tests
- ✅ Code coverage reporting to Codecov

### Stage 2: Build
- ✅ Production build with Vite
- ✅ Build artifact upload
- ✅ Environment variable injection

### Stage 3: Deploy to Production
- ✅ Automatic deployment to Vercel
- ✅ Production environment configuration
- ✅ Deployment URL generation

### Stage 4: Notifications
- ✅ Slack notifications
- ✅ Discord notifications
- ✅ Email notifications
- ✅ GitHub deployment comments

## 🔧 Required GitHub Secrets

### Vercel Secrets (Required)
```
VERCEL_TOKEN          # Get from: https://vercel.com/account/tokens
VERCEL_ORG_ID         # Found in: .vercel/project.json after first deploy
VERCEL_PROJECT_ID     # Found in: .vercel/project.json after first deploy
```

### Application Secrets (Required)
```
VITE_SUPABASE_URL           # Your Supabase project URL
VITE_SUPABASE_ANON_KEY      # Your Supabase anonymous key
VITE_PAYSTACK_PUBLIC_KEY    # Your Paystack public key
```

### Notification Secrets (Optional)
```
SLACK_WEBHOOK_URL           # Slack incoming webhook URL
DISCORD_WEBHOOK            # Discord webhook URL
CODECOV_TOKEN              # Codecov upload token
NOTIFICATION_EMAIL         # Email for deployment notifications
SMTP_SERVER               # SMTP server address
SMTP_PORT                 # SMTP port (usually 587)
SMTP_USERNAME             # SMTP username
SMTP_PASSWORD             # SMTP password
```

## 📝 Setup Instructions

### 1. Set Up Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Get your project details
cat .vercel/project.json
```

Copy the `orgId` and `projectId` from the output.

### 2. Create Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token (you won't see it again!)

### 3. Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret from the list above

**Quick Add Script:**
```bash
# Add Vercel secrets
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID

# Add application secrets
gh secret set VITE_SUPABASE_URL
gh secret set VITE_SUPABASE_ANON_KEY
gh secret set VITE_PAYSTACK_PUBLIC_KEY
```

### 4. Set Up Notifications (Optional)

#### Slack Notifications
1. Go to https://api.slack.com/apps
2. Create a new app
3. Enable Incoming Webhooks
4. Create webhook for your channel
5. Add webhook URL to `SLACK_WEBHOOK_URL` secret

#### Discord Notifications
1. Open Discord channel settings
2. Go to Integrations → Webhooks
3. Create New Webhook
4. Copy webhook URL
5. Add to `DISCORD_WEBHOOK` secret

#### Email Notifications
Add SMTP credentials to secrets:
- `SMTP_SERVER`: smtp.gmail.com (for Gmail)
- `SMTP_PORT`: 587
- `SMTP_USERNAME`: your email
- `SMTP_PASSWORD`: app password (not your regular password)
- `NOTIFICATION_EMAIL`: recipient email

### 5. Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

## 🎯 How It Works

### On Every Push to Main:
1. **Tests run** - All tests must pass
2. **Build created** - Production build is generated
3. **Deploy to Vercel** - Automatic deployment
4. **Notifications sent** - Team is notified of status

### On Pull Requests:
1. **Tests run** - Ensures code quality
2. **Build verified** - Confirms build succeeds
3. **Preview deployment** - Creates preview URL
4. **PR comment** - Adds deployment URL to PR

## 📊 Status Badges

Add these badges to your README.md:

```markdown
[![CI/CD Pipeline](https://github.com/aliyu5279-source/alaskapayment/actions/workflows/complete-ci-cd.yml/badge.svg)](https://github.com/aliyu5279-source/alaskapayment/actions/workflows/complete-ci-cd.yml)
[![Tests](https://github.com/aliyu5279-source/alaskapayment/actions/workflows/test.yml/badge.svg)](https://github.com/aliyu5279-source/alaskapayment/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/aliyu5279-source/alaskapayment/branch/main/graph/badge.svg)](https://codecov.io/gh/aliyu5279-source/alaskapayment)
```

## 🔍 Monitoring Deployments

### View Pipeline Status
- Go to **Actions** tab in your repository
- Click on any workflow run to see details
- View logs for each step

### Check Deployment URL
- Deployment URL is shown in workflow logs
- Also available in GitHub deployment section
- Sent via notifications (if configured)

### Rollback if Needed
```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

## 🐛 Troubleshooting

### Build Fails
- Check if all secrets are set correctly
- Verify environment variables
- Review build logs in Actions tab

### Deployment Fails
- Verify Vercel token is valid
- Check VERCEL_ORG_ID and VERCEL_PROJECT_ID
- Ensure Vercel project is linked

### Tests Fail
- Run tests locally: `npm test`
- Check test logs in Actions tab
- Fix failing tests before pushing

### Notifications Not Working
- Verify webhook URLs are correct
- Check SMTP credentials
- Ensure secrets are set (not empty)

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Codecov Documentation](https://docs.codecov.com)

## 🎉 Success!

Once set up, every push to main will:
1. ✅ Run all tests
2. ✅ Build your application
3. ✅ Deploy to production
4. ✅ Notify your team

**No manual deployment needed!** 🚀

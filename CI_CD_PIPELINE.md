# CI/CD Pipeline Documentation

## Overview

AlaskaPay uses GitHub Actions for automated CI/CD with comprehensive testing, security scanning, and multi-environment deployments to both Vercel and Netlify.

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Code Push/PR                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ├─► CI Pipeline (All Branches)
                   │   ├─► Type Check
                   │   ├─► Lint & Format Check
                   │   ├─► Unit Tests
                   │   ├─► Integration Tests
                   │   ├─► E2E Tests
                   │   └─► Coverage Report
                   │
                   ├─► Security Scan (All Branches)
                   │   ├─► Dependency Scan (npm audit)
                   │   ├─► Code Analysis (CodeQL)
                   │   ├─► Container Scan (Trivy)
                   │   └─► Snyk Security Check
                   │
                   ├─► Staging Deploy (develop branch)
                   │   ├─► Run Tests
                   │   ├─► Build with Staging Config
                   │   ├─► Deploy to Vercel Staging
                   │   ├─► Deploy to Netlify Staging
                   │   └─► Send Notifications
                   │
                   └─► Production Deploy (main branch)
                       ├─► Full Test Suite
                       ├─► Security Audit
                       ├─► Build with Production Config
                       ├─► Deploy to Vercel Production
                       ├─► Deploy to Netlify Production
                       ├─► Run Smoke Tests
                       └─► Send Notifications
```

## Workflows

### 1. CI Pipeline (`ci.yml`)
**Trigger:** Push/PR to main or develop

**Jobs:**
- Type checking with TypeScript
- ESLint and format checking
- Unit tests with coverage
- PR coverage comments
- Slack/Discord notifications on failure

### 2. Security Scan (`security-scan.yml`)
**Trigger:** Push/PR, Weekly schedule

**Scans:**
- `npm audit` for dependency vulnerabilities
- Snyk security analysis
- CodeQL code scanning
- Trivy filesystem scanning
- Results uploaded to GitHub Security

### 3. Test Suite (`test.yml`)
**Trigger:** Push/PR to main or develop

**Tests:**
- Unit tests with Jest
- Integration tests with test database
- E2E tests with Playwright
- Type checking
- Linting
- Performance tests (Lighthouse CI)

### 4. Vercel Deployments

#### Staging (`deploy-vercel-staging.yml`)
**Trigger:** Push to develop
- Runs tests
- Builds with staging environment variables
- Deploys to Vercel staging
- Alias: `staging.alaskapay.app`

#### Production (`deploy-vercel-production.yml`)
**Trigger:** Push to main
- Full test suite
- Security audit
- Production build
- Deploys to `alaskapay.app`
- Smoke tests
- Notifications

### 5. Netlify Deployments

#### Staging (`deploy-netlify-staging.yml`)
**Trigger:** Push to develop
- Runs tests
- Builds with staging config
- Deploys to Netlify staging
- PR/commit comments enabled

#### Production (`deploy-netlify-production.yml`)
**Trigger:** Push to main
- Full test suite
- Security audit
- Production build
- Deploys to `alaskapay.netlify.app`
- Smoke tests
- Notifications

## Environment Configuration

### Required Secrets

#### GitHub Secrets
```bash
# Supabase (Production)
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

# Supabase (Staging)
STAGING_SUPABASE_URL
STAGING_SUPABASE_ANON_KEY

# Vercel
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Netlify
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID

# Notifications
SLACK_WEBHOOK_URL
DISCORD_WEBHOOK

# Security
SNYK_TOKEN
CODECOV_TOKEN
LHCI_GITHUB_APP_TOKEN
```

### Setting Up Secrets

1. **Go to Repository Settings** → Secrets and variables → Actions

2. **Add each secret:**
   ```bash
   # Example: Adding Vercel token
   Name: VERCEL_TOKEN
   Value: <your-vercel-token>
   ```

3. **Get Vercel credentials:**
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   # Copy values from .vercel/project.json
   ```

4. **Get Netlify credentials:**
   ```bash
   # Get auth token from Netlify dashboard
   # Settings → User settings → Applications → Personal access tokens
   
   # Get site ID from site settings
   # Site settings → General → Site details → API ID
   ```

5. **Set up Slack webhook:**
   - Go to https://api.slack.com/apps
   - Create app → Incoming Webhooks
   - Add webhook to workspace
   - Copy webhook URL

6. **Set up Discord webhook:**
   - Server Settings → Integrations → Webhooks
   - Create webhook
   - Copy webhook URL

## Branch Strategy

```
main (production)
  ├─► Triggers production deployments
  ├─► Requires PR approval
  └─► Protected branch

develop (staging)
  ├─► Triggers staging deployments
  ├─► Integration branch
  └─► Auto-deploys on push

feature/* (development)
  ├─► Runs CI tests only
  └─► No automatic deployment
```

## Deployment Environments

### Staging
- **Branch:** develop
- **Vercel:** staging.alaskapay.app
- **Netlify:** staging--alaskapay.netlify.app
- **Purpose:** Testing and QA
- **Auto-deploy:** Yes

### Production
- **Branch:** main
- **Vercel:** alaskapay.app
- **Netlify:** alaskapay.netlify.app
- **Purpose:** Live application
- **Auto-deploy:** Yes (with tests)

## Notification System

### Slack Notifications
Sent for:
- ❌ CI failures
- 🔒 Security scan failures
- ✅ Successful deployments
- 🚀 Production releases

### Discord Notifications
Sent for:
- ❌ Pipeline failures
- ✅ Deployment success
- 🔒 Security alerts

## Manual Deployment

### Trigger Manual Deploy
```bash
# Go to Actions tab
# Select workflow (e.g., "Deploy to Vercel Production")
# Click "Run workflow"
# Select branch
# Click "Run workflow"
```

### Using GitHub CLI
```bash
# Install GitHub CLI
brew install gh

# Trigger production deploy
gh workflow run "Deploy to Vercel Production"

# Trigger staging deploy
gh workflow run "Deploy to Vercel Staging"
```

## Monitoring Deployments

### View Workflow Status
```bash
# List recent runs
gh run list

# View specific run
gh run view <run-id>

# Watch live run
gh run watch
```

### Deployment URLs
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Netlify Dashboard:** https://app.netlify.com
- **GitHub Actions:** https://github.com/your-org/alaskapay/actions

## Rollback Procedure

### Vercel Rollback
```bash
# Via dashboard
1. Go to Vercel dashboard
2. Select project
3. Go to Deployments
4. Find previous deployment
5. Click "..." → "Promote to Production"

# Via CLI
vercel rollback
```

### Netlify Rollback
```bash
# Via dashboard
1. Go to Netlify dashboard
2. Select site
3. Go to Deploys
4. Find previous deploy
5. Click "Publish deploy"

# Via CLI
netlify deploy --prod --dir=./previous-build
```

### Git Rollback
```bash
# Revert last commit
git revert HEAD
git push origin main

# This triggers new deployment with reverted code
```

## Performance Monitoring

### Lighthouse CI
Runs automatically on main branch pushes:
- Performance score
- Accessibility score
- Best practices score
- SEO score

### Metrics Tracked
- Build time
- Bundle size
- Test coverage
- Deployment duration
- Success rate

## Troubleshooting

### Build Failures
```bash
# Check logs in GitHub Actions
# Common issues:
- Missing environment variables
- Test failures
- Type errors
- Dependency issues
```

### Deployment Failures
```bash
# Vercel issues:
- Check VERCEL_TOKEN validity
- Verify project is linked
- Check build logs

# Netlify issues:
- Verify NETLIFY_AUTH_TOKEN
- Check site ID
- Review build settings
```

### Notification Issues
```bash
# Slack not working:
- Verify webhook URL
- Check workspace permissions

# Discord not working:
- Verify webhook URL
- Check channel permissions
```

## Best Practices

1. **Always run tests locally** before pushing
2. **Use feature branches** for development
3. **Create PR to develop** for staging testing
4. **Merge to main** only after staging verification
5. **Monitor deployments** in real-time
6. **Set up alerts** for critical failures
7. **Review security scans** weekly
8. **Keep dependencies updated**

## Quick Commands

```bash
# Run tests locally
npm run test:ci

# Check types
npm run type-check

# Lint code
npm run lint

# Build locally
npm run build

# Preview build
npm run preview
```

## Support

For issues with CI/CD pipeline:
1. Check GitHub Actions logs
2. Review this documentation
3. Check Vercel/Netlify dashboards
4. Contact DevOps team

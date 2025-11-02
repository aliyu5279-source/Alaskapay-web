# 🚀 AlaskaPay GitHub Pages - Command Line Setup

## 📋 PREREQUISITES

Before running commands, you need:
1. ✅ Admin access to GitHub repository
2. ✅ Git installed on your computer
3. ✅ Repository cloned locally
4. ✅ API keys from Supabase, Stripe, Paystack

---

## 🔧 MANUAL SETUP (GitHub Website)

### Step 1: Enable GitHub Pages
**You MUST do this in GitHub website** (no command for this):

1. Go to: `https://github.com/[YOUR-USERNAME]/[YOUR-REPO]`
2. Click **"Settings"** tab (top navigation, far right)
3. Click **"Pages"** in left sidebar (under "Code and automation")
4. Under "Source", select: **"GitHub Actions"**
5. Page auto-saves ✅

### Step 2: Add Secrets
**You MUST do this in GitHub website** (no command for this):

1. In Settings, click **"Secrets and variables"** → **"Actions"**
2. Click **"New repository secret"** for each:

```
Name: VITE_SUPABASE_URL
Value: https://your-project.supabase.co

Name: VITE_SUPABASE_ANON_KEY  
Value: your-anon-key-here

Name: VITE_STRIPE_PUBLISHABLE_KEY
Value: pk_test_or_live_key

Name: VITE_PAYSTACK_PUBLIC_KEY
Value: pk_test_or_live_key
```

---

## 💻 COMMAND LINE DEPLOYMENT

### After Manual Setup Above, Run:

```bash
# 1. Make sure you're on main branch
git checkout main

# 2. Pull latest changes
git pull origin main

# 3. Commit any pending changes
git add .
git commit -m "Enable GitHub Pages deployment"

# 4. Push to trigger deployment
git push origin main
```

### Check Deployment Status:
```bash
# Open Actions page in browser
open https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions

# Or manually go to:
# https://github.com/[username]/[repo]/actions
```

---

## 🔍 VERIFY DEPLOYMENT

### Check if Pages is Enabled:
```bash
# Open repository settings
open https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/settings/pages
```

### View Live Site:
```bash
# Your site will be at:
# https://[username].github.io/[repo-name]/

# Open in browser (replace with your values):
open https://[YOUR-USERNAME].github.io/[YOUR-REPO-NAME]/
```

---

## 🐛 TROUBLESHOOTING COMMANDS

### Check Git Remote:
```bash
git remote -v
# Should show: origin  https://github.com/[username]/[repo].git
```

### Check Current Branch:
```bash
git branch
# Should show: * main (or master)
```

### View Recent Commits:
```bash
git log --oneline -5
```

### Force Re-deploy:
```bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

---

## 📊 MONITORING COMMANDS

### Watch Deployment (requires gh CLI):
```bash
# Install GitHub CLI first: https://cli.github.com/
gh run watch
```

### List Recent Deployments:
```bash
gh run list --workflow="Deploy to GitHub Pages"
```

### View Deployment Logs:
```bash
gh run view --log
```

---

## 🔑 GET API KEYS (Open in Browser)

```bash
# Supabase Dashboard
open https://supabase.com/dashboard

# Stripe Dashboard  
open https://dashboard.stripe.com/apikeys

# Paystack Dashboard
open https://dashboard.paystack.com/#/settings/developers
```

---

## ⚠️ IMPORTANT NOTES

1. **Settings & Secrets = Manual Only**
   - GitHub doesn't provide CLI commands for these
   - Must use web interface

2. **First-Time Setup**
   - Enable Pages: Web UI only
   - Add Secrets: Web UI only
   - Deploy: Command line works

3. **Subsequent Deployments**
   - Just push to main branch
   - Automatic deployment

---

## 🎯 QUICK REFERENCE

| Task | Method |
|------|--------|
| Enable Pages | Web UI (Settings → Pages) |
| Add Secrets | Web UI (Settings → Secrets) |
| Deploy | `git push origin main` |
| Check Status | Actions tab or `gh run watch` |
| View Site | `https://[user].github.io/[repo]` |

---

## 📞 NEED HELP?

If commands don't work:
1. Check you have admin access to repo
2. Verify you're in correct directory: `pwd`
3. Confirm remote is correct: `git remote -v`
4. Ensure main branch exists: `git branch -a`

Still stuck? Share the error message!

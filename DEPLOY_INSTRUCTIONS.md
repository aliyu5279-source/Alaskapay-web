# 🚀 Alaska Pay - Automatic Deployment Guide

## Option 1: One-Click Deploy (Easiest)

Run this single command:

```bash
chmod +x deploy-now.sh && ./deploy-now.sh
```

This will automatically:
- Initialize git if needed
- Commit all changes
- Push to GitHub
- Trigger automatic Netlify deployment

---

## Option 2: Manual Git Commands

```bash
# 1. Fix detached HEAD (if needed)
git checkout -b main

# 2. Stage all files
git add .

# 3. Commit
git commit -m "Deploy Alaska Pay"

# 4. Push (triggers auto-deploy)
git push -u origin main --force
```

---

## Option 3: Direct Netlify Deploy

If GitHub isn't working, use Netlify CLI:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## Check Deployment Status

- **GitHub Actions**: https://github.com/YOUR_USERNAME/alaskamega/actions
- **Netlify Dashboard**: https://app.netlify.com/sites/alaskamega
- **Live Site**: https://alaskapay.netlify.app

---

## Troubleshooting

**"Permission denied"**: Run `chmod +x deploy-now.sh` first

**"Not a git repository"**: The script will initialize it automatically

**"Push rejected"**: Use `git push --force` or check GitHub permissions

**Still not working?**: Go to Netlify dashboard and click "Publish deploy" on draft

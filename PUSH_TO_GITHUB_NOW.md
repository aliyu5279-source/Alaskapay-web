# 🚀 Push to GitHub - Quick Commands

## Windows Users:

### Option 1: Use Batch File
```cmd
push-to-github.bat
```

### Option 2: Manual Commands
```cmd
git add .
git commit -m "fix: Vercel deployment - optimized build config"
git push origin main
```

## Mac/Linux Users:

### Option 1: Use Shell Script
```bash
chmod +x push-to-github.sh
./push-to-github.sh
```

### Option 2: Manual Commands
```bash
git add .
git commit -m "fix: Vercel deployment - optimized build config"
git push origin main
```

## If You Get Authentication Error:

### Set up GitHub Personal Access Token:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/aliyu5279-source/alaskapayment.git
```

Replace `YOUR_TOKEN` with your GitHub Personal Access Token from:
https://github.com/settings/tokens

## After Pushing:

1. ✅ Vercel will automatically detect the push
2. ✅ New deployment will start (takes 2-3 minutes)
3. ✅ Check deployment status at: https://vercel.com/aliyu5279-sources-projects/alaskapayment-mkrd
4. ✅ Site will be live at: https://alaskapayment-mkrd.vercel.app/

## Verify Deployment:

```bash
# Check if push was successful
git status

# View recent commits
git log --oneline -5
```

---
**Your Repository:** https://github.com/aliyu5279-source/alaskapayment

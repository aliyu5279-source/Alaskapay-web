# Netlify Build Fix - Package.json Not Found

## Problem
Netlify build fails with: `npm error enoent Could not read package.json`

## Root Causes
1. **Git commit issue**: package.json may not be committed to repository
2. **Build directory mismatch**: Netlify may be running in wrong directory
3. **Cache corruption**: Netlify cache may be corrupted

## Solutions Applied

### 1. Created Debug Build Script
Created `netlify-build.sh` that:
- Verifies package.json exists before building
- Shows current directory and file listing
- Provides detailed error messages if package.json is missing

### 2. Updated netlify.toml
Changed build command to use the debug script

## Manual Steps Required

### Step 1: Verify package.json is Committed
```bash
git status
git add package.json
git commit -m "Ensure package.json is committed"
git push origin main
```

### Step 2: Clear Netlify Cache
In Netlify Dashboard:
1. Go to Site Settings
2. Click "Build & Deploy"
3. Scroll to "Build settings"
4. Click "Clear cache and retry deploy"

### Step 3: Verify Build Settings
In Netlify Dashboard, ensure:
- **Base directory**: Leave empty or set to `.`
- **Build command**: `bash netlify-build.sh`
- **Publish directory**: `dist`

### Step 4: Check Repository Connection
1. Go to Site Settings > Build & Deploy > Continuous Deployment
2. Verify repository is correctly connected
3. Check branch is set to `main` or your default branch

## Alternative: Manual Build Command
If script fails, use direct command in Netlify:
```bash
npm install --legacy-peer-deps && npm run build
```

## Troubleshooting

### If package.json still not found:
```bash
# Check if file exists locally
ls -la package.json

# Verify it's tracked by git
git ls-files | grep package.json

# Force add if needed
git add -f package.json
git commit -m "Force add package.json"
git push
```

### If build works locally but not on Netlify:
1. Delete node_modules locally: `rm -rf node_modules`
2. Delete package-lock.json: `rm package-lock.json`
3. Fresh install: `npm install`
4. Commit changes: `git add . && git commit -m "Update dependencies" && git push`

## Quick Fix Command
Run this locally to ensure everything is committed:
```bash
git add package.json netlify-build.sh netlify.toml
git commit -m "Fix Netlify build - ensure package.json is accessible"
git push origin main
```

Then trigger a new deploy in Netlify.

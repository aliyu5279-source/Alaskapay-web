# Fix for QRCode Build Error

## Problem
Build fails with: `Rollup failed to resolve import "qrcode"`

## Solution

### Quick Fix (Run these commands):

```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Try building again
npm run build
```

### For Windows:
```cmd
rmdir /s /q node_modules
del package-lock.json
npm install
npm run build
```

## What Was Changed
- Updated `vite.config.ts` to properly handle the qrcode dependency
- The qrcode package is already in package.json, just needs fresh install

## If Still Failing
The issue is that node_modules may be corrupted or incomplete. A fresh install should resolve it.

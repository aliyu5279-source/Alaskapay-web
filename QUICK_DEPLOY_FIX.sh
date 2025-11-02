#!/bin/bash

# Quick Deploy Fix for Vercel Blank Page
# This script will commit and push the fix to trigger automatic Vercel deployment

echo "🔧 AlaskaPay - Quick Deploy Fix"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    echo "Please run: git init"
    exit 1
fi

echo "📝 Staging changes..."
git add src/App.tsx FIX_VERCEL_BLANK_PAGE.md QUICK_DEPLOY_FIX.sh

echo "💾 Committing fix..."
git commit -m "Fix Vercel blank page - remove BrowserRouter basename

- Removed basename='/Alaska-pay' from BrowserRouter
- This was causing blank page on Vercel deployment
- App now loads correctly at root domain
- All routes function properly"

echo ""
echo "🚀 Pushing to repository..."
git push origin main

echo ""
echo "✅ Fix deployed!"
echo ""
echo "⏱️  Vercel will automatically rebuild in ~2 minutes"
echo "🌐 Check your app at: https://alaskapayment-xh2y.vercel.app/"
echo ""
echo "📊 Monitor deployment at: https://vercel.com/dashboard"
echo ""

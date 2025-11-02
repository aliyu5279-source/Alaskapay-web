#!/bin/bash

echo "🚀 AlaskaPay - Automatic Git Push"
echo "=================================="
echo ""

# Add all changes
echo "📦 Adding all changes..."
git add .

# Commit with message
echo "💾 Committing changes..."
git commit -m "Fix: Remove BrowserRouter basename to fix Vercel blank page issue"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Changes pushed successfully!"
echo "🌐 Vercel will automatically deploy your app"
echo "🔗 Check your deployment at: https://alaskapayment-xh2y.vercel.app/"
echo ""
echo "⏱️  Deployment usually takes 1-2 minutes"
echo "🔄 Refresh your browser after deployment completes"

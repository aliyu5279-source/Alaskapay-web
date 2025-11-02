#!/bin/bash

echo "🔧 Fixing Netlify build configuration..."

# Add all changes
git add .

# Commit changes
git commit -m "Fix: Update Netlify build configuration to resolve package.json error"

# Push to GitHub
git push origin main

echo "✅ Changes pushed to GitHub!"
echo "🚀 Netlify will automatically redeploy your site"
echo ""
echo "📍 Check your deployment at: https://app.netlify.com"
echo ""
echo "Your site will be live in 2-3 minutes!"

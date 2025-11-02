#!/bin/bash

echo "🚀 Alaska Pay - Auto Deploy Script"
echo "=================================="

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git remote add origin https://github.com/YOUR_USERNAME/alaskamega.git
fi

# Get current branch or create main
BRANCH=$(git branch --show-current)
if [ -z "$BRANCH" ]; then
    echo "🔧 Creating main branch..."
    git checkout -b main
fi

# Stage all files
echo "📝 Staging files..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Deploy Alaska Pay - $(date +%Y-%m-%d-%H-%M-%S)" || echo "No changes to commit"

# Push to trigger deployment
echo "🚀 Pushing to GitHub (triggers auto-deploy)..."
git push -u origin main --force

echo ""
echo "✅ Done! Deployment triggered."
echo "📊 Check status: https://github.com/YOUR_USERNAME/alaskamega/actions"
echo "🌐 Live site: https://alaskapay.netlify.app"

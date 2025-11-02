#!/bin/bash

echo "🔧 Auto-fixing and deploying to GitHub..."
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
fi

# Add all changes
echo "📝 Adding all changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Fix: Updated Netlify configuration and auto-deploy setup" || echo "No changes to commit"

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "⚠️  No remote 'origin' found!"
    echo "Please add your GitHub repository:"
    echo "git remote add origin YOUR_GITHUB_REPO_URL"
    exit 1
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo ""
echo "✅ Successfully deployed to GitHub!"
echo ""
echo "🌐 Your Netlify site will auto-deploy from GitHub"
echo "📍 Netlify Project ID: a49be8e7-5d3e-442a-962f-42cc53fce437"
echo ""
echo "🔗 Check your deployment at:"
echo "   https://app.netlify.com/sites/YOUR_SITE_NAME/deploys"
echo ""

#!/bin/bash

echo "=== Quick Netlify Build Fix ==="
echo ""
echo "This script will:"
echo "1. Verify package.json exists"
echo "2. Ensure it's committed to git"
echo "3. Push changes to trigger new Netlify build"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json not found!"
    echo "Please ensure you're in the project root directory."
    exit 1
fi

echo "✓ package.json found"

# Check if git repo
if [ ! -d ".git" ]; then
    echo "❌ ERROR: Not a git repository"
    echo "Please run this from your project root."
    exit 1
fi

echo "✓ Git repository detected"

# Add files
echo ""
echo "Adding files to git..."
git add package.json netlify-build.sh netlify.toml NETLIFY_BUILD_FIX.md

# Check if there are changes
if git diff --staged --quiet; then
    echo "✓ No changes to commit (files already committed)"
else
    echo "Committing changes..."
    git commit -m "Fix: Ensure package.json and build scripts are committed for Netlify"
    echo "✓ Changes committed"
fi

# Push to remote
echo ""
echo "Pushing to remote repository..."
git push origin main || git push origin master

echo ""
echo "=== Done! ==="
echo ""
echo "Next steps:"
echo "1. Go to your Netlify dashboard"
echo "2. Click 'Trigger deploy' > 'Clear cache and deploy site'"
echo "3. Monitor the build logs"
echo ""
echo "If build still fails, check NETLIFY_BUILD_FIX.md for more solutions"

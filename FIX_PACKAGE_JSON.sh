#!/bin/bash

echo "=== Fixing package.json Git Issues ==="

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    exit 1
fi

echo "✓ package.json found"

# Show package.json info
echo ""
echo "=== package.json Info ==="
ls -lh package.json
echo ""

# Remove from Git cache
echo "Removing package.json from Git cache..."
git rm --cached package.json 2>/dev/null || true

# Force add
echo "Force adding package.json..."
git add -f package.json

# Check Git status
echo ""
echo "=== Git Status ==="
git status package.json

# Commit
echo ""
echo "Committing package.json..."
git commit -m "Fix: Force add package.json to repository"

# Push
echo ""
echo "Pushing to remote..."
git push origin main

echo ""
echo "=== Done! ==="
echo "Now try deploying again on Netlify or use Vercel instead"
echo ""
echo "For Vercel deployment, run: npm install -g vercel && vercel --prod"

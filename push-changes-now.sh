#!/bin/bash

echo "========================================"
echo "Pushing Changes to GitHub"
echo "========================================"
echo ""

echo "Step 1: Adding all changes..."
git add .
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to add changes"
    exit 1
fi
echo "✓ Changes added successfully"
echo ""

echo "Step 2: Committing changes..."
git commit -m "Fix: Currency display now shows Naira, increased transaction limits to 50k"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to commit changes"
    exit 1
fi
echo "✓ Changes committed successfully"
echo ""

echo "Step 3: Pushing to GitHub..."
git push origin main
if [ $? -ne 0 ]; then
    echo "Trying 'master' branch instead..."
    git push origin master
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to push changes"
        exit 1
    fi
fi
echo "✓ Changes pushed successfully"
echo ""

echo "========================================"
echo "SUCCESS! Changes pushed to GitHub"
echo "Vercel will auto-deploy in 2-3 minutes"
echo "========================================"
echo ""

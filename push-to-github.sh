#!/bin/bash

# Alaska Pay - Push to GitHub Script
# This script helps you push your project to GitHub

echo "================================"
echo "Alaska Pay - GitHub Push Helper"
echo "================================"
echo ""

# Get GitHub repository URL
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "Error: Repository URL is required!"
    exit 1
fi

echo ""
echo "Step 1: Checking for existing .git folder..."
if [ -d ".git" ]; then
    echo "Found existing .git folder."
    read -p "Do you want to remove it and start fresh? (y/n): " REMOVE_GIT
    if [ "$REMOVE_GIT" = "y" ]; then
        rm -rf .git
        echo "Removed existing .git folder."
    fi
fi

echo ""
echo "Step 2: Initializing Git repository..."
git init

echo ""
echo "Step 3: Adding all files..."
git add .

echo ""
echo "Step 4: Creating initial commit..."
git commit -m "Initial commit: Alaska Pay project"

echo ""
echo "Step 5: Connecting to GitHub repository..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

echo ""
echo "Step 6: Verifying remote connection..."
git remote -v

echo ""
echo "Step 7: Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "================================"
echo "✅ Successfully pushed to GitHub!"
echo "================================"
echo ""
echo "Your repository: $REPO_URL"
echo ""
echo "Next steps:"
echo "1. Visit your GitHub repository"
echo "2. Set up automated deployment (Netlify/Vercel)"
echo "3. Configure environment variables"
echo ""

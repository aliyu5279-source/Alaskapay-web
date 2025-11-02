#!/bin/bash

# GitHub Secrets Setup Helper Script
# This script guides you through setting up GitHub Actions secrets

echo "🚀 Alaska Pay - GitHub Actions Setup"
echo "======================================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Install it from: https://cli.github.com/"
    echo ""
    echo "Or follow manual setup in GITHUB_ACTIONS_SETUP.md"
    exit 1
fi

echo "✓ GitHub CLI detected"
echo ""

# Check if user is logged in
if ! gh auth status &> /dev/null; then
    echo "Please login to GitHub CLI:"
    gh auth login
fi

echo ""
echo "Step 1: Get your Netlify Auth Token"
echo "------------------------------------"
echo "1. Visit: https://app.netlify.com/user/applications"
echo "2. Click 'New access token'"
echo "3. Name it: 'GitHub Actions Deploy'"
echo "4. Copy the token"
echo ""
read -p "Paste your NETLIFY_AUTH_TOKEN: " NETLIFY_TOKEN

echo ""
echo "Step 2: Get your Netlify Site ID"
echo "--------------------------------"
echo "1. Visit: https://app.netlify.com/sites/alaskamega/settings"
echo "2. Copy the 'Site ID' from Site information"
echo ""
read -p "Paste your NETLIFY_SITE_ID: " NETLIFY_SITE_ID

echo ""
echo "Step 3: Adding secrets to GitHub..."
echo "------------------------------------"

# Add secrets using gh CLI
gh secret set NETLIFY_AUTH_TOKEN --body "$NETLIFY_TOKEN"
gh secret set NETLIFY_SITE_ID --body "$NETLIFY_SITE_ID"

echo ""
echo "✅ Secrets added successfully!"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'setup auto deploy'"
echo "3. git push"
echo ""
echo "Your site will auto-deploy to: https://alaskapay.netlify.app"
echo ""
echo "Monitor deployments at:"
echo "- GitHub Actions: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
echo "- Netlify: https://app.netlify.com/sites/alaskamega/deploys"

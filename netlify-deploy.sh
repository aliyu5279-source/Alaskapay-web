#!/bin/bash

# 🚀 Alaska Pay - Automated Netlify Deployment Script
# This script automates the entire Netlify deployment process

set -e  # Exit on any error

echo "🚀 Alaska Pay - Netlify Deployment Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
    echo -e "${GREEN}✅ Netlify CLI installed${NC}"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

# Run build
echo -e "${BLUE}🔨 Building Alaska Pay...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix errors and try again.${NC}"
    exit 1
fi

# Check if logged in to Netlify
echo -e "${BLUE}🔐 Checking Netlify authentication...${NC}"
netlify status &> /dev/null || {
    echo -e "${YELLOW}⚠️  Not logged in to Netlify. Opening browser...${NC}"
    netlify login
}

# Check if site is linked
if [ ! -f ".netlify/state.json" ]; then
    echo -e "${YELLOW}⚠️  Site not linked. Please link or create a new site.${NC}"
    echo ""
    echo "Choose an option:"
    echo "1) Link to existing site"
    echo "2) Create new site"
    read -p "Enter choice (1 or 2): " choice
    
    if [ "$choice" = "1" ]; then
        netlify link
    else
        netlify init
    fi
fi

# Deploy to production
echo -e "${BLUE}🚀 Deploying to Netlify...${NC}"
netlify deploy --prod --dir=dist

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo -e "✅ Deployment Successful!"
    echo -e "==========================================${NC}"
    echo ""
    echo -e "${BLUE}🌐 Your site is now live!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure environment variables in Netlify dashboard"
    echo "2. Set up custom domain (optional)"
    echo "3. Enable automatic deployments from GitHub"
    echo ""
    netlify open
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

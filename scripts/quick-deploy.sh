#!/bin/bash

# Alaska Pay - Quick Deploy Script
# This script automates the deployment process

set -e

echo "🚀 Alaska Pay - Quick Deploy"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please create a .env file with your environment variables"
    echo "See .env.example for reference"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install --legacy-peer-deps
fi

# Build the project
echo -e "${BLUE}🔨 Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Check deployment method
echo "Choose deployment method:"
echo "1) Netlify CLI (requires netlify-cli installed)"
echo "2) Git push (triggers GitHub Actions)"
echo "3) Manual (just build, I'll deploy manually)"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}🌐 Deploying to Netlify...${NC}"
        
        # Check if netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo -e "${YELLOW}Installing Netlify CLI...${NC}"
            npm install -g netlify-cli
        fi
        
        # Deploy
        netlify deploy --prod --dir=dist
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Deployed successfully to Netlify!${NC}"
        else
            echo -e "${RED}❌ Deployment failed${NC}"
            exit 1
        fi
        ;;
    2)
        echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
        
        # Check if git is initialized
        if [ ! -d .git ]; then
            echo -e "${YELLOW}Initializing git repository...${NC}"
            git init
            git branch -M main
        fi
        
        # Add and commit
        git add .
        git commit -m "Deploy Alaska Pay - $(date +%Y-%m-%d-%H-%M-%S)" || echo "No changes to commit"
        
        # Push
        git push origin main
        
        echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
        echo "GitHub Actions will deploy automatically"
        echo "Check status: https://github.com/YOUR_USERNAME/alaskamega/actions"
        ;;
    3)
        echo -e "${GREEN}✅ Build complete!${NC}"
        echo "Your build is in the 'dist' folder"
        echo "You can now deploy manually to your hosting provider"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment process complete!${NC}"
echo ""
echo "📊 Useful links:"
echo "- Netlify Dashboard: https://app.netlify.com/sites/alaskamega"
echo "- GitHub Actions: https://github.com/YOUR_USERNAME/alaskamega/actions"
echo "- Live Site: https://alaskapay.netlify.app"

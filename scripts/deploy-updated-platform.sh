#!/bin/bash

# Alaska Pay - Updated Platform Deployment Script
# Includes backup system and comprehensive checks

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔════════════════════════════════════════╗"
echo "║   Alaska Pay - Platform Deployment    ║"
echo "║   With Backup & Recovery System       ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Pre-flight checks
echo -e "${BLUE}🔍 Running pre-flight checks...${NC}"

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ required. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version OK${NC}"

# Check .env file
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file missing${NC}"
    echo "Copy .env.example to .env and configure"
    exit 1
fi
echo -e "${GREEN}✓ Environment file found${NC}"

# Check required env variables
REQUIRED_VARS=("VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY")
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env; then
        echo -e "${RED}❌ Missing ${var} in .env${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✓ Required environment variables present${NC}"

# Install dependencies
if [ ! -d node_modules ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install --legacy-peer-deps
else
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

# Run linting
echo -e "${BLUE}🔍 Linting code...${NC}"
npm run lint || echo -e "${YELLOW}⚠ Linting warnings (non-blocking)${NC}"

# Build project
echo -e "${BLUE}🔨 Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"

# Deployment options
echo ""
echo -e "${CYAN}Choose deployment method:${NC}"
echo "1) 🚀 Netlify CLI (instant deploy)"
echo "2) 📤 Git Push (GitHub Actions)"
echo "3) 🔧 Manual (build only)"
echo "4) 🧪 Preview Deploy (test before production)"
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo -e "${BLUE}🌐 Deploying to Netlify Production...${NC}"
        
        if ! command -v netlify &> /dev/null; then
            echo -e "${YELLOW}Installing Netlify CLI...${NC}"
            npm install -g netlify-cli
        fi
        
        netlify deploy --prod --dir=dist
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Deployed successfully!${NC}"
            echo -e "${CYAN}🌐 Live at: https://alaskapay.netlify.app${NC}"
        fi
        ;;
    2)
        echo -e "${BLUE}📤 Committing and pushing to GitHub...${NC}"
        
        git add .
        COMMIT_MSG="Deploy Alaska Pay v$(date +%Y.%m.%d-%H%M) - Backup System Included"
        git commit -m "$COMMIT_MSG" || echo "No changes to commit"
        git push origin main
        
        echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
        echo -e "${CYAN}Monitor: https://github.com/YOUR_USERNAME/alaskamega/actions${NC}"
        ;;
    3)
        echo -e "${GREEN}✅ Build complete!${NC}"
        echo "Build output: ./dist"
        ;;
    4)
        echo -e "${BLUE}🧪 Creating preview deployment...${NC}"
        
        if ! command -v netlify &> /dev/null; then
            npm install -g netlify-cli
        fi
        
        netlify deploy --dir=dist
        echo -e "${GREEN}✅ Preview deployed!${NC}"
        ;;
esac

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Deployment Complete! 🎉            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📊 Quick Links:${NC}"
echo "• Live Site: https://alaskapay.netlify.app"
echo "• Netlify: https://app.netlify.com/sites/alaskamega"
echo "• GitHub: https://github.com/YOUR_USERNAME/alaskamega"
echo ""
echo -e "${YELLOW}🗄️ Don't forget to:${NC}"
echo "1. Apply database migrations in Supabase"
echo "2. Configure backup schedules in admin panel"
echo "3. Test backup and restore functionality"
echo "4. Set up retention policies"

#!/bin/bash

# Alaska Pay - Instant Deploy Script
# Run this script to deploy in under 2 minutes!

echo "🚀 Alaska Pay - Instant Deployment Script"
echo "========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js detected: $(node -v)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm detected: $(npm -v)${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm i -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo -e "${YELLOW}Follow the prompts to complete deployment:${NC}"
echo "  1. Setup and deploy? → Y"
echo "  2. Select your scope"
echo "  3. Link to existing project? → N (for new deployment)"
echo "  4. Project name? → alaska-pay (or your choice)"
echo "  5. Directory? → ./"
echo "  6. Override settings? → N"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Go to your Vercel dashboard"
    echo "2. Add environment variables:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo "3. Redeploy: vercel --prod"
    echo ""
    echo "📖 See INSTANT_DEPLOY.md for detailed instructions"
    echo ""
    echo -e "${GREEN}Your app is now live! 🚀${NC}"
else
    echo -e "${RED}❌ Deployment failed. Please check the errors above.${NC}"
    exit 1
fi
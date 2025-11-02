#!/bin/bash

# Setup script for Environment Sync CLI

set -e

echo "🚀 Setting up Environment Sync CLI..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Install CLI dependencies
echo -e "${BLUE}📦 Installing CLI dependencies...${NC}"
cd cli
npm install
npm link
cd ..

# Create config file if it doesn't exist
if [ ! -f ".env-sync-config.json" ]; then
    echo -e "${YELLOW}⚠️  Creating config file from example...${NC}"
    cp .env-sync-config.example.json .env-sync-config.json
    echo -e "${YELLOW}⚠️  Please update .env-sync-config.json with your credentials${NC}"
fi

# Create environment files if they don't exist
if [ ! -f ".env.production" ]; then
    echo -e "${BLUE}📝 Creating .env.production...${NC}"
    touch .env.production
fi

if [ ! -f ".env.test" ]; then
    echo -e "${BLUE}📝 Creating .env.test...${NC}"
    touch .env.test
fi

# Create directories
mkdir -p .env-backups
mkdir -p .env-versions

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update .env-sync-config.json with your credentials"
echo "2. Add variables to .env.production and .env.test"
echo "3. Run: env-sync sync --env production"
echo ""
echo -e "${BLUE}Available commands:${NC}"
echo "  env-sync sync          - Sync to all platforms"
echo "  env-sync pull netlify  - Pull from Netlify"
echo "  env-sync encrypt       - Encrypt variables"
echo "  env-sync version       - Manage versions"
echo "  env-sync switch        - Switch environments"
echo ""

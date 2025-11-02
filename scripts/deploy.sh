#!/bin/bash

# Alaska Pay - Automated Deployment Script
# Usage: ./scripts/deploy.sh [platform] [environment]
# Example: ./scripts/deploy.sh ios beta

set -e

PLATFORM=$1
ENVIRONMENT=$2

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Alaska Pay Deployment Script${NC}"
echo "=================================="

# Validate inputs
if [ -z "$PLATFORM" ] || [ -z "$ENVIRONMENT" ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo "Usage: ./scripts/deploy.sh [platform] [environment]"
    echo "Platforms: ios, android, both"
    echo "Environments: beta, production, screenshots, metadata"
    exit 1
fi

# Build web app
echo -e "${YELLOW}📦 Building web app...${NC}"
npm run build

# Deploy iOS
if [ "$PLATFORM" == "ios" ] || [ "$PLATFORM" == "both" ]; then
    echo -e "${YELLOW}🍎 Deploying iOS to $ENVIRONMENT...${NC}"
    npx cap sync ios
    cd ios/App
    
    case $ENVIRONMENT in
        beta)
            fastlane beta
            ;;
        production)
            fastlane release
            ;;
        screenshots)
            fastlane screenshots
            ;;
        metadata)
            fastlane metadata
            ;;
        *)
            echo -e "${RED}Invalid environment: $ENVIRONMENT${NC}"
            exit 1
            ;;
    esac
    
    cd ../..
    echo -e "${GREEN}✅ iOS deployment complete${NC}"
fi

# Deploy Android
if [ "$PLATFORM" == "android" ] || [ "$PLATFORM" == "both" ]; then
    echo -e "${YELLOW}🤖 Deploying Android to $ENVIRONMENT...${NC}"
    npx cap sync android
    cd android
    
    case $ENVIRONMENT in
        beta)
            fastlane beta
            ;;
        production)
            fastlane production
            ;;
        screenshots)
            fastlane screenshots
            ;;
        metadata)
            fastlane metadata
            ;;
        *)
            echo -e "${RED}Invalid environment: $ENVIRONMENT${NC}"
            exit 1
            ;;
    esac
    
    cd ..
    echo -e "${GREEN}✅ Android deployment complete${NC}"
fi

echo -e "${GREEN}🎉 Deployment successful!${NC}"

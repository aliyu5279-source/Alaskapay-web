#!/bin/bash

# AlaskaPay - Easy Mobile Deployment Script
# Automated deployment to iOS and Android

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   📱 AlaskaPay Mobile Deployment     ║"
echo "╔═══════════════════════════════════════╗"
echo -e "${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Main menu
echo ""
echo -e "${GREEN}Choose deployment option:${NC}"
echo "1) 🍎 iOS (App Store / TestFlight)"
echo "2) 🤖 Android (Google Play)"
echo "3) 📱 Both platforms"
echo "4) 🔧 Setup only (first time)"
echo "5) 🎨 Generate app icons"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo -e "${BLUE}🍎 Building for iOS...${NC}"
        npm run build
        npx cap sync ios
        echo -e "${GREEN}✅ Opening Xcode...${NC}"
        echo ""
        echo "Next steps in Xcode:"
        echo "1. Select your team (Signing & Capabilities)"
        echo "2. Select 'Any iOS Device (arm64)'"
        echo "3. Product → Archive"
        echo "4. Distribute App → TestFlight & App Store"
        npx cap open ios
        ;;
    
    2)
        echo -e "${BLUE}🤖 Building for Android...${NC}"
        npm run build
        npx cap sync android
        
        # Check if signing key exists
        if [ ! -f "alaskapay-release.keystore" ]; then
            echo -e "${YELLOW}⚠️  No signing key found!${NC}"
            read -p "Generate signing key now? (y/n): " gen_key
            if [ "$gen_key" = "y" ]; then
                echo "Creating signing key..."
                keytool -genkey -v -keystore alaskapay-release.keystore \
                  -alias alaskapay -keyalg RSA -keysize 2048 -validity 10000
                echo -e "${GREEN}✅ Signing key created!${NC}"
                echo "⚠️  IMPORTANT: Save your password and backup this file!"
            fi
        fi
        
        echo -e "${BLUE}Building release AAB...${NC}"
        cd android
        ./gradlew bundleRelease
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ Android build complete!${NC}"
        echo ""
        echo "📦 Release file location:"
        echo "android/app/build/outputs/bundle/release/app-release.aab"
        echo ""
        echo "Next steps:"
        echo "1. Go to play.google.com/console"
        echo "2. Create new app or select existing"
        echo "3. Go to Internal Testing → Create Release"
        echo "4. Upload app-release.aab"
        echo "5. Review and start rollout"
        ;;
    
    3)
        echo -e "${BLUE}📱 Building for both platforms...${NC}"
        npm run build
        npx cap sync
        
        echo -e "${GREEN}Opening iOS in Xcode...${NC}"
        npx cap open ios &
        
        echo -e "${BLUE}Building Android release...${NC}"
        cd android
        ./gradlew bundleRelease
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ Both platforms ready!${NC}"
        echo ""
        echo "iOS: Follow steps in Xcode"
        echo "Android: Upload android/app/build/outputs/bundle/release/app-release.aab"
        ;;
    
    4)
        echo -e "${BLUE}🔧 Setting up mobile platforms...${NC}"
        npm install
        
        # Check if platforms exist
        if [ ! -d "ios" ]; then
            echo "Adding iOS platform..."
            npx cap add ios
        fi
        
        if [ ! -d "android" ]; then
            echo "Adding Android platform..."
            npx cap add android
        fi
        
        npm run build
        npx cap sync
        
        echo -e "${GREEN}✅ Setup complete!${NC}"
        echo ""
        echo "Next: Run this script again and choose option 1, 2, or 3"
        ;;
    
    5)
        echo -e "${BLUE}🎨 Generating app icons...${NC}"
        
        if [ ! -d "resources" ]; then
            mkdir -p resources
            echo "Created resources/ directory"
        fi
        
        echo ""
        echo "Place these files in resources/ directory:"
        echo "  - icon.png (1024x1024)"
        echo "  - splash.png (2732x2732)"
        echo ""
        read -p "Files ready? Press enter to generate..."
        
        npm install -D @capacitor/assets
        npx @capacitor/assets generate --iconBackgroundColor '#0EA5E9' --splashBackgroundColor '#0EA5E9'
        
        echo -e "${GREEN}✅ Icons generated!${NC}"
        ;;
    
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Deployment process complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "📚 For detailed guides, see:"
echo "  - EASY_DEPLOY_MOBILE.md (step-by-step)"
echo "  - TESTFLIGHT_SETUP.md (iOS details)"
echo "  - PLAY_STORE_INTERNAL_TESTING.md (Android details)"
echo ""

#!/bin/bash

# 🍎 iOS Deployment Setup Script
# Automates the setup of iOS deployment with Fastlane and App Store Connect

set -e

echo "🍎 Alaska Pay - iOS Deployment Setup"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo -e "${RED}❌ This script must run on macOS${NC}"
  exit 1
fi

# Check for Xcode
if ! command -v xcodebuild &> /dev/null; then
  echo -e "${RED}❌ Xcode not found. Please install Xcode from the App Store${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Xcode found${NC}"

# Check for Ruby
if ! command -v ruby &> /dev/null; then
  echo -e "${RED}❌ Ruby not found${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Ruby found: $(ruby --version)${NC}"

# Install Bundler
if ! command -v bundle &> /dev/null; then
  echo -e "${YELLOW}📦 Installing Bundler...${NC}"
  gem install bundler
fi

# Navigate to iOS directory
cd ios/App

# Create Gemfile if not exists
if [ ! -f "Gemfile" ]; then
  echo -e "${YELLOW}📝 Creating Gemfile...${NC}"
  cat > Gemfile << 'EOF'
source "https://rubygems.org"

gem "fastlane"
gem "cocoapods"
EOF
fi

# Install Fastlane
echo -e "${YELLOW}📦 Installing Fastlane...${NC}"
bundle install

echo ""
echo -e "${BLUE}🔑 App Store Connect API Setup${NC}"
echo "================================"
echo ""
echo "You need to create an API key in App Store Connect:"
echo "1. Go to https://appstoreconnect.apple.com"
echo "2. Users and Access → Keys → Generate API Key"
echo "3. Download the .p8 file"
echo ""

read -p "Have you created the API key? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}⚠️  Please create the API key first${NC}"
  exit 1
fi

# Get API Key details
echo ""
read -p "Enter API Key ID (e.g., ABC123XYZ): " KEY_ID
read -p "Enter Issuer ID (UUID format): " ISSUER_ID
read -p "Enter path to .p8 file: " P8_FILE

if [ ! -f "$P8_FILE" ]; then
  echo -e "${RED}❌ .p8 file not found${NC}"
  exit 1
fi

# Save API key
mkdir -p ~/.appstoreconnect/private_keys
cp "$P8_FILE" ~/.appstoreconnect/private_keys/AuthKey_${KEY_ID}.p8
chmod 600 ~/.appstoreconnect/private_keys/AuthKey_${KEY_ID}.p8

echo -e "${GREEN}✅ API key saved${NC}"

# Get Apple ID credentials
echo ""
echo -e "${BLUE}🍎 Apple ID Credentials${NC}"
echo "======================="
echo ""
read -p "Enter Apple ID email: " APPLE_ID
echo "Generate app-specific password at: https://appleid.apple.com"
read -sp "Enter app-specific password: " APP_PASSWORD
echo ""

# Setup Match
echo ""
echo -e "${BLUE}🔐 Code Signing Setup${NC}"
echo "===================="
echo ""
echo "Choose code signing method:"
echo "1) Fastlane Match (Recommended)"
echo "2) Manual certificates"
read -p "Enter choice (1 or 2): " SIGNING_CHOICE

if [ "$SIGNING_CHOICE" == "1" ]; then
  echo ""
  echo "Match requires a private Git repository to store certificates"
  read -p "Enter Git URL (e.g., git@github.com:yourorg/certificates.git): " MATCH_GIT_URL
  read -sp "Enter password to encrypt certificates: " MATCH_PASSWORD
  echo ""
  
  # Initialize Match
  bundle exec fastlane match init
  
  # Update Matchfile
  cat > fastlane/Matchfile << EOF
git_url("${MATCH_GIT_URL}")
storage_mode("git")
type("appstore")
app_identifier(["com.alaskapay.app"])
username("${APPLE_ID}")
EOF
  
  echo -e "${GREEN}✅ Match configured${NC}"
  echo ""
  echo "Run this command to generate certificates:"
  echo "cd ios/App && bundle exec fastlane match appstore"
fi

# Create .env file for local development
cat > .env << EOF
APPLE_ID=${APPLE_ID}
APP_STORE_KEY_ID=${KEY_ID}
APP_STORE_ISSUER_ID=${ISSUER_ID}
MATCH_PASSWORD=${MATCH_PASSWORD}
EOF

chmod 600 .env

echo ""
echo -e "${GREEN}✅ Local environment configured${NC}"

# GitHub Secrets instructions
echo ""
echo -e "${BLUE}📝 GitHub Secrets Setup${NC}"
echo "======================"
echo ""
echo "Add these secrets to your GitHub repository:"
echo "(Settings → Secrets and variables → Actions → New repository secret)"
echo ""
echo -e "${YELLOW}APP_STORE_CONNECT_API_KEY${NC}"
echo "Content of the .p8 file:"
cat ~/.appstoreconnect/private_keys/AuthKey_${KEY_ID}.p8
echo ""
echo -e "${YELLOW}APP_STORE_KEY_ID${NC}"
echo "$KEY_ID"
echo ""
echo -e "${YELLOW}APP_STORE_ISSUER_ID${NC}"
echo "$ISSUER_ID"
echo ""
echo -e "${YELLOW}APPLE_ID${NC}"
echo "$APPLE_ID"
echo ""
echo -e "${YELLOW}APPLE_APP_SPECIFIC_PASSWORD${NC}"
echo "$APP_PASSWORD"
echo ""

if [ "$SIGNING_CHOICE" == "1" ]; then
  echo -e "${YELLOW}MATCH_PASSWORD${NC}"
  echo "$MATCH_PASSWORD"
  echo ""
  echo -e "${YELLOW}MATCH_GIT_URL${NC}"
  echo "$MATCH_GIT_URL"
  echo ""
fi

# Test Fastlane
echo ""
echo -e "${BLUE}🧪 Testing Fastlane${NC}"
echo "=================="
echo ""
bundle exec fastlane --version

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Add the secrets to GitHub (shown above)"
echo "2. Build your app: npm run build && npx cap sync ios"
echo "3. Deploy to TestFlight: cd ios/App && bundle exec fastlane beta"
echo ""
echo "Or use GitHub Actions:"
echo "- Go to Actions → Deploy iOS to App Store → Run workflow"
echo ""
echo "See AUTO_DEPLOY_IOS_APPSTORE.md for full documentation"

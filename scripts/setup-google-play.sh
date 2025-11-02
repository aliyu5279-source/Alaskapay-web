#!/bin/bash

# AlaskaPay - Google Play Store Deployment Setup Script
# This script automates the setup process for Google Play deployment

set -e

echo "🚀 AlaskaPay - Google Play Deployment Setup"
echo "==========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    BASE64_CMD="base64"
else
    BASE64_CMD="base64 -w 0"
fi

echo "📋 Step 1: Generate Android Keystore"
echo "======================================"

if [ -f "alaska-pay.keystore" ]; then
    echo -e "${YELLOW}⚠️  Keystore already exists. Skipping generation.${NC}"
else
    echo "Generating new keystore..."
    keytool -genkey -v -keystore alaska-pay.keystore \
        -alias alaska-pay -keyalg RSA -keysize 2048 -validity 10000
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Keystore generated successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to generate keystore${NC}"
        exit 1
    fi
fi

echo ""
echo "🔐 Step 2: Encode Keystore to Base64"
echo "======================================"

$BASE64_CMD alaska-pay.keystore > keystore-base64.txt
echo -e "${GREEN}✅ Keystore encoded to keystore-base64.txt${NC}"

echo ""
echo "📝 Step 3: Setup Instructions"
echo "======================================"
echo ""
echo "Please complete these manual steps:"
echo ""
echo "1️⃣  Create Service Account in Google Cloud Console:"
echo "   → https://console.cloud.google.com"
echo "   → IAM & Admin → Service Accounts → Create"
echo "   → Download JSON key"
echo ""
echo "2️⃣  Link Service Account in Play Console:"
echo "   → https://play.google.com/console"
echo "   → Setup → API access → Link service account"
echo "   → Grant 'Admin' permissions"
echo ""
echo "3️⃣  Add these secrets to GitHub:"
echo "   → Repo Settings → Secrets → Actions"
echo ""
echo "   PLAY_STORE_JSON_KEY:"
echo "   → Paste full JSON content from service account key"
echo ""
echo "   ANDROID_KEYSTORE_BASE64:"
cat keystore-base64.txt
echo ""
echo ""
echo "   ANDROID_KEYSTORE_PASSWORD:"
echo "   → The password you just entered for keystore"
echo ""
echo "   ANDROID_KEY_ALIAS: alaska-pay"
echo ""
echo "   ANDROID_KEY_PASSWORD:"
echo "   → Same as ANDROID_KEYSTORE_PASSWORD"
echo ""
echo "4️⃣  Deploy via GitHub Actions:"
echo "   → Actions → 'Deploy Android to Play Store'"
echo "   → Run workflow → Select 'internal'"
echo ""
echo -e "${GREEN}✅ Setup files ready! Follow steps above to complete.${NC}"

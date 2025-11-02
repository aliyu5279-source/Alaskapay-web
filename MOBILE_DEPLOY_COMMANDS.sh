#!/bin/bash

# Alaska Pay - Mobile Deployment Commands
# Quick reference for all mobile build and deployment commands

echo "📱 Alaska Pay - Mobile Deployment Commands"
echo "==========================================="
echo ""

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

show_section() {
    echo -e "${GREEN}$1${NC}"
    echo "-------------------------------------------"
}

# SETUP COMMANDS
show_section "🔧 INITIAL SETUP"
echo "# Install dependencies"
echo "npm install"
echo ""
echo "# Add Capacitor platforms"
echo "npm install @capacitor/ios @capacitor/android"
echo "npx cap add ios"
echo "npx cap add android"
echo ""
echo "# Install Capacitor Assets (for icons/splash)"
echo "npm install -D @capacitor/assets"
echo ""

# BUILD COMMANDS
show_section "🏗️  BUILD COMMANDS"
echo "# Build web assets"
echo "npm run build"
echo ""
echo "# Sync web assets to native platforms"
echo "npx cap sync"
echo ""
echo "# Sync to specific platform"
echo "npx cap sync ios"
echo "npx cap sync android"
echo ""

# ICON & SPLASH GENERATION
show_section "🎨 ICONS & SPLASH SCREENS"
echo "# Create resources directory"
echo "mkdir -p resources"
echo ""
echo "# Add source images:"
echo "# - resources/icon.png (1024x1024)"
echo "# - resources/splash.png (2732x2732)"
echo ""
echo "# Generate all sizes"
echo "npx @capacitor/assets generate --iconBackgroundColor '#0EA5E9' --splashBackgroundColor '#0EA5E9'"
echo ""

# iOS COMMANDS
show_section "🍎 iOS COMMANDS"
echo "# Open iOS project in Xcode"
echo "npx cap open ios"
echo ""
echo "# Run on iOS simulator"
echo "npx cap run ios"
echo ""
echo "# Run with live reload"
echo "npx cap run ios --livereload --external"
echo ""
echo "# Install iOS dependencies"
echo "cd ios/App && pod install && cd ../.."
echo ""
echo "# Clean iOS build"
echo "cd ios/App"
echo "rm -rf Pods Podfile.lock DerivedData"
echo "pod install"
echo "cd ../.."
echo ""
echo "# Build for TestFlight (in Xcode)"
echo "# 1. Select 'Any iOS Device (arm64)'"
echo "# 2. Product → Archive"
echo "# 3. Distribute App → TestFlight & App Store"
echo ""

# ANDROID COMMANDS
show_section "🤖 ANDROID COMMANDS"
echo "# Open Android project in Android Studio"
echo "npx cap open android"
echo ""
echo "# Run on Android emulator"
echo "npx cap run android"
echo ""
echo "# Run with live reload"
echo "npx cap run android --livereload --external"
echo ""
echo "# Clean Android build"
echo "cd android && ./gradlew clean && cd .."
echo ""
echo "# Build debug APK"
echo "cd android && ./gradlew assembleDebug && cd .."
echo ""
echo "# Build release AAB"
echo "cd android && ./gradlew bundleRelease && cd .."
echo ""
echo "# Install APK on connected device"
echo "adb install android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "# View Android logs"
echo "adb logcat | grep AlaskaPay"
echo ""

# SIGNING COMMANDS
show_section "🔐 SIGNING COMMANDS"
echo "# Generate Android signing key"
echo "keytool -genkey -v -keystore alaskapay-release.keystore \\"
echo "  -alias alaskapay -keyalg RSA -keysize 2048 -validity 10000"
echo ""
echo "# Create key.properties file"
echo "cat > android/key.properties << EOF"
echo "storePassword=YOUR_PASSWORD"
echo "keyPassword=YOUR_PASSWORD"
echo "keyAlias=alaskapay"
echo "storeFile=/path/to/alaskapay-release.keystore"
echo "EOF"
echo ""

# TESTING COMMANDS
show_section "🧪 TESTING COMMANDS"
echo "# List iOS simulators"
echo "xcrun simctl list devices"
echo ""
echo "# List Android emulators"
echo "emulator -list-avds"
echo ""
echo "# Start Android emulator"
echo "emulator -avd Pixel_5_API_33"
echo ""
echo "# List connected Android devices"
echo "adb devices"
echo ""

# DEBUGGING COMMANDS
show_section "🔍 DEBUGGING COMMANDS"
echo "# iOS Safari Web Inspector"
echo "# Safari → Develop → [Device Name] → [App]"
echo ""
echo "# Android Chrome DevTools"
echo "# Chrome → chrome://inspect → Select device"
echo ""
echo "# View iOS logs (Xcode)"
echo "# View → Debug Area → Show Debug Area"
echo ""
echo "# View Android logs"
echo "adb logcat"
echo ""

# UPDATE COMMANDS
show_section "🔄 UPDATE WORKFLOW"
echo "# After making changes to web code:"
echo "npm run build"
echo "npx cap sync"
echo ""
echo "# After making changes to native code:"
echo "# iOS: Just rebuild in Xcode"
echo "# Android: Just rebuild in Android Studio"
echo ""

# DEPLOYMENT COMMANDS
show_section "🚀 DEPLOYMENT WORKFLOW"
echo "# iOS - TestFlight"
echo "1. npm run build"
echo "2. npx cap sync ios"
echo "3. npx cap open ios"
echo "4. Update version/build number"
echo "5. Product → Archive"
echo "6. Distribute to TestFlight"
echo ""
echo "# Android - Internal Testing"
echo "1. npm run build"
echo "2. npx cap sync android"
echo "3. Update versionCode/versionName in build.gradle"
echo "4. cd android && ./gradlew bundleRelease"
echo "5. Upload AAB to Play Console"
echo ""

# TROUBLESHOOTING
show_section "🐛 TROUBLESHOOTING"
echo "# iOS build fails"
echo "cd ios/App"
echo "rm -rf Pods Podfile.lock ~/Library/Developer/Xcode/DerivedData"
echo "pod install --repo-update"
echo "cd ../.."
echo ""
echo "# Android build fails"
echo "cd android"
echo "./gradlew clean"
echo "./gradlew --stop"
echo "cd .."
echo ""
echo "# Clear all caches"
echo "npm run build"
echo "npx cap sync"
echo "# Then clean native projects as above"
echo ""

# USEFUL PATHS
show_section "📁 IMPORTANT PATHS"
echo "# Web build output"
echo "dist/"
echo ""
echo "# iOS project"
echo "ios/App/App.xcodeproj"
echo ""
echo "# Android project"
echo "android/"
echo ""
echo "# Capacitor config"
echo "capacitor.config.ts"
echo ""
echo "# iOS app icons"
echo "ios/App/App/Assets.xcassets/AppIcon.appiconset/"
echo ""
echo "# Android app icons"
echo "android/app/src/main/res/mipmap-*/"
echo ""
echo "# Android release AAB"
echo "android/app/build/outputs/bundle/release/app-release.aab"
echo ""

# PACKAGE.JSON SCRIPTS
show_section "📦 RECOMMENDED PACKAGE.JSON SCRIPTS"
echo "Add these to your package.json:"
echo ""
echo '"scripts": {'
echo '  "mobile:setup": "npx cap add ios && npx cap add android",'
echo '  "mobile:sync": "npm run build && npx cap sync",'
echo '  "mobile:ios": "npx cap open ios",'
echo '  "mobile:android": "npx cap open android",'
echo '  "mobile:run:ios": "npx cap run ios",'
echo '  "mobile:run:android": "npx cap run android",'
echo '  "mobile:build": "npm run build && npx cap sync",'
echo '  "icons": "npx @capacitor/assets generate"'
echo '}'
echo ""

# DOCUMENTATION
show_section "📚 DOCUMENTATION"
echo "MOBILE_TESTING_COMPLETE.md - Complete setup guide"
echo "ICON_SPLASH_SETUP.md - Icon and splash screen guide"
echo "TESTFLIGHT_SETUP.md - iOS TestFlight deployment"
echo "PLAY_STORE_INTERNAL_TESTING.md - Android deployment"
echo "MOBILE_TESTING_ROADMAP.md - Testing checklist"
echo ""

echo "==========================================="
echo -e "${GREEN}✅ Ready to build native mobile apps!${NC}"
echo ""
echo "Quick start:"
echo -e "${BLUE}bash scripts/build-native.sh${NC}"
echo ""

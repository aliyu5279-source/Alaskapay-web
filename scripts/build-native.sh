#!/bin/bash

# Alaska Pay - Native Mobile App Build Script
# This script automates the build process for iOS and Android apps

set -e  # Exit on error

echo "🚀 Alaska Pay - Native Mobile App Builder"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Step 1: Install dependencies
print_info "Step 1/7: Installing dependencies..."
npm install
print_success "Dependencies installed"
echo ""

# Step 2: Install Capacitor platforms if not already installed
print_info "Step 2/7: Checking Capacitor platforms..."
if [ ! -d "ios" ]; then
    print_info "Adding iOS platform..."
    npm install @capacitor/ios
    npx cap add ios
    print_success "iOS platform added"
else
    print_success "iOS platform already exists"
fi

if [ ! -d "android" ]; then
    print_info "Adding Android platform..."
    npm install @capacitor/android
    npx cap add android
    print_success "Android platform added"
else
    print_success "Android platform already exists"
fi
echo ""

# Step 3: Build web assets
print_info "Step 3/7: Building web assets..."
npm run build
print_success "Web assets built"
echo ""

# Step 4: Sync to native platforms
print_info "Step 4/7: Syncing to native platforms..."
npx cap sync
print_success "Synced to native platforms"
echo ""

# Step 5: iOS Setup
print_info "Step 5/7: Setting up iOS..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v pod &> /dev/null; then
        cd ios/App
        print_info "Installing iOS pods..."
        pod install
        cd ../..
        print_success "iOS pods installed"
    else
        print_warning "CocoaPods not found. Install with: sudo gem install cocoapods"
    fi
    
    if command -v xcodebuild &> /dev/null; then
        print_success "Xcode is installed"
        print_info "To open iOS project: npx cap open ios"
    else
        print_warning "Xcode not found. Install from App Store for iOS development"
    fi
else
    print_warning "iOS development requires macOS"
fi
echo ""

# Step 6: Android Setup
print_info "Step 6/7: Setting up Android..."
if [ -d "android" ]; then
    print_success "Android project ready"
    print_info "To open Android project: npx cap open android"
    
    # Check for Android Studio
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if [ -d "/Applications/Android Studio.app" ]; then
            print_success "Android Studio is installed"
        else
            print_warning "Android Studio not found. Download from: https://developer.android.com/studio"
        fi
    fi
fi
echo ""

# Step 7: Generate app icons and splash screens
print_info "Step 7/7: Checking app resources..."
if [ ! -d "resources" ]; then
    print_warning "Resources directory not found"
    print_info "Creating resources directory..."
    mkdir -p resources
    print_info "Please add:"
    print_info "  - resources/icon.png (1024x1024)"
    print_info "  - resources/splash.png (2732x2732)"
    print_info "Then run: npx capacitor-assets generate"
else
    if [ -f "resources/icon.png" ] && [ -f "resources/splash.png" ]; then
        print_success "Resource files found"
        if command -v npx &> /dev/null; then
            print_info "Generating app icons and splash screens..."
            npx @capacitor/assets generate --iconBackgroundColor '#0EA5E9' --splashBackgroundColor '#0EA5E9' 2>/dev/null || {
                print_warning "Install @capacitor/assets to generate icons: npm install -D @capacitor/assets"
            }
        fi
    else
        print_warning "Missing resource files (icon.png or splash.png)"
    fi
fi
echo ""

# Summary
echo "=========================================="
print_success "Build setup complete! 🎉"
echo ""
echo "📱 Next Steps:"
echo ""
echo "For iOS Development:"
echo "  1. Open Xcode: ${BLUE}npx cap open ios${NC}"
echo "  2. Select your team in Signing & Capabilities"
echo "  3. Run on simulator or device"
echo ""
echo "For Android Development:"
echo "  1. Open Android Studio: ${BLUE}npx cap open android${NC}"
echo "  2. Add google-services.json for Firebase"
echo "  3. Run on emulator or device"
echo ""
echo "Quick Commands:"
echo "  - Run iOS: ${BLUE}npx cap run ios${NC}"
echo "  - Run Android: ${BLUE}npx cap run android${NC}"
echo "  - Sync changes: ${BLUE}npm run build && npx cap sync${NC}"
echo ""
echo "📚 Full guide: MOBILE_TESTING_COMPLETE.md"
echo "=========================================="

# 📱 Mobile App Build & Testing Guide

## 🚀 Quick Start (Complete Setup)

```bash
# 1. Install all dependencies
npm install

# 2. Add Capacitor platforms
npm install @capacitor/ios @capacitor/android

# 3. Build web assets
npm run build

# 4. Add native platforms
npx cap add ios
npx cap add android

# 5. Sync web assets to native
npx cap sync

# 6. Open in IDEs
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

## 📋 Prerequisites

### macOS (for iOS development)
- Xcode 15+ (from App Store)
- CocoaPods: `sudo gem install cocoapods`
- iOS Simulator (included with Xcode)
- Apple Developer Account ($99/year for distribution)

### Windows/macOS/Linux (for Android)
- Android Studio (latest stable)
- Java JDK 17+
- Android SDK 33+
- Android Emulator or physical device
- Google Play Developer Account ($25 one-time)

## 🎨 App Icons & Splash Screens Setup

### Step 1: Install Capacitor Assets
```bash
npm install -D @capacitor/assets
```

### Step 2: Create Resources Directory
```bash
mkdir -p resources
```

### Step 3: Add Source Images
Place these files in `resources/`:
- **icon.png** - 1024x1024px (app icon)
- **splash.png** - 2732x2732px (splash screen)

**Design Guidelines:**
- Icon: Simple, recognizable at small sizes
- Use Alaska Pay brand colors (#0EA5E9)
- No text in icon (hard to read when small)
- Splash: Centered logo with brand colors

### Step 4: Generate All Sizes
```bash
npx capacitor-assets generate --iconBackgroundColor '#0EA5E9' --splashBackgroundColor '#0EA5E9'
```

This generates:
- iOS: 20+ icon sizes, 6 splash screens
- Android: 5 icon densities, 4 splash screens

## 🍎 iOS Development Setup

### 1. Install iOS Dependencies
```bash
cd ios/App
pod install
cd ../..
```

### 2. Open in Xcode
```bash
npx cap open ios
```

### 3. Configure Project Settings
In Xcode:
1. Select "App" project in navigator
2. Select "App" target
3. **General Tab:**
   - Display Name: `Alaska Pay`
   - Bundle Identifier: `com.alaskapay.app`
   - Version: `1.0.0`
   - Build: `1`
   - Deployment Target: iOS 13.0+

4. **Signing & Capabilities:**
   - Team: Select your Apple Developer team
   - Automatically manage signing: ✓
   - Add Capabilities:
     - Push Notifications
     - Background Modes (Remote notifications)
     - Associated Domains (for deep linking)

### 4. Test on iOS Simulator
```bash
# List available simulators
xcrun simctl list devices

# Run on simulator
npx cap run ios
```

### 5. Test on Physical Device
1. Connect iPhone via USB
2. Trust computer on device
3. In Xcode: Select your device from dropdown
4. Click Run (▶️) button
5. On device: Settings → General → VPN & Device Management → Trust developer

## 🤖 Android Development Setup

### 1. Open in Android Studio
```bash
npx cap open android
```

### 2. Configure Project Settings
In Android Studio:
1. Open `android/app/build.gradle`
2. Update:
```gradle
android {
    namespace "com.alaskapay.app"
    compileSdk 34
    
    defaultConfig {
        applicationId "com.alaskapay.app"
        minSdk 22
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### 3. Add Firebase (for Push Notifications)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create project or use existing
3. Add Android app with package name: `com.alaskapay.app`
4. Download `google-services.json`
5. Place in `android/app/google-services.json`

### 4. Test on Android Emulator
```bash
# Create emulator (first time only)
# In Android Studio: Tools → Device Manager → Create Device

# Run on emulator
npx cap run android
```

### 5. Test on Physical Device
1. Enable Developer Options on device:
   - Settings → About Phone → Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging
3. Connect via USB
4. Allow USB debugging prompt on device
5. Run: `npx cap run android`

## 🧪 Core Features Testing Checklist

### Authentication & Security
- [ ] Sign up with email/password
- [ ] Login with existing account
- [ ] Two-factor authentication (SMS/TOTP)
- [ ] Biometric login (Face ID/Touch ID/Fingerprint)
- [ ] App lock screen after background
- [ ] Session management (logout, timeout)
- [ ] Password reset flow

### Wallet Features
- [ ] View wallet balance
- [ ] Top up wallet (Paystack integration)
- [ ] Transfer money to another user
- [ ] Withdraw to bank account
- [ ] Transaction history loads
- [ ] Real-time balance updates
- [ ] Currency conversion (if multi-currency)

### Payment Features
- [ ] Add payment method (card/bank)
- [ ] Make payment to merchant
- [ ] Bill payments (electricity, airtime, etc.)
- [ ] Virtual card creation
- [ ] Virtual card funding
- [ ] Payment receipts download

### KYC & Verification
- [ ] Upload ID documents
- [ ] Take selfie for liveness check
- [ ] Submit KYC form
- [ ] View verification status
- [ ] Tier upgrade prompts

### Notifications
- [ ] Push notifications received
- [ ] Notification badge updates
- [ ] In-app notifications panel
- [ ] Email notifications
- [ ] SMS notifications (if enabled)

### Offline Functionality
- [ ] App opens without internet
- [ ] Cached data displays
- [ ] Queue actions for later
- [ ] Sync when connection restored

### Performance
- [ ] App launches in < 3 seconds
- [ ] Smooth scrolling (60fps)
- [ ] No memory leaks
- [ ] Battery usage reasonable
- [ ] App size < 50MB

### Deep Links
- [ ] Open app from email link
- [ ] Open app from SMS link
- [ ] Navigate to specific transaction
- [ ] Navigate to specific feature

## 🔍 Testing Tools

### iOS Testing
```bash
# Run with live reload
npx cap run ios --livereload --external

# View console logs
# In Xcode: View → Debug Area → Show Debug Area

# Test on different iOS versions
# Xcode → Window → Devices and Simulators
```

### Android Testing
```bash
# Run with live reload
npx cap run android --livereload --external

# View logs
adb logcat | grep AlaskaPay

# Test on different Android versions
# Android Studio → Tools → Device Manager
```

### Debugging
```bash
# iOS Safari Web Inspector
# Safari → Develop → [Device Name] → [App]

# Android Chrome DevTools
# Chrome → chrome://inspect → Select device
```

## 📦 Build for Distribution

### iOS - TestFlight Build

```bash
# 1. Build web assets
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Open Xcode
npx cap open ios

# 4. In Xcode:
# - Select "Any iOS Device (arm64)" from device dropdown
# - Product → Archive
# - Wait for archive to complete
# - Click "Distribute App"
# - Select "TestFlight & App Store"
# - Follow wizard to upload

# 5. In App Store Connect:
# - Go to TestFlight tab
# - Add internal testers
# - Submit for beta review
```

### Android - Internal Testing Build

```bash
# 1. Build web assets
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open Android Studio
npx cap open android

# 4. Generate signed AAB:
# - Build → Generate Signed Bundle/APK
# - Select "Android App Bundle"
# - Create or select keystore
# - Build variant: release
# - Click "Create"

# 5. In Google Play Console:
# - Create app
# - Go to Testing → Internal testing
# - Create new release
# - Upload AAB file
# - Add release notes
# - Review and roll out
```

## 🔐 Code Signing

### iOS Signing
```bash
# Automatic signing (recommended for testing)
# Xcode handles certificates automatically

# Manual signing (for CI/CD)
# 1. Create App ID in Apple Developer Portal
# 2. Create provisioning profile
# 3. Download and install certificates
# 4. Configure in Xcode build settings
```

### Android Signing
```bash
# Generate release keystore
keytool -genkey -v -keystore alaskapay-release.keystore \
  -alias alaskapay -keyalg RSA -keysize 2048 -validity 10000

# Store credentials securely
# Add to android/key.properties:
storePassword=<password>
keyPassword=<password>
keyAlias=alaskapay
storeFile=alaskapay-release.keystore
```

## 🚀 Deployment Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "mobile:setup": "npx cap add ios && npx cap add android",
    "mobile:sync": "npm run build && npx cap sync",
    "mobile:ios": "npx cap open ios",
    "mobile:android": "npx cap open android",
    "mobile:run:ios": "npx cap run ios",
    "mobile:run:android": "npx cap run android",
    "mobile:build": "npm run build && npx cap sync"
  }
}
```

## 📊 Pre-Launch Checklist

### iOS App Store
- [ ] App icon (1024x1024)
- [ ] Screenshots (6.5", 5.5", 12.9" iPad)
- [ ] App preview video (optional)
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Support URL
- [ ] App description
- [ ] Keywords
- [ ] Age rating
- [ ] TestFlight beta testing complete

### Google Play Store
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (min 2, max 8)
- [ ] Promo video (optional)
- [ ] Privacy policy URL
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Content rating questionnaire
- [ ] Internal testing complete

## 🐛 Common Issues & Solutions

### iOS Build Fails
```bash
# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reinstall pods
cd ios/App
rm -rf Pods Podfile.lock
pod install --repo-update
```

### Android Build Fails
```bash
# Clean gradle
cd android
./gradlew clean

# Invalidate caches in Android Studio
# File → Invalidate Caches → Invalidate and Restart
```

### Push Notifications Not Working
- iOS: Check provisioning profile includes Push capability
- Android: Verify google-services.json is present
- Both: Check device token logs in console

### Biometric Auth Not Working
- iOS: Check Info.plist has Face ID usage description
- Android: Check USE_BIOMETRIC permission in manifest
- Both: Test on physical device (simulators may not support)

## 📈 Next Steps

1. ✅ Complete core feature testing
2. ✅ Fix any bugs found
3. ✅ Upload to TestFlight/Internal Testing
4. ✅ Invite beta testers
5. ✅ Gather feedback
6. ✅ Iterate and improve
7. ✅ Prepare store listings
8. ✅ Submit for review
9. ✅ Launch! 🎉

## 📚 Additional Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Material Design](https://material.io/design)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

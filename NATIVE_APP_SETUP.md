# Native Mobile App Setup Guide

## Quick Start (5 Minutes)

```bash
# Install dependencies
npm install

# Generate app icons and splash screens
npm run resources

# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

## 📱 App Icons & Splash Screens

### Download Assets
1. **App Icon**: https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760031189061_c9f71b18.webp
2. **Splash Screen**: https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760031189863_efedac71.webp

### Generate All Sizes
```bash
# Install Capacitor Assets
npm install -D @capacitor/assets

# Place source files in:
# - resources/icon.png (1024x1024)
# - resources/splash.png (2732x2732)

# Generate all sizes
npx capacitor-assets generate
```

## 🍎 iOS Setup

### 1. Open Xcode Project
```bash
npx cap open ios
```

### 2. Configure Signing
- Open `ios/App/App.xcodeproj` in Xcode
- Select "App" target → "Signing & Capabilities"
- Select your Team
- Change Bundle ID: `com.alaskapay.app`

### 3. Push Notifications
```bash
# In Xcode: Signing & Capabilities → + Capability → Push Notifications
# Add Background Modes: Remote notifications
```

### 4. Biometric Authentication
Already configured in `Info.plist`:
- Face ID Usage Description
- Touch ID via LocalAuthentication framework

### 5. Build for TestFlight
```bash
# Archive build
npm run archive:ios

# Or use Xcode:
# Product → Archive → Distribute App → TestFlight
```

## 🤖 Android Setup

### 1. Open Android Studio
```bash
npx cap open android
```

### 2. Configure App
- Update `android/app/build.gradle`:
  - applicationId: "com.alaskapay.app"
  - versionCode & versionName

### 3. Push Notifications (FCM)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Add Android app
3. Download `google-services.json`
4. Place in `android/app/`

### 4. Biometric Authentication
Already configured in `AndroidManifest.xml`:
- USE_BIOMETRIC permission
- USE_FINGERPRINT permission (legacy)

### 5. Generate Signing Key
```bash
keytool -genkey -v -keystore alaskapay-release.keystore \
  -alias alaskapay -keyalg RSA -keysize 2048 -validity 10000
```

### 6. Build for Google Play
```bash
# Generate AAB
npm run build:android:release

# Or use Android Studio:
# Build → Generate Signed Bundle/APK
```

## 🔔 Push Notification Setup

### iOS (APNs)
1. Apple Developer Portal → Certificates, IDs & Profiles
2. Create APNs Key
3. Download `.p8` file
4. Add to Supabase Edge Function environment

### Android (FCM)
1. Firebase Console → Project Settings
2. Cloud Messaging → Server Key
3. Add to Supabase Edge Function environment

### Test Push Notifications
```bash
# iOS
npx cap run ios --livereload

# Android
npx cap run android --livereload
```

## 🔐 Biometric Authentication

### iOS Implementation
Uses `LocalAuthentication` framework (already in code):
```typescript
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
```

### Android Implementation
Uses `BiometricPrompt` API (already in code):
```typescript
// Configured in BiometricSettings.tsx
```

## 📦 App Store Metadata

### iOS App Store Connect
- **App Name**: Alaska Pay
- **Subtitle**: Secure Digital Payments
- **Category**: Finance
- **Age Rating**: 4+
- **Keywords**: payment, wallet, transfer, bills, fintech
- **Description**: See `APP_STORE_DESCRIPTION.md`
- **Screenshots**: 6.5", 5.5", 12.9" iPad

### Google Play Console
- **App Name**: Alaska Pay
- **Short Description**: Secure digital wallet and payment platform
- **Category**: Finance
- **Content Rating**: Everyone
- **Tags**: payment, wallet, money transfer
- **Description**: See `PLAY_STORE_DESCRIPTION.md`
- **Screenshots**: Phone, 7" Tablet, 10" Tablet

## 🚀 Build Scripts

### Development
```bash
# iOS Simulator
npm run dev:ios

# Android Emulator
npm run dev:android
```

### Production
```bash
# iOS Archive
npm run archive:ios

# Android Release AAB
npm run release:android
```

## 📊 App Store Requirements

### iOS
- ✅ Privacy Policy URL
- ✅ Terms of Service URL
- ✅ Support URL
- ✅ App Icon (1024x1024)
- ✅ Screenshots (all sizes)
- ✅ App Preview Video (optional)

### Android
- ✅ Privacy Policy URL
- ✅ Feature Graphic (1024x500)
- ✅ App Icon (512x512)
- ✅ Screenshots (min 2)
- ✅ Content Rating Questionnaire

## 🔧 Troubleshooting

### iOS Build Fails
```bash
# Clean build
cd ios/App
rm -rf Pods Podfile.lock
pod install
```

### Android Build Fails
```bash
# Clean build
cd android
./gradlew clean
```

### Push Notifications Not Working
- iOS: Check provisioning profile includes Push Notifications
- Android: Verify `google-services.json` is in place
- Both: Check device token registration in logs

## 📱 Testing Checklist

- [ ] App launches successfully
- [ ] Biometric authentication works
- [ ] Push notifications received
- [ ] Deep links open correctly
- [ ] Camera permissions work (KYC)
- [ ] App doesn't crash on background
- [ ] Offline mode functions
- [ ] App lock screen works
- [ ] All transactions complete
- [ ] Payment methods add successfully

## 🎯 Next Steps

1. Submit to TestFlight for beta testing
2. Gather user feedback
3. Submit to App Store Review
4. Submit to Google Play Review
5. Monitor crash reports and analytics

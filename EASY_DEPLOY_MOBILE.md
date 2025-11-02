# 📱 Easy Mobile Deployment Guide

## Deploy AlaskaPay to App Store & Google Play in 30 Minutes

### Prerequisites (5 minutes)
```bash
# 1. Install Node.js (if not installed)
# Download from nodejs.org

# 2. Install dependencies
npm install

# 3. Install Xcode (Mac only - for iOS)
# Download from Mac App Store

# 4. Install Android Studio (for Android)
# Download from developer.android.com/studio
```

---

## 🍎 iOS - Deploy to App Store (15 minutes)

### Step 1: Build the App
```bash
npm run build
npx cap sync ios
npx cap open ios
```

### Step 2: In Xcode (opens automatically)
1. **Select your team**: Click project → Signing & Capabilities → Select your Apple Developer account
2. **Update Bundle ID**: Change to `com.yourcompany.alaskapay`
3. **Update version**: General → Version: `1.0.0`, Build: `1`
4. **Select device**: Top bar → Select "Any iOS Device (arm64)"
5. **Archive**: Menu → Product → Archive (wait 2-3 minutes)
6. **Distribute**: Click "Distribute App" → "TestFlight & App Store" → Follow prompts

### Step 3: TestFlight (Optional Testing)
- Go to App Store Connect (appstoreconnect.apple.com)
- Your app appears in TestFlight automatically
- Add testers and share the link

### Step 4: Submit to App Store
- In App Store Connect → My Apps → Your App
- Fill in app details, screenshots, description
- Click "Submit for Review"

**Cost**: $99/year Apple Developer account

---

## 🤖 Android - Deploy to Google Play (15 minutes)

### Step 1: Build the App
```bash
npm run build
npx cap sync android
npx cap open android
```

### Step 2: Generate Signing Key (First time only)
```bash
keytool -genkey -v -keystore alaskapay-release.keystore \
  -alias alaskapay -keyalg RSA -keysize 2048 -validity 10000
```
**Save the password!** You'll need it.

### Step 3: Configure Signing in Android Studio
1. Create `android/key.properties`:
```
storePassword=YOUR_PASSWORD
keyPassword=YOUR_PASSWORD
keyAlias=alaskapay
storeFile=../alaskapay-release.keystore
```

2. Update `android/app/build.gradle` (add before `android {`):
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

3. Inside `android { buildTypes { release {` section:
```gradle
signingConfig signingConfigs.release
```

### Step 4: Build Release AAB
```bash
cd android
./gradlew bundleRelease
cd ..
```

**Output**: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 5: Upload to Google Play Console
1. Go to play.google.com/console
2. Create new app
3. Go to "Internal testing" → Create new release
4. Upload `app-release.aab`
5. Fill in release notes, click "Review release" → "Start rollout"

**Cost**: $25 one-time Google Play Developer fee

---

## 🚀 One-Command Deploy (Advanced)

### Create Quick Deploy Script
Save as `quick-deploy.sh`:
```bash
#!/bin/bash
echo "🚀 Building AlaskaPay..."
npm run build
npx cap sync

echo "📱 Choose platform:"
echo "1) iOS"
echo "2) Android"
echo "3) Both"
read -p "Enter choice: " choice

case $choice in
  1) npx cap open ios ;;
  2) 
    cd android && ./gradlew bundleRelease && cd ..
    echo "✅ AAB created: android/app/build/outputs/bundle/release/app-release.aab"
    ;;
  3)
    npx cap open ios &
    cd android && ./gradlew bundleRelease && cd ..
    ;;
esac
```

Run: `chmod +x quick-deploy.sh && ./quick-deploy.sh`

---

## 📋 Checklist Before Submission

### Both Platforms
- [ ] App icons (1024x1024 PNG)
- [ ] Splash screens
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] App description (compelling!)
- [ ] Screenshots (5-10 images)
- [ ] App category selected

### iOS Specific
- [ ] Apple Developer account ($99/year)
- [ ] Bundle ID registered
- [ ] App Store Connect app created
- [ ] Export compliance answered

### Android Specific
- [ ] Google Play Developer account ($25 one-time)
- [ ] Signing key generated and backed up
- [ ] Content rating questionnaire completed
- [ ] Target API level 33+ (Android 13+)

---

## 🆘 Common Issues

**iOS: "No signing certificate found"**
```bash
# In Xcode: Preferences → Accounts → Add Apple ID → Download Manual Profiles
```

**Android: "Execution failed for task :app:bundleRelease"**
```bash
cd android && ./gradlew clean && cd ..
# Then try bundleRelease again
```

**Both: "capacitor not found"**
```bash
npm install @capacitor/core @capacitor/cli
```

---

## 📚 Detailed Guides
- `TESTFLIGHT_SETUP.md` - Complete iOS guide
- `PLAY_STORE_INTERNAL_TESTING.md` - Complete Android guide
- `MOBILE_DEPLOY_COMMANDS.sh` - All commands reference

---

## ⚡ Super Quick Summary

**iOS:**
```bash
npm run build && npx cap sync ios && npx cap open ios
# Then: Archive → Distribute in Xcode
```

**Android:**
```bash
npm run build && npx cap sync android
cd android && ./gradlew bundleRelease
# Upload: android/app/build/outputs/bundle/release/app-release.aab
```

**Done!** 🎉

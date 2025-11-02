# 🚀 Mobile CI/CD Setup Guide

Complete automated deployment pipeline for iOS and Android apps.

## 🎯 What This Does

**Automatic on every push to `main`:**
- ✅ Bumps version number (patch/minor/major)
- ✅ Builds iOS app → Uploads to TestFlight
- ✅ Builds Android app → Uploads to Google Play Internal Testing
- ✅ Notifies team when builds are ready
- ✅ Creates build artifacts for download

## 📋 Prerequisites

### iOS Requirements
- Apple Developer Account ($99/year)
- App Store Connect access
- Certificates and provisioning profiles

### Android Requirements
- Google Play Developer Account ($25 one-time)
- Play Console access
- Signing keystore

## 🔐 Step 1: GitHub Secrets Setup

Add these secrets in GitHub: **Settings → Secrets → Actions**

### iOS Secrets (8 required)
```bash
APP_STORE_CONNECT_API_KEY      # Base64 encoded .p8 key file
APP_STORE_KEY_ID               # Key ID from App Store Connect
APP_STORE_ISSUER_ID            # Issuer ID from App Store Connect
APPLE_ID                       # Your Apple ID email
FASTLANE_PASSWORD              # App-specific password
MATCH_PASSWORD                 # Password for certificate encryption
MATCH_GIT_URL                  # Private repo for certificates (optional)
```

### Android Secrets (5 required)
```bash
ANDROID_KEYSTORE_BASE64        # Base64 encoded keystore file
ANDROID_KEYSTORE_PASSWORD      # Keystore password
ANDROID_KEY_ALIAS              # Key alias
ANDROID_KEY_PASSWORD           # Key password
PLAY_STORE_JSON_KEY            # Service account JSON (full content)
```

### Shared Secrets (3 required)
```bash
VITE_SUPABASE_URL             # Your Supabase project URL
VITE_SUPABASE_ANON_KEY        # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY     # Supabase service role key
```

## 🍎 Step 2: iOS Setup

### A. Create App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to **Users and Access → Keys**
3. Click **+** to create new key
4. Name: "GitHub Actions CI/CD"
5. Access: **Admin** or **App Manager**
6. Download the `.p8` file
7. Note the **Key ID** and **Issuer ID**

### B. Encode and Add to GitHub

```bash
# Encode the .p8 file
base64 -i AuthKey_XXXXXXXXXX.p8 | pbcopy

# Add to GitHub as APP_STORE_CONNECT_API_KEY
```

### C. Create App-Specific Password

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in → **Security → App-Specific Passwords**
3. Generate password for "GitHub Actions"
4. Copy and add as `FASTLANE_PASSWORD`

### D. Setup Match (Certificate Management)

```bash
# Initialize match (one-time setup)
cd ios/App
bundle exec fastlane match init

# Generate certificates
bundle exec fastlane match development
bundle exec fastlane match appstore

# Set MATCH_PASSWORD in GitHub secrets
```

## 🤖 Step 3: Android Setup

### A. Create Signing Keystore

```bash
# Generate keystore
keytool -genkey -v -keystore release.keystore \
  -alias alaskapay -keyalg RSA -keysize 2048 -validity 10000

# Encode for GitHub
base64 -i release.keystore | pbcopy

# Add to GitHub as ANDROID_KEYSTORE_BASE64
```

### B. Create Play Console Service Account

1. Go to [Play Console](https://play.google.com/console)
2. Navigate to **Setup → API access**
3. Click **Create new service account**
4. Follow link to Google Cloud Console
5. Create service account: "github-actions-deploy"
6. Grant permissions: **Service Account User**
7. Create JSON key → Download
8. Back in Play Console, grant access: **Admin** (Releases)
9. Copy entire JSON content → Add as `PLAY_STORE_JSON_KEY`

### C. Configure Gradle Signing

Update `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('release.keystore')
            storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD')
            keyAlias System.getenv('ANDROID_KEY_ALIAS')
            keyPassword System.getenv('ANDROID_KEY_PASSWORD')
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## 🚀 Step 4: Test the Pipeline

### Manual Trigger (First Time)
```bash
# Go to GitHub Actions tab
# Select "Mobile CI/CD - Auto Deploy"
# Click "Run workflow"
# Choose version bump: patch/minor/major
```

### Automatic Trigger
```bash
# Just push to main!
git add .
git commit -m "feat: new feature"
git push origin main

# Pipeline automatically:
# 1. Bumps version
# 2. Builds both apps
# 3. Deploys to TestFlight + Play Internal
# 4. Notifies team
```

## 📊 Step 5: Monitor Deployments

### GitHub Actions Dashboard
- View build logs
- Download artifacts (IPA/AAB files)
- See deployment status

### TestFlight (iOS)
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app → **TestFlight**
3. See new build (processing takes 5-10 minutes)
4. Add testers and distribute

### Google Play Internal Testing
1. Go to [Play Console](https://play.google.com/console)
2. Select app → **Testing → Internal testing**
3. See new release
4. Share testing link with testers

## 🔧 Manual Version Bumping

```bash
# Bump version locally
chmod +x scripts/bump-version.sh
./scripts/bump-version.sh patch   # 1.0.0 → 1.0.1
./scripts/bump-version.sh minor   # 1.0.0 → 1.1.0
./scripts/bump-version.sh major   # 1.0.0 → 2.0.0

# Commit and push
git add .
git commit -m "chore: bump version"
git push
```

## 🐛 Troubleshooting

### iOS Build Fails
```bash
# Check certificate validity
cd ios/App
bundle exec fastlane match development --readonly

# Re-sync certificates
bundle exec fastlane match nuke development
bundle exec fastlane match nuke distribution
bundle exec fastlane match development
bundle exec fastlane match appstore
```

### Android Build Fails
```bash
# Verify keystore
keytool -list -v -keystore android/app/release.keystore

# Check service account permissions in Play Console
```

### Version Conflicts
```bash
# Reset version manually
npm version 1.0.0 --no-git-tag-version
./scripts/bump-version.sh patch
```

## 📱 Distribution Links

### iOS TestFlight
```
https://testflight.apple.com/join/YOUR_CODE
```

### Android Internal Testing
```
https://play.google.com/apps/internaltest/YOUR_PACKAGE_NAME
```

## 🎉 You're Done!

Every push to `main` now automatically:
- ✅ Builds and deploys iOS to TestFlight
- ✅ Builds and deploys Android to Play Internal Testing
- ✅ Bumps version numbers
- ✅ Notifies your team

**No manual work required!** 🚀

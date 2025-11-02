# 🚀 Quick Deploy iOS - Alaska Pay

## One-Command Setup
```bash
# Run automated setup
chmod +x scripts/setup-ios-deployment.sh
./scripts/setup-ios-deployment.sh
```

## Deploy Methods

### 1️⃣ GitHub Actions (Recommended)
```bash
# Go to: Actions → Auto Deploy iOS → Run workflow
# Select: beta (TestFlight) or release (App Store)
```

### 2️⃣ Git Tags (Automatic)
```bash
# TestFlight
git tag ios-beta-v1.0.0-1
git push origin ios-beta-v1.0.0-1

# App Store
git tag ios-v1.0.0
git push origin ios-v1.0.0
```

### 3️⃣ Local Fastlane
```bash
# Build web assets
npm run build

# Sync to iOS
npx cap sync ios

# Deploy to TestFlight
cd ios/App
bundle exec fastlane beta

# Deploy to App Store
bundle exec fastlane release

# Generate screenshots
bundle exec fastlane screenshots
```

## Required Secrets

Add to GitHub: **Settings → Secrets → Actions**

```yaml
APP_STORE_CONNECT_API_KEY  # .p8 file content
APP_STORE_KEY_ID           # Key ID from App Store Connect
APP_STORE_ISSUER_ID        # Issuer ID (UUID)
APPLE_ID                   # Your Apple ID email
APPLE_APP_SPECIFIC_PASSWORD # From appleid.apple.com
MATCH_PASSWORD             # Certificate encryption password
MATCH_GIT_URL             # Private repo for certificates
```

## Quick Commands

```bash
# Install dependencies
cd ios/App && bundle install

# Test configuration
bundle exec fastlane --version

# Build only (no upload)
bundle exec fastlane build

# Update metadata only
bundle exec fastlane metadata

# Generate screenshots
bundle exec fastlane screenshots
```

## Monitoring

- **GitHub Actions**: Check Actions tab for logs
- **TestFlight**: appstoreconnect.apple.com → TestFlight
- **App Store**: appstoreconnect.apple.com → App Store

## Troubleshooting

```bash
# Clean build
cd ios/App
xcodebuild clean -workspace App.xcworkspace -scheme App

# Re-sync certificates
bundle exec fastlane match appstore --force

# View logs
cat fastlane/logs/fastlane.log
```

## Documentation

- Full guide: `AUTO_DEPLOY_IOS_APPSTORE.md`
- TestFlight: `TESTFLIGHT_SETUP.md`
- App Store: `APP_STORE_SUBMISSION_CHECKLIST.md`

## Support

Need help? Check:
1. GitHub Actions logs
2. Fastlane logs in `ios/App/fastlane/logs/`
3. App Store Connect notifications
4. [Fastlane Docs](https://docs.fastlane.tools/)

# 🍎 Automatic iOS App Store Deployment

## 🚀 Quick Deploy

### One-Click Deployment
```bash
# Trigger from GitHub Actions UI
# Go to: Actions → Deploy iOS to App Store → Run workflow
# Select lane: beta | release | screenshots
```

### Git Tag Deployment (Automatic)
```bash
# Tag and push for automatic deployment
git tag ios-v1.0.0
git push origin ios-v1.0.0
```

## 📋 Prerequisites

### Required Accounts
- ✅ Apple Developer Account ($99/year)
- ✅ GitHub account with repo access
- ✅ App Store Connect access

### Required Tools
- ✅ Xcode 15+ (for local testing)
- ✅ Ruby 3.0+ (installed on GitHub runners)
- ✅ Fastlane (auto-installed by workflow)

## 🔑 Step 1: App Store Connect API Setup

### Create API Key
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to **Users and Access** → **Keys** tab
3. Click **+** to generate new key
4. Fill in details:
   - **Name**: GitHub Actions CI/CD
   - **Access**: App Manager or Admin
5. Click **Generate**
6. **Download** the `.p8` file (only chance!)
7. Note down:
   - **Key ID** (e.g., ABC123XYZ)
   - **Issuer ID** (UUID format)

### Save API Key Content
```bash
# View the .p8 file content
cat AuthKey_ABC123XYZ.p8

# Copy the entire content including headers
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
-----END PRIVATE KEY-----
```

## 🔐 Step 2: Code Signing Setup

### Option A: Fastlane Match (Recommended)
```bash
# Initialize match
cd ios/App
fastlane match init

# Select storage (git recommended)
# Create private repo: github.com/yourorg/certificates

# Generate certificates
fastlane match appstore
```

### Option B: Manual Certificates
1. Open Xcode → Preferences → Accounts
2. Add Apple ID
3. Download Manual Profiles
4. Export certificates as .p12

## 🔧 Step 3: Configure GitHub Secrets

### Navigate to Repository Settings
```
GitHub Repo → Settings → Secrets and variables → Actions
```

### Add Required Secrets

#### App Store Connect API
```yaml
APP_STORE_CONNECT_API_KEY
# Content of the .p8 file (entire file content)

APP_STORE_KEY_ID
# Example: ABC123XYZ

APP_STORE_ISSUER_ID
# Example: 12345678-1234-1234-1234-123456789012
```

#### Apple ID Credentials
```yaml
APPLE_ID
# Your Apple ID email (e.g., dev@alaskapay.com)

APPLE_APP_SPECIFIC_PASSWORD
# Generate at: appleid.apple.com → Security → App-Specific Passwords
```

#### Code Signing (Match)
```yaml
MATCH_PASSWORD
# Password for encrypting certificates in match repo

MATCH_GIT_URL
# Git URL of certificates repo
# Example: git@github.com:yourorg/certificates.git

MATCH_GIT_BASIC_AUTHORIZATION
# Base64 of username:token for HTTPS
# Generate: echo -n "username:token" | base64
```

#### Code Signing (Manual - Alternative)
```yaml
IOS_CERTIFICATE_BASE64
# Base64 encoded .p12 certificate
# Generate: base64 -i certificate.p12 | pbcopy

IOS_CERTIFICATE_PASSWORD
# Password for .p12 certificate

IOS_PROVISIONING_PROFILE_BASE64
# Base64 encoded .mobileprovision
# Generate: base64 -i profile.mobileprovision | pbcopy
```

## 📱 Step 4: Update Fastlane Configuration

### Edit ios/App/fastlane/Fastfile
Already configured! Includes:
- ✅ TestFlight beta deployment
- ✅ App Store release with phased rollout
- ✅ Automatic screenshot generation
- ✅ Metadata updates

### Customize Build Settings (Optional)
```ruby
# ios/App/fastlane/Fastfile
lane :beta do
  increment_build_number(xcodeproj: "App.xcodeproj")
  
  # Use match for code signing
  match(type: "appstore", readonly: true)
  
  # Build the app
  build_app(
    scheme: "App",
    workspace: "App.xcworkspace",
    export_method: "app-store"
  )
  
  # Upload to TestFlight
  upload_to_testflight(
    skip_waiting_for_build_processing: true,
    distribute_external: false, # Set true for external testers
    notify_external_testers: false
  )
end
```

## 🎬 Step 5: Deploy!

### Method 1: GitHub Actions UI (Manual)
1. Go to **Actions** tab
2. Select **Deploy iOS to App Store**
3. Click **Run workflow**
4. Select branch and lane:
   - `beta` - TestFlight deployment
   - `release` - App Store submission
   - `screenshots` - Generate screenshots only
   - `metadata` - Update metadata only
5. Click **Run workflow**

### Method 2: Git Tags (Automatic)
```bash
# Beta deployment
git tag ios-beta-v1.0.0-1
git push origin ios-beta-v1.0.0-1

# Production release
git tag ios-v1.0.0
git push origin ios-v1.0.0
```

### Method 3: Local Fastlane
```bash
# Build and deploy to TestFlight
cd ios/App
fastlane beta

# Deploy to App Store
fastlane release

# Generate screenshots
fastlane screenshots

# Update metadata only
fastlane metadata
```

## 📊 Step 6: Monitor Deployment

### GitHub Actions
- View logs in **Actions** tab
- Download build artifacts
- Check for errors

### App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select **Alaska Pay**
3. Check **TestFlight** tab for beta builds
4. Check **App Store** tab for release status

### TestFlight Processing
- Upload: 5-10 minutes
- Processing: 10-30 minutes
- Email notification when ready

## 🎯 Deployment Lanes Explained

### `beta` - TestFlight
- Increments build number
- Builds app for App Store
- Uploads to TestFlight
- Available to internal testers immediately
- External testers require Beta App Review (1-2 days)

### `release` - App Store
- Increments version and build number
- Builds app for App Store
- Submits for App Store Review
- Enables phased release (7-day rollout)
- Requires manual approval after review

### `screenshots` - Screenshot Generation
- Launches app in simulator
- Captures screenshots for all device sizes
- Frames screenshots with device bezels
- Saves to `fastlane/screenshots/`

### `metadata` - Metadata Update
- Updates app description
- Updates keywords
- Updates screenshots
- Updates promotional text
- Does NOT upload new binary

## 🔄 Version Management

### Semantic Versioning
```
MAJOR.MINOR.PATCH (BUILD)
1.0.0 (1)
1.0.1 (2)
1.1.0 (3)
2.0.0 (4)
```

### Auto-Increment
```ruby
# Build number only (for beta)
increment_build_number(xcodeproj: "App.xcodeproj")

# Version and build (for release)
increment_version_number(
  bump_type: "patch", # or "minor", "major"
  xcodeproj: "App.xcodeproj"
)
```

## 🖼️ Screenshot Automation

### Configure Snapfile
```ruby
# ios/App/fastlane/Snapfile
devices([
  "iPhone 15 Pro Max",
  "iPhone 15 Pro", 
  "iPhone SE (3rd generation)",
  "iPad Pro (12.9-inch) (6th generation)"
])

languages(["en-US"])

scheme("App")

output_directory("./fastlane/screenshots")

clear_previous_screenshots(true)
```

### UI Testing for Screenshots
Create `AppUITests.swift`:
```swift
import XCTest

class AppUITests: XCTestCase {
    func testScreenshots() {
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()
        
        snapshot("01Dashboard")
        
        app.buttons["Wallet"].tap()
        snapshot("02Wallet")
        
        app.buttons["Send"].tap()
        snapshot("03Send")
    }
}
```

## 🚨 Troubleshooting

### Build Failed
```bash
# Clean and rebuild
cd ios/App
xcodebuild clean -workspace App.xcworkspace -scheme App
fastlane beta
```

### Code Signing Error
```bash
# Re-sync certificates
fastlane match appstore --force_for_new_devices
```

### Upload Failed
- Check API key permissions (needs App Manager role)
- Verify API key hasn't expired
- Check bundle ID matches App Store Connect

### Processing Stuck
- Wait 30 minutes (Apple's processing time)
- Check email for Apple notifications
- Contact Apple Developer Support if > 1 hour

## 📚 Resources

- [Fastlane Documentation](https://docs.fastlane.tools/)
- [App Store Connect API](https://developer.apple.com/app-store-connect/api/)
- [TestFlight Guide](https://developer.apple.com/testflight/)
- [Match Code Signing](https://docs.fastlane.tools/actions/match/)

## ✅ Deployment Checklist

Before first deployment:
- [ ] App Store Connect app created
- [ ] API key generated and saved
- [ ] GitHub secrets configured
- [ ] Fastlane installed locally
- [ ] Match setup completed (or certificates exported)
- [ ] App tested on real device
- [ ] Privacy policy URL live
- [ ] Terms of service URL live

## 🎉 Success!

You now have:
- ✅ Automatic TestFlight deployment
- ✅ One-click App Store submission
- ✅ Automated screenshot generation
- ✅ Version management
- ✅ CI/CD pipeline

Next: Monitor TestFlight feedback and iterate!

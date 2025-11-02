# 🍎 TestFlight Beta Testing Setup

## Overview
TestFlight allows you to distribute beta builds of Alaska Pay to up to 10,000 testers before App Store release.

## Prerequisites
- ✅ Apple Developer Account ($99/year)
- ✅ Xcode 15+ installed
- ✅ App built and tested on simulator
- ✅ App icons and splash screens configured

## 📋 Step-by-Step Setup

### 1. App Store Connect Setup

#### Create App Record
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **Apps** → **+** icon → **New App**
3. Fill in details:
   - **Platform**: iOS
   - **Name**: Alaska Pay
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: com.alaskapay.app
   - **SKU**: ALASKAPAY001
   - **User Access**: Full Access

#### Configure App Information
1. Go to **App Information**
2. Fill in:
   - **Category**: Finance
   - **Secondary Category**: Utilities (optional)
   - **Content Rights**: Check if you own all rights
   - **Age Rating**: Click **Edit** → Answer questionnaire → Likely 4+

### 2. Xcode Configuration

#### Open Project
```bash
npx cap open ios
```

#### Configure Signing
1. Select **App** project in navigator
2. Select **App** target
3. Go to **Signing & Capabilities** tab
4. Check **Automatically manage signing**
5. Select your **Team**
6. Verify **Bundle Identifier**: com.alaskapay.app

#### Add Required Capabilities
Click **+ Capability** and add:
- ✅ Push Notifications
- ✅ Background Modes (check Remote notifications)
- ✅ Associated Domains (for deep linking)
  - Add: `applinks:alaskapay.com`

### 3. Build Archive

#### Prepare for Archive
1. Select **Any iOS Device (arm64)** from device dropdown
2. Go to **Product** → **Scheme** → **Edit Scheme**
3. Select **Run** → **Build Configuration** → **Release**
4. Close scheme editor

#### Create Archive
1. Go to **Product** → **Archive**
2. Wait for build to complete (5-10 minutes)
3. Archive window opens automatically

#### Distribute Archive
1. Click **Distribute App**
2. Select **TestFlight & App Store**
3. Click **Next**
4. Select **Upload**
5. Click **Next**
6. Review options:
   - ✅ Upload symbols (for crash reports)
   - ✅ Manage Version and Build Number
7. Click **Next**
8. Review signing certificate
9. Click **Upload**
10. Wait for upload to complete

### 4. TestFlight Configuration

#### Wait for Processing
- Upload takes 5-10 minutes
- Processing takes 10-30 minutes
- You'll receive email when ready

#### Add Test Information
1. Go to App Store Connect → **TestFlight** tab
2. Click on your build
3. Fill in **Test Information**:
   - **What to Test**: Describe new features
   - **Test Details**: Any specific instructions
   - **Email**: Your support email
   - **Phone**: Your support phone
   - **Marketing URL**: https://alaskapay.com
   - **Privacy Policy URL**: https://alaskapay.com/privacy
   - **Sign-In Info**: Test credentials if needed

#### Export Compliance
1. Click **Provide Export Compliance Information**
2. Answer questions:
   - Uses encryption? **Yes** (HTTPS)
   - Exempt from regulations? **Yes** (standard HTTPS)
3. Submit

### 5. Add Testers

#### Internal Testing (Up to 100 testers)
1. Go to **TestFlight** → **Internal Testing**
2. Click **+** next to Internal Testers
3. Add testers by email
4. Click **Add**
5. Testers receive email invitation immediately

#### External Testing (Up to 10,000 testers)
1. Go to **TestFlight** → **External Testing**
2. Click **+** to create new group
3. Name group (e.g., "Public Beta")
4. Add build
5. Add testers by email or public link
6. Submit for Beta App Review (1-2 days)

### 6. Tester Instructions

#### For Testers
1. Install **TestFlight** app from App Store
2. Open invitation email
3. Click **View in TestFlight**
4. Tap **Accept** → **Install**
5. Open Alaska Pay from home screen

#### Provide Feedback
- Open TestFlight app
- Select Alaska Pay
- Tap **Send Beta Feedback**
- Include screenshots if needed

## 🔄 Updating Builds

### Upload New Version
```bash
# 1. Update version/build number in Xcode
# General → Version: 1.0.0, Build: 2

# 2. Build web assets
npm run build

# 3. Sync to iOS
npx cap sync ios

# 4. Archive and upload (repeat steps from section 3)
```

### Notify Testers
1. Go to TestFlight → Select build
2. Click **Notify Testers**
3. Add release notes
4. Click **Send**

## 📊 Monitoring Beta Testing

### View Metrics
- **Installs**: Number of testers who installed
- **Sessions**: Number of app launches
- **Crashes**: Crash reports with stack traces
- **Feedback**: Tester comments and screenshots

### Crash Reports
1. Go to TestFlight → Build → Crashes
2. Click on crash to see details
3. Download crash logs
4. Symbolicate in Xcode for readable stack traces

## ✅ Pre-Submission Checklist

Before submitting to TestFlight:
- [ ] App launches without crashing
- [ ] All core features work
- [ ] No placeholder content
- [ ] Privacy policy URL is live
- [ ] Terms of service URL is live
- [ ] Support email is monitored
- [ ] Test credentials provided (if needed)
- [ ] Export compliance answered
- [ ] App icons look good
- [ ] Splash screen displays correctly

## 🐛 Common Issues

### Archive Failed
```bash
# Clean build folder
# Xcode → Product → Clean Build Folder
# Try archiving again
```

### Upload Failed
- Check internet connection
- Verify Apple ID has correct permissions
- Try uploading again (sometimes temporary)

### Processing Stuck
- Usually resolves in 30 minutes
- If > 1 hour, contact Apple Support

### Testers Can't Install
- Verify email address is correct
- Check if device is compatible (iOS 13+)
- Ensure device has enough storage
- Try removing and re-adding tester

## 📱 Device Requirements

### Minimum Requirements
- iOS 13.0 or later
- iPhone 6s or newer
- iPad (5th generation) or newer
- iPod touch (7th generation)

### Recommended
- iOS 16.0 or later
- iPhone 8 or newer
- Good internet connection for testing

## 🎯 Beta Testing Best Practices

### Test Coverage
- Test on multiple iOS versions
- Test on different device sizes
- Test with poor internet connection
- Test all critical user flows

### Gather Feedback
- Ask specific questions
- Request screenshots of issues
- Track common problems
- Prioritize fixes based on severity

### Communication
- Respond to tester feedback quickly
- Send updates about bug fixes
- Thank testers for participation
- Keep testers informed of progress

## 🚀 Moving to Production

### When Ready for App Store
1. Fix all critical bugs
2. Gather positive feedback
3. Prepare store screenshots
4. Write compelling description
5. Submit for App Store Review

### Graduation Criteria
- ✅ No critical bugs
- ✅ Positive tester feedback
- ✅ All features working
- ✅ Performance is good
- ✅ Privacy/security reviewed
- ✅ Store assets ready

## 📚 Resources

- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Beta Testing Best Practices](https://developer.apple.com/testflight/testers/)

## 💡 Tips

1. **Start with internal testing** - Fix obvious bugs before external
2. **Use build numbers** - Increment for each upload (1, 2, 3...)
3. **Write clear release notes** - Help testers know what to test
4. **Respond to feedback** - Engaged testers provide better feedback
5. **Test on real devices** - Simulators don't catch everything
6. **Monitor crashes daily** - Fix crashes quickly
7. **Keep testing cycles short** - Weekly updates keep testers engaged

## 🎉 Success!

Once your TestFlight build is live:
1. ✅ Testers can install and test
2. ✅ You receive feedback and crash reports
3. ✅ You can iterate quickly
4. ✅ You're ready for App Store when stable

Next: [PLAY_STORE_INTERNAL_TESTING.md](PLAY_STORE_INTERNAL_TESTING.md)

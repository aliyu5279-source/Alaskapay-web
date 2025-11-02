# 🤖 Google Play Internal Testing Setup

## Overview
Internal testing allows you to distribute your app to up to 100 testers quickly, with no review required.

## Prerequisites
- ✅ Google Play Developer Account ($25 one-time)
- ✅ Android Studio installed
- ✅ App built and tested on emulator
- ✅ App icons and splash screens configured
- ✅ Signing key generated

## 📋 Step-by-Step Setup

### 1. Google Play Console Setup

#### Create Developer Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Complete account details
4. Accept Developer Distribution Agreement

#### Create App
1. Click **Create app**
2. Fill in details:
   - **App name**: Alaska Pay
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
3. Check declarations:
   - ✅ Developer Program Policies
   - ✅ US export laws
4. Click **Create app**

### 2. Set Up App Details

#### Store Presence → Main store listing
1. **App name**: Alaska Pay
2. **Short description** (80 chars):
   ```
   Secure digital wallet for payments, transfers, and bill payments in Nigeria
   ```
3. **Full description** (4000 chars):
   ```
   Alaska Pay is your secure digital wallet for seamless financial transactions.
   
   KEY FEATURES:
   • Instant money transfers to any bank account
   • Pay bills (electricity, airtime, data, cable TV)
   • Virtual cards for online shopping
   • Multi-currency wallet support
   • Biometric security (fingerprint/face unlock)
   • Real-time transaction notifications
   • KYC verification for higher limits
   • 24/7 customer support
   
   SECURITY FIRST:
   • Bank-level encryption
   • Two-factor authentication
   • Biometric login
   • Transaction PIN protection
   
   Download Alaska Pay today and experience the future of digital payments!
   ```
4. **App icon**: 512x512 PNG
5. **Feature graphic**: 1024x500 PNG
6. **Phone screenshots**: At least 2 (max 8)
7. **7-inch tablet screenshots**: Optional
8. **10-inch tablet screenshots**: Optional

#### Store Presence → Store settings
1. **App category**: Finance
2. **Tags**: payment, wallet, money transfer, bills
3. **Contact details**:
   - Email: support@alaskapay.com
   - Phone: +234-XXX-XXX-XXXX (optional)
   - Website: https://alaskapay.com
4. **Privacy policy**: https://alaskapay.com/privacy

### 3. Generate Signing Key

```bash
# Navigate to android directory
cd android/app

# Generate release keystore
keytool -genkey -v -keystore alaskapay-release.keystore \
  -alias alaskapay -keyalg RSA -keysize 2048 -validity 10000

# Answer prompts:
# - Password: [Create strong password]
# - First and Last Name: Alaska Pay
# - Organizational Unit: Engineering
# - Organization: Alaska Pay
# - City: [Your city]
# - State: [Your state]
# - Country Code: NG

# Move keystore to safe location
mv alaskapay-release.keystore ~/alaskapay-release.keystore
cd ../..
```

### 4. Configure Signing in Android Studio

#### Create key.properties
```bash
# Create file: android/key.properties
cat > android/key.properties << EOF
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=alaskapay
storeFile=/Users/YOUR_USERNAME/alaskapay-release.keystore
EOF
```

#### Update build.gradle
File already configured in `android/app/build.gradle`

### 5. Build Release AAB

#### Option A: Command Line
```bash
# 1. Build web assets
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Build release AAB
cd android
./gradlew bundleRelease
cd ..

# AAB location:
# android/app/build/outputs/bundle/release/app-release.aab
```

#### Option B: Android Studio
```bash
# 1. Open Android Studio
npx cap open android

# 2. Build → Generate Signed Bundle/APK
# 3. Select "Android App Bundle"
# 4. Click "Next"
# 5. Select keystore file
# 6. Enter passwords
# 7. Click "Next"
# 8. Select "release" build variant
# 9. Click "Create"
```

### 6. Upload to Internal Testing

#### Create Internal Testing Release
1. Go to **Testing → Internal testing**
2. Click **Create new release**
3. Upload AAB file
4. Add release notes:
   ```
   Initial beta release for internal testing
   
   Features included:
   - User authentication
   - Wallet management
   - Money transfers
   - Bill payments
   - Virtual cards
   - KYC verification
   
   Please test all core features and report any issues.
   ```
5. Click **Save**
6. Click **Review release**
7. Click **Start rollout to Internal testing**

### 7. Add Testers

#### Create Tester List
1. Go to **Testing → Internal testing**
2. Click **Testers** tab
3. Click **Create email list**
4. Name: "Internal Testers"
5. Add email addresses (one per line)
6. Click **Save changes**

#### Share Test Link
1. Copy the **Internal test link**
2. Share with testers via email/Slack
3. Testers click link → **Download it on Google Play**

### 8. Tester Instructions

#### For Testers
1. Click the internal test link
2. Click **Download it on Google Play**
3. Accept invitation to become a tester
4. Click **Install** in Play Store
5. Open Alaska Pay from app drawer

#### Provide Feedback
- Use in-app feedback form
- Email: support@alaskapay.com
- Report bugs with screenshots

## 🔄 Updating Builds

### Upload New Version
```bash
# 1. Update version in android/app/build.gradle
# versionCode 2
# versionName "1.0.1"

# 2. Build web assets
npm run build

# 3. Sync to Android
npx cap sync android

# 4. Build release AAB
cd android
./gradlew bundleRelease
cd ..

# 5. Upload to Play Console
# Testing → Internal testing → Create new release
```

## 📊 Monitoring Testing

### View Statistics
- **Install metrics**: Number of installs
- **Crash rate**: Percentage of sessions with crashes
- **ANR rate**: App Not Responding rate
- **Feedback**: Tester comments

### Crash Reports
1. Go to **Quality → Crashes & ANRs**
2. View crash details
3. Download stack traces
4. Fix issues and upload new build

## ✅ Pre-Upload Checklist

- [ ] App builds without errors
- [ ] All features work on emulator
- [ ] Signing key generated and secured
- [ ] key.properties configured
- [ ] Release AAB built successfully
- [ ] App icon (512x512) ready
- [ ] Feature graphic (1024x500) ready
- [ ] Screenshots captured (min 2)
- [ ] Privacy policy URL is live
- [ ] Support email is monitored

## 🐛 Common Issues

### Build Failed
```bash
# Clean build
cd android
./gradlew clean
./gradlew bundleRelease
```

### Signing Error
- Verify key.properties paths are correct
- Check passwords are correct
- Ensure keystore file exists

### Upload Failed
- Check AAB is < 150MB
- Verify version code is higher than previous
- Ensure app ID matches (com.alaskapay.app)

### Testers Can't Install
- Verify email is added to tester list
- Check device meets minimum requirements
- Ensure device has Google Play Store
- Try removing and re-adding tester

## 📱 Device Requirements

### Minimum Requirements
- Android 5.1 (API 22) or higher
- Google Play Store installed
- 50MB free storage
- Internet connection

### Recommended
- Android 10 or higher
- 100MB free storage
- Good internet connection

## 🎯 Testing Best Practices

### Test Coverage
- Test on multiple Android versions
- Test on different manufacturers (Samsung, Pixel, etc.)
- Test with different screen sizes
- Test offline functionality
- Test all critical user flows

### Gather Feedback
- Ask specific questions
- Request screenshots of issues
- Track common problems
- Prioritize fixes

## 🚀 Moving to Production

### Closed Testing (Alpha/Beta)
After internal testing:
1. Go to **Testing → Closed testing**
2. Create alpha or beta track
3. Add more testers (up to 100,000)
4. Gather broader feedback

### Open Testing
Before production:
1. Go to **Testing → Open testing**
2. Anyone can join and test
3. Gather public feedback
4. Fix remaining issues

### Production Release
When ready:
1. Complete all store listing requirements
2. Complete content rating questionnaire
3. Set up pricing & distribution
4. Submit for review
5. Release to production

## 📚 Resources

- [Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)
- [Launch Checklist](https://developer.android.com/distribute/best-practices/launch/launch-checklist)

## 💡 Tips

1. **Test early, test often** - Upload builds frequently
2. **Use version codes** - Increment for each upload
3. **Write clear release notes** - Help testers understand changes
4. **Monitor crashes daily** - Fix crashes quickly
5. **Respond to feedback** - Engaged testers provide better feedback
6. **Keep keystore safe** - Back it up securely (can't republish without it)
7. **Test on real devices** - Emulators don't catch everything

## 🎉 Success!

Once your internal testing is live:
1. ✅ Testers can install and test
2. ✅ You receive feedback and crash reports
3. ✅ You can iterate quickly
4. ✅ You're ready for wider testing

Next: Move to Closed Testing → Open Testing → Production

## 🔐 Security Reminders

- **NEVER** commit keystore to git
- **NEVER** commit key.properties to git
- **ALWAYS** backup keystore securely
- **USE** strong passwords
- **STORE** keystore passwords in password manager

Add to `.gitignore`:
```
android/key.properties
*.keystore
*.jks
```

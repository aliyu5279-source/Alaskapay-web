# Google Play Console First-Time Setup Guide
## AlaskaPay Android App - pescotservices@gmail.com

## 🎯 Overview
Complete guide to create your Google Play Developer account, set up AlaskaPay on Google Play Console, and publish your first Android app.

---

## ✅ Prerequisites
- Google Account: pescotservices@gmail.com
- Payment Method: Credit/Debit card for $25 one-time registration fee
- AlaskaPay Android App Bundle (AAB file)
- App assets ready (icon, screenshots, descriptions)

---

## 📋 STEP 1: Create Google Play Developer Account

### 1.1 Start Registration
1. Go to: https://play.google.com/console/signup
2. Sign in with: **pescotservices@gmail.com**
3. Click **"Continue to account creation"**

### 1.2 Account Type Selection
- **Choose**: Individual (or Organization if you have a registered business)
- **Individual**: Faster approval, personal liability
- **Organization**: Requires business verification documents

### 1.3 Complete Developer Profile
```
Account Details:
- Developer Name: AlaskaPay (or your preferred public name)
- Email Address: pescotservices@gmail.com
- Phone Number: Your contact number
- Website: https://alaskapay.com (if available)
```

### 1.4 Accept Agreements
- Read and accept Google Play Developer Distribution Agreement
- Accept Google Play Developer Program Policies
- Consent to US export laws compliance

### 1.5 Pay Registration Fee
- **Amount**: $25 USD (one-time, lifetime access)
- **Payment**: Credit/Debit card or Google Pay
- **Processing**: Instant payment confirmation

### 1.6 Identity Verification
- Google may require ID verification (passport, driver's license)
- Upload clear photo of government-issued ID
- Verification takes 24-48 hours typically

**⏱️ Expected Time**: 30 minutes + 1-2 days for verification

---

## 📱 STEP 2: Create AlaskaPay App in Play Console

### 2.1 Access Play Console
1. Go to: https://play.google.com/console
2. Sign in with pescotservices@gmail.com
3. Click **"Create app"**

### 2.2 App Details
```
App Name: AlaskaPay
Default Language: English (United States)
App or Game: App
Free or Paid: Free
```

### 2.3 Declarations
- [ ] I confirm this app complies with Google Play policies
- [ ] I confirm this app complies with US export laws
- [ ] I acknowledge Google Play Developer Program Policies

**Click "Create app"**

---

## 🎨 STEP 3: Complete App Listing

### 3.1 Store Listing (Dashboard → Store presence → Main store listing)

**App Details:**
```
App Name: AlaskaPay
Short Description (80 chars):
"Secure digital wallet for instant transfers, bill payments & virtual cards"

Full Description (4000 chars max):
[Use content from PLAY_STORE_DESCRIPTION.md]

Key Features:
• Instant money transfers
• Bill payments & airtime top-up
• Virtual card creation
• Multi-currency support
• Biometric security
• Real-time notifications
```

**App Icon:**
- Size: 512 x 512 px
- Format: PNG (32-bit)
- Max: 1 MB
- Location: `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

**Feature Graphic:**
- Size: 1024 x 500 px
- Format: PNG or JPEG
- Required for featured placement

**Screenshots (Required - minimum 2):**
- Phone: 16:9 or 9:16 ratio
- Recommended: 1080 x 1920 px
- Minimum 2, maximum 8 screenshots
- [Use PLAY_STORE_SCREENSHOTS.md for guidance]

**7-inch Tablet Screenshots (Optional but recommended):**
- 1200 x 1920 px minimum

**10-inch Tablet Screenshots (Optional):**
- 1800 x 2560 px minimum

### 3.2 Categorization
```
App Category: Finance
Tags: wallet, payment, money transfer, bills
```

### 3.3 Contact Details
```
Email: pescotservices@gmail.com
Phone: [Your support number]
Website: https://alaskapay.com
```

### 3.4 Privacy Policy
- **Required for Finance apps**
- URL: https://alaskapay.com/privacy-policy
- Must be publicly accessible
- [Content in PRIVACY_POLICY.md]

---

## 🔐 STEP 4: App Content & Privacy

### 4.1 Privacy & Security (Dashboard → Policy → App content)

**Privacy Policy:**
- Add URL: https://alaskapay.com/privacy-policy

**Data Safety:**
- [ ] Does app collect or share user data? **YES**
- Data types collected:
  - ✓ Personal info (name, email, phone)
  - ✓ Financial info (payment info, transaction history)
  - ✓ Location (approximate)
  - ✓ Device ID
- Data security:
  - ✓ Data encrypted in transit
  - ✓ Data encrypted at rest
  - ✓ Users can request data deletion
  - ✓ Committed to Play Families Policy

### 4.2 Content Rating
1. Click **"Start questionnaire"**
2. Select category: **Finance**
3. Answer questions honestly:
   - Violence: None
   - Sexual content: None
   - Profanity: None
   - Controlled substances: None
4. Submit for rating (usually E for Everyone)

### 4.3 Target Audience
```
Target Age: 18+
```

### 4.4 News Apps (Skip - not applicable)

### 4.5 COVID-19 Contact Tracing (Skip - not applicable)

### 4.6 Data Safety
- Complete detailed data collection disclosure
- Specify encryption and security measures

### 4.7 Government Apps (Skip unless applicable)

### 4.8 Financial Features
- [ ] App offers financial features? **YES**
- [ ] App facilitates money transfers? **YES**
- [ ] App offers virtual cards? **YES**

---

## 📦 STEP 5: Build and Upload App Bundle

### 5.1 Generate Signed AAB (Android App Bundle)

**Option A: Using Android Studio**
```bash
# Open project in Android Studio
cd android

# Build → Generate Signed Bundle/APK
# Select: Android App Bundle (AAB)
# Create new keystore or use existing
```

**Option B: Command Line**
```bash
cd android

# Generate release AAB
./gradlew bundleRelease

# Output location:
# android/app/build/outputs/bundle/release/app-release.aab
```

### 5.2 Create Upload Keystore (First Time Only)
```bash
keytool -genkey -v -keystore alaskapay-upload-key.keystore \
  -alias alaskapay -keyalg RSA -keysize 2048 -validity 10000

# Save keystore details:
Keystore Password: [SAVE SECURELY]
Key Alias: alaskapay
Key Password: [SAVE SECURELY]
```

**⚠️ CRITICAL: Backup keystore file and passwords securely!**

### 5.3 Configure Signing in build.gradle
```gradle
// android/app/build.gradle
android {
    signingConfigs {
        release {
            storeFile file('alaskapay-upload-key.keystore')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
            keyAlias 'alaskapay'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 5.4 Upload to Play Console
1. Go to: **Production → Create new release**
2. Click **"Upload"**
3. Select your AAB file: `app-release.aab`
4. Wait for upload and processing (5-10 minutes)

### 5.5 Release Notes
```
Version 1.0.0

What's New:
• Secure digital wallet with biometric authentication
• Instant money transfers to any bank account
• Pay bills and buy airtime seamlessly
• Create virtual cards for online payments
• Multi-currency support
• Real-time transaction notifications
• 24/7 customer support
```

---

## 🧪 STEP 6: Testing Tracks (Recommended)

### 6.1 Internal Testing (Optional but recommended)
1. Go to: **Testing → Internal testing**
2. Create release with same AAB
3. Add testers: pescotservices@gmail.com
4. Share testing link
5. Test for 1-2 days

### 6.2 Closed Testing (Optional)
1. Go to: **Testing → Closed testing**
2. Create release
3. Add up to 100 testers
4. Gather feedback for 1-2 weeks

### 6.3 Open Testing (Optional)
- Public beta before production
- Anyone can join and test
- Good for final validation

---

## 🚀 STEP 7: Production Release

### 7.1 Pre-Launch Report
- Google automatically tests your app on real devices
- Review crash reports and compatibility issues
- Fix any critical issues before proceeding

### 7.2 Countries and Regions
```
Distribution:
- Select countries: All countries (or specific regions)
- Exclude countries: None (or add exclusions)
```

### 7.3 Pricing & Distribution
```
Price: Free
Contains Ads: No (unless you have ads)
Contains In-App Purchases: Yes (if applicable)

Distribution Channels:
✓ Google Play Store
```

### 7.4 Review and Rollout
1. Click **"Review release"**
2. Check all sections are complete (green checkmarks)
3. Fix any warnings or errors
4. Click **"Start rollout to Production"**
5. Confirm rollout

**⏱️ Review Time**: 1-7 days (usually 24-48 hours)

---

## 📊 STEP 8: Post-Launch Monitoring

### 8.1 Monitor Release Status
- Dashboard → Production
- Check for "Published" status
- Note: Can take 2-4 hours to appear in Play Store after approval

### 8.2 Track Metrics
- **Dashboard → Statistics**
  - Installs
  - Uninstalls
  - Ratings & Reviews
  - Crashes & ANRs

### 8.3 Respond to Reviews
- Set up email alerts for new reviews
- Respond within 24-48 hours
- Address issues professionally

### 8.4 Monitor Crashes
- Dashboard → Quality → Android vitals
- Fix crashes in priority order
- Release updates as needed

---

## 🔄 STEP 9: Update Process (Future Releases)

### 9.1 Version Code Management
```gradle
// android/app/build.gradle
android {
    defaultConfig {
        versionCode 2  // Increment by 1 for each release
        versionName "1.0.1"  // Semantic versioning
    }
}
```

### 9.2 Create New Release
1. Build new AAB with incremented versionCode
2. Go to: **Production → Create new release**
3. Upload new AAB
4. Add release notes describing changes
5. Review and rollout

### 9.3 Staged Rollout (Recommended)
- Start with 20% of users
- Monitor for 24 hours
- Increase to 50%, then 100%
- Pause/halt if issues detected

---

## ⚠️ Common Issues & Solutions

### Issue 1: "App Bundle Not Signed"
**Solution**: Ensure you've configured signing in build.gradle with valid keystore

### Issue 2: "Package Name Already Exists"
**Solution**: Change applicationId in build.gradle to unique value

### Issue 3: "Missing Required Screenshots"
**Solution**: Upload minimum 2 phone screenshots in correct dimensions

### Issue 4: "Privacy Policy URL Not Accessible"
**Solution**: Ensure privacy policy page is live and publicly accessible

### Issue 5: "Content Rating Not Completed"
**Solution**: Complete content rating questionnaire in App content section

### Issue 6: "Data Safety Section Incomplete"
**Solution**: Fill out all data collection and security practices

---

## 📋 Quick Checklist

**Before Submission:**
- [ ] Google Play Developer account created and verified
- [ ] $25 registration fee paid
- [ ] App created in Play Console
- [ ] Store listing completed (title, description, screenshots)
- [ ] App icon uploaded (512x512 px)
- [ ] Privacy policy URL added
- [ ] Data safety section completed
- [ ] Content rating obtained
- [ ] Signed AAB file generated
- [ ] AAB uploaded to Production track
- [ ] Release notes written
- [ ] Countries/regions selected
- [ ] All sections show green checkmarks

**After Submission:**
- [ ] Monitor review status daily
- [ ] Check email for Google Play updates
- [ ] Prepare for user reviews and feedback
- [ ] Set up crash monitoring
- [ ] Plan first update based on feedback

---

## 🎯 Timeline Estimate

| Phase | Duration |
|-------|----------|
| Developer account creation | 30 minutes |
| Identity verification | 1-2 days |
| App listing setup | 2-3 hours |
| Build and upload AAB | 1 hour |
| Google Play review | 1-7 days |
| **Total Time to Launch** | **3-10 days** |

---

## 📞 Support Resources

**Google Play Console Help:**
- https://support.google.com/googleplay/android-developer

**Developer Policy Center:**
- https://play.google.com/about/developer-content-policy/

**Play Console:**
- https://play.google.com/console

**AlaskaPay Support:**
- Email: pescotservices@gmail.com

---

## 🎉 Success!

Once approved, your app will be live on Google Play Store at:
**https://play.google.com/store/apps/details?id=com.alaskapay.app**

Share this link with users to download AlaskaPay!

---

**Next Steps After Launch:**
1. Monitor user reviews and ratings
2. Track crash reports and fix issues
3. Gather user feedback
4. Plan feature updates
5. Optimize store listing based on performance
6. Consider paid marketing campaigns

Good luck with your launch! 🚀

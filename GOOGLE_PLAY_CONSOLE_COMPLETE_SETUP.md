# 🤖 Google Play Console - Complete Setup Guide

## Prerequisites
- Google Play Developer Account ($25 one-time)
- Android app built and signed
- App icons and screenshots ready
- Privacy policy URL

## Step 1: Create App in Play Console

### 1.1 Login to Play Console
Visit: https://play.google.com/console

### 1.2 Create New App
1. Click "Create app"
2. Fill in details:
   ```
   App name: AlaskaPay
   Default language: English (United States)
   App or game: App
   Free or paid: Free
   ```
3. Accept declarations
4. Click "Create app"

## Step 2: Store Listing

### 2.1 App Details
```
App name: AlaskaPay
Short description (80 chars):
Fast & secure mobile payments. Send money, pay bills, manage finances easily.

Full description (4000 chars):
AlaskaPay - Your Complete Mobile Payment Solution

Transform the way you handle money with AlaskaPay, Nigeria's fastest-growing mobile payment platform. Send money, pay bills, and manage your finances all in one secure app.

🚀 KEY FEATURES

INSTANT TRANSFERS
• Send money to anyone in seconds
• Transfer to any Nigerian bank
• Split bills with friends
• Request payments easily

BILL PAYMENTS
• Buy airtime for all networks
• Purchase data bundles
• Pay electricity bills
• Pay for cable TV subscriptions
• Water and waste bills

VIRTUAL CARDS
• Create instant virtual cards
• Shop online securely
• Control spending limits
• Freeze/unfreeze anytime

WALLET MANAGEMENT
• Track all transactions
• Export statements
• Set budgets and goals
• Real-time balance updates

BANK INTEGRATION
• Link multiple bank accounts
• Instant bank transfers
• Withdraw to any bank
• View all accounts in one place

QR PAYMENTS
• Scan to pay merchants
• Generate your payment QR
• Contactless transactions
• Fast checkout

🔒 SECURITY FIRST

• Bank-level 256-bit encryption
• Biometric authentication (fingerprint/face)
• Transaction PIN protection
• 24/7 fraud monitoring
• Instant transaction alerts
• Secure cloud backup

💰 AFFORDABLE & TRANSPARENT

• Low transaction fees
• No hidden charges
• Clear pricing
• Free transfers to AlaskaPay users
• Referral rewards program

🎁 REWARDS & BENEFITS

• Earn on every referral
• Cashback on transactions
• Loyalty points
• Exclusive offers
• Premium membership options

📊 FINANCIAL INSIGHTS

• Spending analytics
• Category tracking
• Monthly reports
• Budget alerts
• Savings goals

🌟 WHY CHOOSE ALASKAPAY?

✓ Licensed and regulated
✓ 100% Nigerian
✓ 24/7 customer support
✓ Fast and reliable
✓ User-friendly interface
✓ Regular updates

Download AlaskaPay today and join thousands of Nigerians managing their money smarter!

For support: support@alaskapay.com
Website: https://alaskapay.com
```

### 2.2 Graphics Assets

**App Icon**
- Size: 512 x 512 px
- Format: PNG (32-bit)
- No transparency

**Feature Graphic**
- Size: 1024 x 500 px
- Format: PNG or JPEG
- Showcases app on store listing

**Phone Screenshots** (2-8 required)
- Min: 320 px
- Max: 3840 px
- Ratio: 16:9 to 2:1

**7-inch Tablet Screenshots** (optional)
- Min: 320 px
- Max: 3840 px

**10-inch Tablet Screenshots** (optional)
- Min: 1080 px
- Max: 7680 px

### 2.3 Categorization
```
App category: Finance
Tags: payments, wallet, banking, bills, transfer
```

### 2.4 Contact Details
```
Email: support@alaskapay.com
Phone: +234-XXX-XXX-XXXX
Website: https://alaskapay.com
```

### 2.5 Privacy Policy
```
URL: https://alaskapay.com/privacy-policy
```

## Step 3: App Content

### 3.1 Privacy & Security

**Data Safety Section**
```
Data collected:
✓ Personal info (Name, Email, Phone)
✓ Financial info (Payment info, Purchase history)
✓ Location (Approximate location)
✓ Photos (For KYC verification)
✓ Device ID (For security)

Data usage:
- App functionality
- Fraud prevention
- Analytics
- Personalization
- Account management

Data sharing:
- Payment processors (Paystack)
- Analytics services
- Cloud services (Supabase)

Security practices:
✓ Data encrypted in transit
✓ Data encrypted at rest
✓ Users can request data deletion
✓ Committed to Play Families Policy
```

### 3.2 App Access
```
Provides access to: Financial services
Requires special access: No
```

### 3.3 Ads
```
Contains ads: No
```

### 3.4 Content Rating
Complete questionnaire:
```
App category: Finance
Violence: No
Sexual content: No
Language: No
Controlled substances: No
Gambling: No
User interaction: Yes (users can interact)
Shares location: Yes (for fraud prevention)
Shares personal info: No
```

Expected rating: **Everyone**

### 3.5 Target Audience
```
Target age: 18+
Designed for children: No
```

### 3.6 News Apps
```
Is this a news app: No
```

## Step 4: App Bundle Upload

### 4.1 Generate Signed Bundle
```bash
cd android
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
```

### 4.2 Create Release

**Internal Testing**
1. Go to Testing → Internal testing
2. Create new release
3. Upload AAB file
4. Add release notes:
```
Version 1.0.0 (Build 1)

Initial release features:
• Send and receive money
• Pay bills (airtime, data, electricity)
• Create virtual cards
• Link bank accounts
• QR code payments
• Biometric security
• Transaction history

This is a test version. Please report any issues to beta@alaskapay.com
```
5. Save and review
6. Start rollout to internal testing

### 4.3 Add Testers
```
Create email list:
- Add up to 100 internal testers
- Or create Google Group
- Share opt-in URL with testers
```

## Step 5: Closed Testing

### 5.1 Create Closed Track
1. Go to Testing → Closed testing
2. Create new track
3. Create release (same as internal)
4. Add testers (up to 100 lists)

### 5.2 Opt-in URL
```
Share with testers:
https://play.google.com/apps/testing/com.alaskapay.app
```

## Step 6: Production Release

### 6.1 Countries
```
Available in: All countries (or select specific)
Excluded: None (or select to exclude)
```

### 6.2 Create Production Release
1. Go to Production
2. Create new release
3. Upload AAB
4. Release notes:
```
🎉 Welcome to AlaskaPay v1.0!

NEW FEATURES:
• Instant money transfers
• Bill payments (airtime, data, utilities)
• Virtual card creation
• Bank account linking
• QR code payments
• Biometric authentication
• Real-time transaction tracking

SECURITY:
• Bank-level encryption
• PIN protection
• Fraud monitoring
• Secure cloud backup

Get started with ₦1,000 welcome bonus!

Need help? Contact support@alaskapay.com
```

### 6.3 Rollout Options
- **Staged rollout**: 1% → 5% → 10% → 20% → 50% → 100%
- **Full rollout**: 100% immediately

### 6.4 Submit for Review
1. Complete all required sections
2. Review summary
3. Click "Start rollout to Production"
4. Wait for review (typically 1-3 days)

## Step 7: In-App Products

### 7.1 Create Subscriptions
```
Product ID: premium_tier_1
Name: Premium Tier 1
Description: Higher limits, priority support, no fees
Price: ₦999/month
Free trial: 7 days
Billing period: 1 month
Grace period: 3 days

Product ID: premium_tier_2
Name: Premium Tier 2
Description: Unlimited transactions, API access, custom reports
Price: ₦2,999/month
Free trial: 14 days
Billing period: 1 month
Grace period: 3 days
```

### 7.2 Subscription Benefits
```
Tier 1:
• Higher transaction limits
• Priority customer support
• Zero transfer fees
• Advanced analytics
• Transaction export

Tier 2:
• Unlimited transactions
• Dedicated account manager
• API access
• Custom reports
• White-label options
• Early access to features
```

## Step 8: Store Presence

### 8.1 Main Store Listing
- Complete all required fields
- Add high-quality screenshots
- Create compelling description
- Add feature graphic

### 8.2 Custom Store Listings (Optional)
Create localized versions for:
- English (Nigeria)
- Yoruba
- Igbo
- Hausa

## Step 9: Pre-Launch Report

### 9.1 Run Pre-Launch Tests
1. Go to Release → Testing → Pre-launch report
2. Google automatically tests on real devices
3. Review results:
   - Crashes
   - Performance issues
   - Security vulnerabilities
   - Accessibility issues

### 9.2 Fix Issues
- Address critical issues before launch
- Optional: Fix warnings
- Re-upload if needed

## Step 10: Post-Launch

### 10.1 Monitor Metrics
- Installs
- Uninstalls
- Crashes
- ANRs (App Not Responding)
- Ratings & Reviews

### 10.2 Respond to Reviews
- Reply to user feedback
- Address complaints
- Thank positive reviews
- Fix reported issues

### 10.3 Update Regularly
- Release updates every 2-4 weeks
- Fix bugs promptly
- Add new features
- Improve performance

## App Signing

### Using Google Play App Signing (Recommended)
1. Go to Setup → App signing
2. Enroll in Google Play App Signing
3. Upload your signing key
4. Google manages signing

### Benefits
- Lost key recovery
- Separate upload and signing keys
- Improved security
- Easier key rotation

## Troubleshooting

### Upload Failed
- Check AAB is properly signed
- Verify version code is incremented
- Ensure package name matches
- Check for duplicate version

### Rejected by Review
- Read rejection reason
- Fix policy violations
- Update content if needed
- Resubmit

### Can't Find App on Store
- Check app is published
- Verify country availability
- Search by package name
- Clear Play Store cache

---

**Need Help?** Check Google Play Console Help Center or contact support

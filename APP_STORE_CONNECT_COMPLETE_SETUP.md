# 🍎 App Store Connect - Complete Setup Guide

## Prerequisites
- Apple Developer Account ($99/year)
- Xcode 15+ installed
- iOS app built and signed
- App icons and screenshots ready

## Step 1: Create App in App Store Connect

### 1.1 Login to App Store Connect
Visit: https://appstoreconnect.apple.com

### 1.2 Create New App
1. Click "My Apps" → "+" → "New App"
2. Fill in details:
   ```
   Platform: iOS
   Name: AlaskaPay
   Primary Language: English (U.S.)
   Bundle ID: com.alaskapay.app
   SKU: alaskapay-ios-001
   User Access: Full Access
   ```

### 1.3 App Information
```
Name: AlaskaPay
Subtitle: Fast & Secure Mobile Payments
Category: Finance
Secondary Category: Utilities
```

## Step 2: App Privacy Configuration

### 2.1 Privacy Policy URL
```
https://alaskapay.com/privacy-policy
```

### 2.2 Data Collection (Select all that apply)
**Contact Info**:
- ✓ Email Address (Account creation)
- ✓ Phone Number (Verification)
- ✓ Name (KYC verification)

**Financial Info**:
- ✓ Payment Info (Transactions)
- ✓ Credit/Debit Card Numbers (Virtual cards)
- ✓ Bank Account Numbers (Withdrawals)

**Location**:
- ✓ Coarse Location (Fraud prevention)

**User Content**:
- ✓ Photos (KYC documents)

**Identifiers**:
- ✓ User ID (Account management)
- ✓ Device ID (Security)

**Usage Data**:
- ✓ Product Interaction (Analytics)

### 2.3 Data Use Purposes
- Account creation and management
- Payment processing
- Fraud prevention and security
- Customer support
- App functionality
- Analytics

### 2.4 Third-Party Data Sharing
- Paystack (Payment processing)
- Supabase (Backend services)
- Sentry (Error tracking)

## Step 3: App Store Listing

### 3.1 App Description
```
AlaskaPay - Your Complete Mobile Payment Solution

Send money, pay bills, and manage your finances with ease. AlaskaPay offers:

✓ Instant Transfers - Send money to anyone in seconds
✓ Bill Payments - Pay airtime, data, electricity, and more
✓ Virtual Cards - Create cards for online shopping
✓ Bank Integration - Link your bank accounts securely
✓ QR Payments - Scan to pay at any merchant
✓ Wallet Management - Track all your transactions

SECURE & TRUSTED
- Bank-level encryption
- Biometric authentication
- Transaction PIN protection
- 24/7 fraud monitoring

FAST & CONVENIENT
- Instant transfers
- Quick bill payments
- Easy top-ups
- Simple withdrawals

AFFORDABLE
- Low transaction fees
- No hidden charges
- Transparent pricing
- Referral rewards

Download AlaskaPay today and experience the future of mobile payments!
```

### 3.2 Keywords (100 characters max)
```
payment,wallet,transfer,bills,airtime,bank,money,finance,card,pay
```

### 3.3 Support URL
```
https://alaskapay.com/support
```

### 3.4 Marketing URL
```
https://alaskapay.com
```

### 3.5 Promotional Text (170 characters)
```
🎉 Limited Time: Get ₦1,000 bonus when you sign up! Send money, pay bills, and earn rewards. Download now!
```

## Step 4: App Screenshots

### Required Sizes
- 6.7" (iPhone 15 Pro Max): 1290 x 2796 px
- 6.5" (iPhone 11 Pro Max): 1242 x 2688 px
- 5.5" (iPhone 8 Plus): 1242 x 2208 px

### Screenshot Sequence (6-10 images)
1. **Hero/Welcome Screen**
   - App logo and tagline
   - "Fast & Secure Mobile Payments"

2. **Dashboard**
   - Wallet balance
   - Quick actions
   - Recent transactions

3. **Send Money**
   - Transfer interface
   - Contact selection
   - Amount input

4. **Bill Payments**
   - Service categories
   - Quick pay options
   - Saved billers

5. **Virtual Cards**
   - Card display
   - Card management
   - Funding options

6. **Security Features**
   - Biometric auth
   - PIN protection
   - Transaction alerts

### Screenshot Guidelines
- Use real app interface (not mockups)
- Show actual features and functionality
- Include device frame (optional)
- Add text overlays highlighting features
- Use consistent branding
- High resolution (2x or 3x)

## Step 5: App Preview Video

### Video Specifications
- Duration: 15-30 seconds
- Resolution: 1080p or 4K
- Format: .mov, .m4v, or .mp4
- Orientation: Portrait
- File size: <500 MB

### Video Storyboard
```
0:00-0:03 - App logo animation
0:03-0:08 - Dashboard overview
0:08-0:13 - Send money demo
0:13-0:18 - Pay bills demo
0:18-0:23 - Virtual card creation
0:23-0:28 - Security features
0:28-0:30 - Call to action
```

## Step 6: Build Upload

### 6.1 Archive App in Xcode
```bash
# Open project
cd ios/App
open App.xcworkspace

# In Xcode:
# Product → Archive
# Wait for archive to complete
```

### 6.2 Upload to App Store Connect
1. Window → Organizer
2. Select archive
3. Click "Distribute App"
4. Choose "App Store Connect"
5. Upload
6. Wait for processing (15-30 min)

### 6.3 Select Build
1. Go to App Store Connect
2. Select your app
3. Click "+" next to Build
4. Select uploaded build
5. Answer export compliance questions

## Step 7: TestFlight Setup

### 7.1 Internal Testing
1. Go to TestFlight tab
2. Add internal testers (up to 100)
3. Enter emails of team members
4. They'll receive invite automatically

### 7.2 External Testing
1. Create test group
2. Add external testers (up to 10,000)
3. Submit for Beta App Review
4. Wait for approval (24-48 hours)
5. Share public link with testers

### 7.3 TestFlight Information
```
Beta App Description:
Test the latest version of AlaskaPay before public release. 
Help us improve by reporting bugs and suggesting features.

Feedback Email: beta@alaskapay.com

What to Test:
- Send and receive money
- Pay bills
- Create virtual cards
- Link bank accounts
- Security features
```

## Step 8: App Review Submission

### 8.1 Version Information
```
Version: 1.0.0
Copyright: 2024 AlaskaPay
```

### 8.2 App Review Information
```
Contact Information:
First Name: [Your Name]
Last Name: [Your Name]
Phone: [Your Phone]
Email: support@alaskapay.com

Demo Account:
Username: demo@alaskapay.test
Password: Demo123!@#

Notes:
This is a financial app for mobile payments in Nigeria.
Test account is pre-funded with ₦10,000 for testing.
All transactions are in test mode.
```

### 8.3 Rating
- Age Rating: 4+
- Gambling: No
- Contests: No
- Made for Kids: No

### 8.4 Submit for Review
1. Complete all required fields
2. Add build
3. Click "Submit for Review"
4. Wait for review (1-3 days)

## Step 9: In-App Purchases

### 9.1 Create Subscriptions
```
Premium Tier 1:
Product ID: com.alaskapay.premium.tier1
Type: Auto-renewable subscription
Price: ₦999/month
Free Trial: 7 days
Benefits:
- Higher transaction limits
- Priority support
- No transfer fees
- Advanced analytics

Premium Tier 2:
Product ID: com.alaskapay.premium.tier2
Type: Auto-renewable subscription
Price: ₦2,999/month
Free Trial: 14 days
Benefits:
- Unlimited transactions
- Dedicated account manager
- API access
- Custom reports
- White-label options
```

### 9.2 Subscription Groups
```
Group Name: AlaskaPay Premium
Subscriptions: Tier 1, Tier 2
```

## Step 10: Post-Approval

### 10.1 Release Options
- **Manual**: Release when you click button
- **Automatic**: Release immediately after approval
- **Scheduled**: Release on specific date/time

### 10.2 Phased Release
- Day 1: 1% of users
- Day 2: 2% of users
- Day 3: 5% of users
- Day 4: 10% of users
- Day 5: 20% of users
- Day 6: 50% of users
- Day 7: 100% of users

### 10.3 Monitor Metrics
- Downloads
- Crashes
- Ratings & Reviews
- Conversion rate
- Revenue

## Troubleshooting

### Build Upload Failed
- Check provisioning profiles
- Verify bundle ID matches
- Update Xcode to latest version
- Check for code signing issues

### Rejected by App Review
- Read rejection reason carefully
- Fix issues mentioned
- Respond to reviewer if needed
- Resubmit with changes

### TestFlight Not Working
- Check tester email is correct
- Verify build is processed
- Ensure TestFlight app is installed
- Check for expired builds (90 days)

---

**Need Help?** Check Apple's official documentation or contact Apple Developer Support

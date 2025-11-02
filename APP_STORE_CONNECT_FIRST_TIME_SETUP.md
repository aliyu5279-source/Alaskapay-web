# 🍎 App Store Connect - First Time Setup Guide

## Step 1: Create Apple Developer Account (15 minutes)

### A. Sign Up for Apple Developer Program
1. Go to: https://developer.apple.com/programs/enroll/
2. Click **"Start Your Enrollment"**
3. Sign in with your Apple ID: **pescotservices@gmail.com**
   - If you don't have an Apple ID, create one at: https://appleid.apple.com/
4. Complete the enrollment form:
   - Entity Type: **Individual** or **Organization**
   - Legal Name: Your full name or company name
   - Contact Information
5. **Pay the $99/year enrollment fee**
6. Wait for approval (usually 24-48 hours)

### B. Verify Your Email
- Check **pescotservices@gmail.com** for verification email
- Click the verification link

---

## Step 2: Access App Store Connect (5 minutes)

Once your Apple Developer account is approved:

1. Go to: https://appstoreconnect.apple.com/
2. Sign in with: **pescotservices@gmail.com**
3. You'll see the App Store Connect dashboard

---

## Step 3: Create AlaskaPay App (10 minutes)

### A. Create New App
1. In App Store Connect, click **"My Apps"**
2. Click the **"+"** button → **"New App"**
3. Fill in the details:
   - **Platform:** iOS
   - **Name:** AlaskaPay
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** Register new Bundle ID
     - Go to: https://developer.apple.com/account/resources/identifiers/list
     - Click **"+"** → **App IDs** → **Continue**
     - Description: **AlaskaPay**
     - Bundle ID: **com.alaskapay.app** (explicit)
     - Capabilities: Enable **Push Notifications**, **In-App Purchase**, **Sign in with Apple**
     - Click **Continue** → **Register**
   - **SKU:** ALASKAPAY001
   - **User Access:** Full Access

### B. Fill App Information
1. **App Information** tab:
   - Category: **Finance**
   - Secondary Category: **Utilities**
   - Content Rights: Check if you own all rights

2. **Pricing and Availability**:
   - Price: **Free**
   - Availability: **All countries**

---

## Step 4: Prepare App Store Listing (30 minutes)

### A. App Privacy
1. Go to **App Privacy** section
2. Click **"Get Started"**
3. Answer privacy questions (see APP_STORE_PRIVACY_DETAILS.md)

### B. Screenshots (Required)
You need screenshots for:
- **6.5" Display** (iPhone 14 Pro Max): 1290 x 2796 pixels
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 pixels

See APP_STORE_SCREENSHOTS_FINAL.md for templates

### C. App Description
```
AlaskaPay - Your Digital Wallet for Nigeria

Send money, pay bills, and manage your finances with ease. AlaskaPay offers instant transfers, virtual cards, bill payments, and secure wallet management.

KEY FEATURES:
• Instant Money Transfers
• Virtual Card Creation
• Bill Payments (Airtime, Data, Electricity)
• Bank Account Linking
• Transaction History & Analytics
• Biometric Security
• 24/7 Customer Support

SECURE & RELIABLE
Bank-level encryption and biometric authentication keep your money safe.

Download AlaskaPay today and experience seamless digital payments!
```

---

## Step 5: Build & Upload App (20 minutes)

### A. Install Xcode
1. Download from Mac App Store: https://apps.apple.com/us/app/xcode/id497799835
2. Install (requires macOS)

### B. Build & Archive
```bash
cd ios/App
fastlane beta
```

This will:
- Build the app
- Create archive
- Upload to TestFlight
- Submit for review

---

## Step 6: TestFlight Beta Testing (Optional)

1. In App Store Connect → **TestFlight** tab
2. Add internal testers:
   - Click **"+"** next to Internal Testing
   - Add email: **pescotservices@gmail.com**
3. Testers will receive email invitation
4. Download TestFlight app on iPhone
5. Install AlaskaPay beta

---

## Step 7: Submit for Review (10 minutes)

1. Go to **App Store** tab (not TestFlight)
2. Click **"+ Version or Platform"** → **iOS**
3. Version: **1.0.0**
4. Fill all required fields:
   - Screenshots ✓
   - Description ✓
   - Keywords ✓
   - Support URL ✓
   - Privacy Policy URL ✓
5. Click **"Add for Review"**
6. Answer review questions
7. Click **"Submit for Review"**

---

## ⚠️ IMPORTANT: You Need a Mac

To build and upload iOS apps, you MUST have:
- **Mac computer** (MacBook, iMac, Mac Mini)
- **macOS 13.0 or later**
- **Xcode 14.0 or later**

**Alternative if you don't have a Mac:**
- Use **Expo EAS Build** (cloud build service)
- Use **Codemagic** (CI/CD with Mac builders)
- Rent a **Mac in the cloud** (MacStadium, AWS Mac instances)

---

## Quick Checklist

- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Wait for approval (24-48 hours)
- [ ] Access App Store Connect
- [ ] Create AlaskaPay app listing
- [ ] Register Bundle ID: com.alaskapay.app
- [ ] Prepare screenshots and description
- [ ] Fill app privacy details
- [ ] Build app on Mac with Xcode
- [ ] Upload to TestFlight
- [ ] Submit for App Store review

---

## Need Help?

**Apple Developer Support:**
- Email: developer@apple.com
- Phone: 1-800-633-2152 (US)
- Forum: https://developer.apple.com/forums/

**Common Issues:**
- **"Payment declined"**: Use different credit card
- **"Enrollment pending"**: Wait 24-48 hours
- **"Can't access App Store Connect"**: Developer account not approved yet
- **"Need D-U-N-S number"**: Only for Organization accounts

---

## Next Steps After Approval

1. ✅ Access granted to App Store Connect
2. 📱 Create AlaskaPay app listing
3. 🖼️ Upload screenshots and assets
4. 🔨 Build app with Xcode
5. ☁️ Upload to TestFlight
6. 🧪 Test with beta testers
7. 📝 Submit for App Store review
8. 🚀 Launch on App Store!

**Timeline:** 3-7 days from enrollment to App Store submission

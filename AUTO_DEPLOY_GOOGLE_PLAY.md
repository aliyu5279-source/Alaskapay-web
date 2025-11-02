# 🚀 Automatic Deployment to Google Play Store

## ✅ Prerequisites Setup (One-Time)

### 1. Create Google Play Console Account
- Go to [Google Play Console](https://play.google.com/console)
- Pay $25 one-time registration fee
- Complete account setup

### 2. Create Your App Listing
1. Click **Create app**
2. Fill in:
   - App name: **AlaskaPay**
   - Default language: **English (United States)**
   - App type: **App**
   - Free or paid: **Free**
3. Accept declarations and create

### 3. Generate Service Account Key

**Step A: Google Cloud Console**
```bash
# Go to: https://console.cloud.google.com
# 1. Select your project (or create new one)
# 2. Navigate to: IAM & Admin → Service Accounts
# 3. Click "Create Service Account"
#    - Name: alaska-pay-deploy
#    - Role: Service Account User
# 4. Click on created account → Keys → Add Key → Create New Key
# 5. Choose JSON → Download file
```

**Step B: Link to Play Console**
```bash
# 1. Go to Play Console → Setup → API access
# 2. Click "Link" next to your service account
# 3. Grant permissions: Admin (all permissions)
# 4. Click "Invite user" → Send invitation
```

### 4. Create Android Signing Keystore

```bash
# Generate keystore (run locally)
keytool -genkey -v -keystore alaska-pay.keystore \
  -alias alaska-pay -keyalg RSA -keysize 2048 -validity 10000

# Enter details when prompted:
# - Password: [SAVE THIS - ANDROID_KEYSTORE_PASSWORD]
# - Name: Alaska Pay
# - Organization: Your Company
# - City, State, Country: Your details

# Convert to Base64 for GitHub
base64 alaska-pay.keystore > keystore-base64.txt
# Copy contents of keystore-base64.txt
```

## 🔐 Add Secrets to GitHub

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Value | How to Get |
|------------|-------|------------|
| `PLAY_STORE_JSON_KEY` | Full JSON content | From Step 3A (service account JSON file) |
| `ANDROID_KEYSTORE_BASE64` | Base64 string | From Step 4 (keystore-base64.txt) |
| `ANDROID_KEYSTORE_PASSWORD` | Your password | From Step 4 (password you entered) |
| `ANDROID_KEY_ALIAS` | `alaska-pay` | From Step 4 (alias you used) |
| `ANDROID_KEY_PASSWORD` | Same as keystore password | Usually same as keystore password |

## 🎯 Deploy Now!

### Option 1: GitHub Actions (Recommended)

```bash
# 1. Go to: GitHub Repo → Actions → "Deploy Android to Play Store"
# 2. Click "Run workflow"
# 3. Select lane:
#    - internal: Internal testing (recommended first)
#    - beta: Beta testing (closed/open)
#    - production: Production release
# 4. Click "Run workflow"
```

### Option 2: Command Line

```bash
# Install dependencies
npm install

# Build and deploy to internal testing
npm run build
npx cap sync android
cd android
fastlane internal

# Or deploy to production
fastlane production
```

## 📱 Track Deployment Status

### In GitHub:
- Go to **Actions** tab
- Click on running workflow
- Monitor progress in real-time

### In Play Console:
1. Go to [Play Console](https://play.google.com/console)
2. Select **AlaskaPay**
3. Navigate to **Release → Testing → Internal testing**
4. See your build processing

## 🎉 First Deployment Checklist

- [ ] Service account created and linked
- [ ] Keystore generated and encoded
- [ ] All 5 secrets added to GitHub
- [ ] App created in Play Console
- [ ] Content rating completed (Play Console → Policy)
- [ ] Store listing filled (Play Console → Store presence)
- [ ] Privacy policy URL added
- [ ] Run workflow: **internal** lane first
- [ ] Add testers in Play Console
- [ ] Test the internal build
- [ ] Promote to production when ready

## 🔄 Continuous Deployment

Once setup, every deployment is automatic:

```bash
# Just push to main branch or run workflow manually
git push origin main

# Or trigger via GitHub Actions UI
```

## 📊 Deployment Tracks

| Track | Purpose | Rollout |
|-------|---------|---------|
| **Internal** | Team testing | Instant, up to 100 testers |
| **Beta** | Public beta | Instant, unlimited testers |
| **Production** | Live users | Staged rollout (10% → 100%) |

## 🆘 Troubleshooting

**Error: "Keystore not found"**
```bash
# Verify ANDROID_KEYSTORE_BASE64 is set correctly
# Re-encode: base64 -w 0 alaska-pay.keystore
```

**Error: "Service account not authorized"**
```bash
# In Play Console → API access
# Ensure service account has "Admin" role
```

**Error: "Version code already exists"**
```bash
# Fastlane auto-increments, but if manual build:
# Edit android/app/build.gradle → increase versionCode
```

## ✨ Your Deployment is Ready!

Run this now:
```bash
# GitHub → Actions → Deploy Android to Play Store → Run workflow
# Select: internal → Run workflow
```

Build will be live in Play Console in ~15 minutes! 🎊

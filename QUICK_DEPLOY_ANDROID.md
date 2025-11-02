# ⚡ Quick Deploy to Google Play

## 🎯 One-Time Setup (5 Minutes)

### 1. Run Setup Script
```bash
chmod +x scripts/setup-google-play.sh
./scripts/setup-google-play.sh
```

### 2. Get Service Account JSON
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. IAM & Admin → Service Accounts → Create
3. Download JSON key file

### 3. Link to Play Console
1. [Play Console](https://play.google.com/console) → Setup → API access
2. Link service account → Grant Admin role

### 4. Add GitHub Secrets
Go to: **Your Repo → Settings → Secrets → Actions**

Add 5 secrets (from setup script output):
- `PLAY_STORE_JSON_KEY` (JSON content)
- `ANDROID_KEYSTORE_BASE64` (from keystore-base64.txt)
- `ANDROID_KEYSTORE_PASSWORD` (your keystore password)
- `ANDROID_KEY_ALIAS` (alaska-pay)
- `ANDROID_KEY_PASSWORD` (same as keystore password)

## 🚀 Deploy Now!

### Method 1: GitHub Actions UI (Easiest)
1. Go to **Actions** tab
2. Click **"Auto Deploy Android"**
3. Click **"Run workflow"**
4. Select track: `internal` (first time)
5. Click **"Run workflow"** ✅

### Method 2: Git Tag (Automatic)
```bash
git tag android-v1.0.0
git push origin android-v1.0.0
```

### Method 3: Command Line
```bash
npm run build
npx cap sync android
cd android && fastlane internal
```

## 📊 Deployment Tracks

| Command | Track | Purpose |
|---------|-------|---------|
| `fastlane internal` | Internal | Team testing (100 testers max) |
| `fastlane beta` | Beta | Public beta testing |
| `fastlane production` | Production | Live release (staged rollout) |

## ✅ Verify Deployment

1. Check GitHub Actions for green checkmark ✅
2. Go to [Play Console](https://play.google.com/console)
3. Navigate to: Release → Testing → Internal testing
4. Your build appears in ~10-15 minutes

## 🎉 First Time Checklist

- [ ] Run setup script
- [ ] Create service account
- [ ] Link to Play Console
- [ ] Add all 5 GitHub secrets
- [ ] Deploy to internal track
- [ ] Add test users in Play Console
- [ ] Test the build
- [ ] Promote to production

## 🔄 Regular Deployments

After setup, just:
```bash
# Option A: UI
GitHub → Actions → Auto Deploy Android → Run workflow

# Option B: Tag
git tag android-v1.0.1 && git push origin android-v1.0.1
```

**Done! Your app deploys automatically!** 🎊

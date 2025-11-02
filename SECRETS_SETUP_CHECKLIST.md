# 🔐 GitHub Secrets Setup Checklist

Complete this checklist to enable automated CI/CD deployments.

## ✅ iOS Secrets (8 total)

### 1. APP_STORE_CONNECT_API_KEY
**What:** Base64 encoded .p8 API key file  
**How to get:**
```bash
# 1. Download .p8 file from App Store Connect → Users and Access → Keys
# 2. Encode it:
base64 -i AuthKey_XXXXXXXXXX.p8 | pbcopy
# 3. Paste into GitHub secret
```
**Status:** [ ] Added

### 2. APP_STORE_KEY_ID
**What:** 10-character key ID (e.g., ABC123DEFG)  
**How to get:** Found in App Store Connect when you create the API key  
**Status:** [ ] Added

### 3. APP_STORE_ISSUER_ID
**What:** UUID format issuer ID  
**How to get:** App Store Connect → Users and Access → Keys (top of page)  
**Status:** [ ] Added

### 4. APPLE_ID
**What:** Your Apple ID email  
**Example:** developer@yourcompany.com  
**Status:** [ ] Added

### 5. FASTLANE_PASSWORD
**What:** App-specific password (NOT your Apple ID password)  
**How to get:**
```bash
# 1. Go to appleid.apple.com
# 2. Security → App-Specific Passwords
# 3. Generate new password named "GitHub Actions"
```
**Status:** [ ] Added

### 6. MATCH_PASSWORD
**What:** Password to encrypt certificates (choose any secure password)  
**Example:** Use a password manager to generate  
**Status:** [ ] Added

### 7. MATCH_GIT_URL (Optional)
**What:** Private Git repo URL for storing certificates  
**Example:** https://github.com/yourorg/certificates  
**Status:** [ ] Added (optional)

### 8. TEAM_ID (Optional)
**What:** Your Apple Developer Team ID  
**How to get:** developer.apple.com → Membership  
**Status:** [ ] Added (optional)

---

## ✅ Android Secrets (5 total)

### 1. ANDROID_KEYSTORE_BASE64
**What:** Base64 encoded keystore file  
**How to create:**
```bash
# 1. Generate keystore:
keytool -genkey -v -keystore release.keystore \
  -alias alaskapay -keyalg RSA -keysize 2048 -validity 10000

# 2. Encode it:
base64 -i release.keystore | pbcopy

# 3. Paste into GitHub secret
```
**Status:** [ ] Added

### 2. ANDROID_KEYSTORE_PASSWORD
**What:** Password you set when creating keystore  
**Status:** [ ] Added

### 3. ANDROID_KEY_ALIAS
**What:** Alias you set when creating keystore  
**Example:** alaskapay  
**Status:** [ ] Added

### 4. ANDROID_KEY_PASSWORD
**What:** Key password (usually same as keystore password)  
**Status:** [ ] Added

### 5. PLAY_STORE_JSON_KEY
**What:** Full JSON content of service account key  
**How to get:**
```bash
# 1. Play Console → Setup → API access
# 2. Create service account in Google Cloud
# 3. Download JSON key file
# 4. Copy ENTIRE file content into secret
```
**Status:** [ ] Added

---

## ✅ Supabase Secrets (3 total)

### 1. VITE_SUPABASE_URL
**What:** Your Supabase project URL  
**Example:** https://abcdefgh.supabase.co  
**How to get:** Supabase Dashboard → Project Settings → API  
**Status:** [ ] Added

### 2. VITE_SUPABASE_ANON_KEY
**What:** Supabase anonymous/public key  
**How to get:** Supabase Dashboard → Project Settings → API  
**Status:** [ ] Added

### 3. SUPABASE_SERVICE_ROLE_KEY
**What:** Supabase service role key (secret, never expose)  
**How to get:** Supabase Dashboard → Project Settings → API  
**Status:** [ ] Added

---

## ✅ Optional Secrets

### SLACK_WEBHOOK_URL
**What:** Slack webhook for deployment notifications  
**How to get:** Slack → Apps → Incoming Webhooks  
**Status:** [ ] Added (optional)

### SENTRY_DSN
**What:** Sentry DSN for error tracking  
**How to get:** sentry.io → Project Settings  
**Status:** [ ] Added (optional)

---

## 🚀 Quick Add Commands

### Add all secrets at once (macOS/Linux):
```bash
# Set these variables first:
export APP_STORE_KEY_ID="YOUR_KEY_ID"
export APP_STORE_ISSUER_ID="YOUR_ISSUER_ID"
export APPLE_ID="your@email.com"
# ... etc

# Then run:
gh secret set APP_STORE_KEY_ID -b"$APP_STORE_KEY_ID"
gh secret set APP_STORE_ISSUER_ID -b"$APP_STORE_ISSUER_ID"
gh secret set APPLE_ID -b"$APPLE_ID"
# ... repeat for all secrets
```

### Or add via GitHub CLI interactively:
```bash
gh secret set APP_STORE_CONNECT_API_KEY < api_key.p8.base64
gh secret set ANDROID_KEYSTORE_BASE64 < release.keystore.base64
gh secret set PLAY_STORE_JSON_KEY < service-account.json
```

---

## ✅ Verification

After adding all secrets, verify in GitHub:
1. Go to your repo → Settings → Secrets → Actions
2. You should see **16 secrets** (11 required + 5 optional)
3. Run test workflow: Actions → Mobile CI/CD → Run workflow

---

## 📝 Notes

- **Never commit** actual secret values to Git
- Store keystore files securely (backup!)
- Rotate API keys every 6-12 months
- Use different keys for staging/production

---

## ✅ Final Checklist

- [ ] All 8 iOS secrets added
- [ ] All 5 Android secrets added
- [ ] All 3 Supabase secrets added
- [ ] Secrets verified in GitHub Settings
- [ ] Test workflow run successful
- [ ] Keystore backed up securely
- [ ] API keys documented in team password manager

**Status: Ready for automated deployments!** 🚀

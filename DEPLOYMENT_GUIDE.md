# Alaska Pay - Complete Deployment Guide

## 🚀 Quick Deploy Commands

```bash
# Deploy everything at once
npm run deploy:all

# Deploy web only
npm run deploy:web

# Deploy iOS to TestFlight
npm run deploy:ios

# Deploy Android to Internal Testing
npm run deploy:android
```

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] `.env` file configured with production values
- [ ] Supabase production URL and anon key set
- [ ] Stripe production keys configured
- [ ] Paystack production keys configured
- [ ] SendGrid API key set

### 2. Database Setup
- [ ] Run all Supabase migrations
- [ ] Verify database tables created
- [ ] Test database connections
- [ ] Set up Row Level Security policies

### 3. Testing Complete
- [ ] All unit tests passing (`npm test`)
- [ ] E2E tests passing (`npm run test:e2e`)
- [ ] Integration tests passing (`npm run test:integration`)
- [ ] Manual testing on staging environment

### 4. Build Verification
- [ ] Production build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in production build
- [ ] Assets optimized and compressed

## 🌐 Web Deployment (Netlify)

### Initial Setup
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to existing site or create new
netlify link
```

### Deploy to Production
```bash
# Build and deploy
npm run build
netlify deploy --prod

# Or use automated script
./scripts/deploy.sh web
```

### Environment Variables in Netlify
1. Go to Site Settings > Environment Variables
2. Add all variables from `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `VITE_PAYSTACK_PUBLIC_KEY`
   - All other VITE_ prefixed variables

### Custom Domain Setup
1. Go to Domain Settings in Netlify
2. Add custom domain: `alaskapay.com`
3. Configure DNS records (see DNS_RECORDS_TEMPLATE.md)
4. Enable HTTPS (automatic with Let's Encrypt)

## 📱 iOS Deployment (TestFlight)

### Prerequisites
- macOS with Xcode 14+
- Apple Developer Account ($99/year)
- Valid provisioning profiles and certificates

### Build and Deploy
```bash
# Sync Capacitor
npm run build
npx cap sync ios

# Open in Xcode
npx cap open ios

# Or use automated script
./scripts/build-native.sh ios

# Deploy to TestFlight
cd ios/App
fastlane beta
```

### Manual Xcode Steps
1. Select "Any iOS Device" as target
2. Product > Archive
3. Distribute App > App Store Connect
4. Upload to TestFlight
5. Add beta testers in App Store Connect

### TestFlight Testing
- Internal testers: Up to 100, instant access
- External testers: Unlimited, requires Apple review
- See TESTFLIGHT_SETUP.md for detailed guide

## 🤖 Android Deployment (Google Play)

### Prerequisites
- Android Studio installed
- Google Play Developer Account ($25 one-time)
- Signing key generated

### Generate Signing Key
```bash
keytool -genkey -v -keystore alaska-pay.keystore \
  -alias alaska-pay -keyalg RSA -keysize 2048 -validity 10000
```

### Build and Deploy
```bash
# Sync Capacitor
npm run build
npx cap sync android

# Open in Android Studio
npx cap open android

# Or use automated script
./scripts/build-native.sh android

# Deploy to Internal Testing
cd android
fastlane internal
```

### Manual Android Studio Steps
1. Build > Generate Signed Bundle/APK
2. Select "Android App Bundle"
3. Choose keystore and enter passwords
4. Select "release" build variant
5. Upload to Google Play Console

### Internal Testing Track
- Up to 100 testers
- No review required
- Instant updates
- See PLAY_STORE_INTERNAL_TESTING.md for details

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Workflows
All workflows are in `.github/workflows/`:

1. **deploy-web.yml** - Auto-deploy web on push to main
2. **deploy-ios.yml** - Deploy iOS on tag push
3. **deploy-android.yml** - Deploy Android on tag push
4. **ci.yml** - Run tests on every PR

### Secrets Required
Add these to GitHub Settings > Secrets:

**Web Deployment:**
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

**iOS Deployment:**
- `APPLE_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`
- `MATCH_PASSWORD`
- `GIT_AUTHORIZATION`

**Android Deployment:**
- `PLAY_STORE_JSON_KEY`
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

**Environment Variables:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_PAYSTACK_PUBLIC_KEY`

### Trigger Deployments
```bash
# Deploy web (push to main)
git push origin main

# Deploy iOS (create tag)
git tag -a ios-v1.0.0 -m "iOS Release 1.0.0"
git push origin ios-v1.0.0

# Deploy Android (create tag)
git tag -a android-v1.0.0 -m "Android Release 1.0.0"
git push origin android-v1.0.0
```

## 🔍 Post-Deployment Verification

### Web
- [ ] Visit production URL
- [ ] Test user registration/login
- [ ] Test payment flows
- [ ] Check console for errors
- [ ] Verify analytics tracking
- [ ] Test on mobile browsers

### iOS
- [ ] Install from TestFlight
- [ ] Test core user flows
- [ ] Verify push notifications
- [ ] Test biometric authentication
- [ ] Check crash reporting
- [ ] Test on multiple iOS versions

### Android
- [ ] Install from Internal Testing
- [ ] Test core user flows
- [ ] Verify push notifications
- [ ] Test biometric authentication
- [ ] Check crash reporting
- [ ] Test on multiple Android versions

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Capacitor Sync Issues
```bash
# Remove and re-add platforms
npx cap remove ios
npx cap remove android
npx cap add ios
npx cap add android
npx cap sync
```

### Certificate Issues (iOS)
```bash
# Reset certificates with Fastlane Match
cd ios/App
fastlane match nuke development
fastlane match nuke distribution
fastlane match development
fastlane match appstore
```

### Signing Issues (Android)
- Verify keystore path in `android/app/build.gradle`
- Check keystore password is correct
- Ensure key alias matches

## 📊 Monitoring

### Web Analytics
- Netlify Analytics: Site traffic and performance
- Google Analytics: User behavior
- Sentry: Error tracking

### Mobile Analytics
- Firebase Analytics: User engagement
- Crashlytics: Crash reporting
- TestFlight/Play Console: Beta feedback

## 🔐 Security

### Production Checklist
- [ ] All API keys are production keys
- [ ] HTTPS enabled on all domains
- [ ] Database RLS policies active
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Secrets not in source code
- [ ] Environment variables secured

## 📚 Additional Resources

- [TESTFLIGHT_SETUP.md](./TESTFLIGHT_SETUP.md) - iOS beta testing
- [PLAY_STORE_INTERNAL_TESTING.md](./PLAY_STORE_INTERNAL_TESTING.md) - Android testing
- [MOBILE_TESTING_COMPLETE.md](./MOBILE_TESTING_COMPLETE.md) - Mobile testing guide
- [CUSTOM_DOMAIN_SETUP.md](./CUSTOM_DOMAIN_SETUP.md) - Domain configuration
- [DNS_RECORDS_TEMPLATE.md](./DNS_RECORDS_TEMPLATE.md) - DNS setup

## 🆘 Support

If you encounter issues during deployment:
1. Check the troubleshooting section above
2. Review platform-specific logs
3. Verify all prerequisites are met
4. Check GitHub Actions logs for CI/CD issues
5. Consult platform documentation (Netlify, App Store Connect, Play Console)

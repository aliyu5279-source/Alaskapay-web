# Alaska Pay - Quick Deploy Guide

## 🚀 Deploy in 5 Minutes

### Prerequisites
```bash
# Install dependencies
npm install

# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login
```

### Deploy to Production
```bash
# One command deploy
npm run build && netlify deploy --prod
```

That's it! Your app is live at https://alaskapay.com

## 📱 Deploy Mobile Apps

### iOS (TestFlight)
```bash
# Build and deploy
npm run build
npx cap sync ios
cd ios/App
fastlane beta
```

### Android (Internal Testing)
```bash
# Build and deploy
npm run build
npx cap sync android
cd android
fastlane internal
```

## 🔧 Common Commands

### Web
```bash
# Deploy to staging
netlify deploy --alias staging

# Deploy to production
netlify deploy --prod

# Rollback
netlify rollback

# View logs
netlify logs
```

### Mobile
```bash
# Sync native projects
npx cap sync

# Open in IDE
npx cap open ios
npx cap open android

# Build native apps
./scripts/build-native.sh ios
./scripts/build-native.sh android
```

## ✅ Pre-Deploy Checklist

- [ ] All tests passing: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Staging tested

## 🐛 Troubleshooting

### Build Fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Deploy Fails
```bash
# Check Netlify status
netlify status

# Re-link site
netlify link

# Try manual deploy
netlify deploy --prod --dir=dist
```

### Mobile Build Fails
```bash
# Clean and rebuild
npx cap sync
npx cap copy
```

## 📚 Full Documentation

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete guide
- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) - Production procedures
- [TESTFLIGHT_SETUP.md](./TESTFLIGHT_SETUP.md) - iOS deployment
- [PLAY_STORE_INTERNAL_TESTING.md](./PLAY_STORE_INTERNAL_TESTING.md) - Android deployment

## 🆘 Need Help?

1. Check deployment logs: `netlify logs`
2. Review build output for errors
3. Verify environment variables
4. Check platform status pages
5. Review troubleshooting sections in full guides

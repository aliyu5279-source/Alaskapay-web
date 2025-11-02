# Deploy Alaska Pay NOW! 🚀

## One-Command Deployment

### Web (Production)
```bash
npm run deploy:web
```

### iOS (TestFlight)
```bash
npm run deploy:ios
```

### Android (Internal Testing)
```bash
npm run deploy:android
```

### Everything at Once
```bash
npm run deploy:all
```

## First Time? Setup in 3 Steps

### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify link
```

### 2. Configure Environment
Copy `.env.example` to `.env` and add your keys

### 3. Deploy!
```bash
npm run deploy:web
```

## That's It! 🎉

Your app is now live!

- **Web:** https://alaskapay.com
- **iOS:** TestFlight beta
- **Android:** Play Store Internal Testing

## Need Help?

- Full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Quick guide: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- Instant guide: [INSTANT_DEPLOY.md](./INSTANT_DEPLOY.md)

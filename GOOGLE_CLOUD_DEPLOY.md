# Deploy AlaskaPay to Google Cloud Platform

## 🚀 Quick Deploy to Google App Engine

### Prerequisites
- Google Cloud account (free tier available)
- gcloud CLI installed
- Node.js 18+ installed

### 1. Install Google Cloud CLI
```bash
# macOS
brew install google-cloud-sdk

# Windows (PowerShell as Admin)
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### 2. Initialize & Login
```bash
gcloud init
gcloud auth login
```

### 3. Create Project
```bash
# Create new project
gcloud projects create alaskapay-prod --name="AlaskaPay Production"

# Set as active project
gcloud config set project alaskapay-prod

# Enable billing (required)
# Visit: https://console.cloud.google.com/billing
```

### 4. Enable Required APIs
```bash
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 5. Create app.yaml
```yaml
runtime: nodejs18
env: standard
instance_class: F1

handlers:
  - url: /.*
    secure: always
    script: auto

env_variables:
  VITE_SUPABASE_URL: "your-supabase-url"
  VITE_SUPABASE_ANON_KEY: "your-anon-key"
  VITE_PAYSTACK_PUBLIC_KEY: "your-paystack-key"
```

### 6. Deploy
```bash
# Build production
npm run build

# Deploy to App Engine
gcloud app deploy
```

## 🎯 Alternative: Google Cloud Run (Recommended)

### Why Cloud Run?
- Auto-scaling (0 to thousands)
- Pay per use (cheaper)
- Docker-based (more flexible)

### Deploy to Cloud Run
```bash
# Build Docker image
docker build -t gcr.io/alaskapay-prod/alaskapay:latest .

# Push to Container Registry
docker push gcr.io/alaskapay-prod/alaskapay:latest

# Deploy to Cloud Run
gcloud run deploy alaskapay \
  --image gcr.io/alaskapay-prod/alaskapay:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 📦 Using Firebase Hosting (Easiest)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
npm run build
firebase deploy --only hosting
```

## 🔧 Environment Variables

Add via Console or CLI:
```bash
gcloud app deploy --set-env-vars \
  VITE_SUPABASE_URL=your-url,\
  VITE_SUPABASE_ANON_KEY=your-key
```

## 💰 Cost Estimate
- **App Engine F1**: ~$50/month
- **Cloud Run**: ~$5-20/month (pay per use)
- **Firebase Hosting**: Free tier (10GB/month)

## 📚 Resources
- [App Engine Docs](https://cloud.google.com/appengine/docs)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

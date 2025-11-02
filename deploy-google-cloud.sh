#!/bin/bash

echo "🚀 AlaskaPay - Google Cloud Deployment Script"
echo "=============================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Menu
echo ""
echo "Select deployment method:"
echo "1) App Engine (Simple, ~$50/month)"
echo "2) Cloud Run (Flexible, ~$5-20/month)"
echo "3) Firebase Hosting (Free tier available)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "📦 Deploying to App Engine..."
        npm run build
        gcloud app deploy --quiet
        echo "✅ Deployed! Visit: https://$(gcloud app describe --format='value(defaultHostname)')"
        ;;
    2)
        echo "🐳 Deploying to Cloud Run..."
        PROJECT_ID=$(gcloud config get-value project)
        docker build -t gcr.io/$PROJECT_ID/alaskapay:latest .
        docker push gcr.io/$PROJECT_ID/alaskapay:latest
        gcloud run deploy alaskapay \
            --image gcr.io/$PROJECT_ID/alaskapay:latest \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated
        echo "✅ Deployed to Cloud Run!"
        ;;
    3)
        echo "🔥 Deploying to Firebase..."
        npm install -g firebase-tools
        npm run build
        firebase deploy --only hosting
        echo "✅ Deployed to Firebase!"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

#!/bin/bash

# 🚀 Quick Vercel Deployment Script
# Deploys Alaska Pay to Vercel with proper configuration

set -e

echo "🚀 Alaska Pay - Vercel Deployment"
echo "=================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

echo ""
echo "⚙️  Configuration Check"
echo "----------------------"

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo ""
    echo "📝 Please edit .env with your actual values:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo "   - VITE_PAYSTACK_PUBLIC_KEY (optional)"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Verify required variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Missing required environment variables!"
    echo "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Test build locally
echo "🔨 Testing build locally..."
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo ""
echo "🌐 Deploying to Vercel..."
echo "-------------------------"

# Deploy to Vercel
vercel --prod \
  --env VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  --env VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" \
  --env VITE_ENVIRONMENT="production" \
  ${VITE_PAYSTACK_PUBLIC_KEY:+--env VITE_PAYSTACK_PUBLIC_KEY="$VITE_PAYSTACK_PUBLIC_KEY"} \
  ${VITE_STRIPE_PUBLIC_KEY:+--env VITE_STRIPE_PUBLIC_KEY="$VITE_STRIPE_PUBLIC_KEY"}

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📊 Next Steps:"
echo "1. Visit your Vercel dashboard to see the deployment"
echo "2. Add a custom domain in Vercel settings (optional)"
echo "3. Enable auto-deploy: Already configured via GitHub Actions!"
echo ""
echo "🎉 Your app is live!"

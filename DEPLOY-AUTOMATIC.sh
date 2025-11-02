#!/bin/bash

echo "========================================"
echo "AUTOMATIC DEPLOYMENT TO VERCEL"
echo "========================================"
echo ""

echo "[Step 1/4] Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found!"
    exit 1
fi
echo "✓ Node.js found ($(node --version))"
echo ""

echo "[Step 2/4] Installing Vercel CLI..."
npm install -g vercel
echo "✓ Vercel CLI installed"
echo ""

echo "[Step 3/4] Building your project..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi
echo "✓ Build successful"
echo ""

echo "[Step 4/4] Deploying to Vercel..."
echo "You will need to:"
echo "1. Login to Vercel (browser will open)"
echo "2. Follow the prompts"
echo ""
vercel --prod
echo ""
echo "========================================"
echo "DEPLOYMENT COMPLETE!"
echo "Your live URL is shown above"
echo "========================================"

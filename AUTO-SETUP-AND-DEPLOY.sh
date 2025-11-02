#!/bin/bash

echo "========================================"
echo "AUTOMATIC SETUP AND DEPLOY"
echo "========================================"
echo ""

echo "[Step 1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org"
    exit 1
fi
echo "✓ Node.js is installed ($(node --version))"
echo ""

echo "[Step 2/5] Cleaning npm cache..."
npm cache clean --force
echo "✓ Cache cleaned"
echo ""

echo "[Step 3/5] Installing dependencies (this may take 2-5 minutes)..."
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: npm install failed!"
    echo "Trying alternative method..."
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo "Still failed. Please check your internet connection."
        exit 1
    fi
fi
echo "✓ Dependencies installed"
echo ""

echo "[Step 4/5] Starting development server..."
echo "Your app will open at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server when ready to deploy"
echo ""
npm run dev

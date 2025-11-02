#!/bin/bash

echo "========================================"
echo "FIXING NPM ERRORS"
echo "========================================"
echo ""

echo "This will fix the 'unexpected identifier' error"
echo ""

echo "[Step 1/6] Checking if you're in the right folder..."
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    echo "You need to run this inside your project folder."
    echo ""
    echo "Navigate to your project folder first:"
    echo "cd /path/to/your/project"
    echo "Then run this script again."
    exit 1
fi
echo "✓ You're in the right folder"
echo ""

echo "[Step 2/6] Checking Node.js version..."
node --version
echo "✓ Node.js is working"
echo ""

echo "[Step 3/6] Deleting old files..."
rm -rf node_modules package-lock.json
echo "✓ Old files removed"
echo ""

echo "[Step 4/6] Cleaning npm cache..."
npm cache clean --force
echo "✓ Cache cleaned"
echo ""

echo "[Step 5/6] Installing fresh dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "Trying alternative method..."
    npm install --legacy-peer-deps --force
fi
echo "✓ Installation complete"
echo ""

echo "[Step 6/6] Starting your app..."
echo "Opening http://localhost:5173"
echo ""
npm run dev

#!/bin/bash
set -e

echo "=== Netlify Build Script ==="
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

echo ""
echo "=== Checking for package.json ==="
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found in $(pwd)"
    echo "Contents of current directory:"
    ls -la
    exit 1
fi

echo "✓ package.json found"
echo ""
echo "=== Installing dependencies ==="
npm install --legacy-peer-deps

echo ""
echo "=== Building application ==="
npm run build

echo ""
echo "=== Build complete ==="
echo "Checking dist folder:"
ls -la dist/ || echo "dist folder not found"

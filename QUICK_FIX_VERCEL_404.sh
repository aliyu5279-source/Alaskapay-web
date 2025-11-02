#!/bin/bash

echo "🔧 Alaska Pay - Vercel 404 Fix Script"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  IMPORTANT: Edit .env and add your API keys!"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Test build
echo "🏗️  Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Check if dist folder exists
    if [ -d "dist" ]; then
        echo "✅ Output directory 'dist' exists"
        echo ""
        
        # Test preview
        echo "🚀 Starting preview server..."
        echo "Visit http://localhost:4173 to test"
        echo "Press Ctrl+C to stop"
        npm run preview
    else
        echo "❌ Error: dist folder not created"
        exit 1
    fi
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi

#!/bin/bash

# AlaskaPay - Environment Setup Script
# This script helps you set up your environment variables

set -e

echo "🚀 AlaskaPay Environment Setup"
echo "================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  Warning: .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
    echo "📝 Backing up existing .env to .env.backup"
    cp .env .env.backup
fi

# Copy .env.example to .env
echo "📋 Creating .env file from template..."
cp .env.example .env

echo ""
echo "✅ .env file created!"
echo ""
echo "📝 Next Steps:"
echo "================================"
echo ""
echo "1. SUPABASE (REQUIRED)"
echo "   - Go to: https://app.supabase.com"
echo "   - Create a new project or select existing"
echo "   - Go to Settings > API"
echo "   - Copy your Project URL and anon/public key"
echo "   - Update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
echo ""
echo "2. PAYSTACK (REQUIRED FOR PAYMENTS)"
echo "   - Go to: https://dashboard.paystack.com"
echo "   - Sign up for free account"
echo "   - Go to Settings > API Keys & Webhooks"
echo "   - Copy Test Secret Key and Test Public Key"
echo "   - Update PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY in .env"
echo ""
echo "3. OPTIONAL SERVICES"
echo "   - SMS: Twilio or Africa's Talking"
echo "   - Email: SendGrid"
echo "   - Payments: Stripe (alternative)"
echo ""
echo "4. RUN DATABASE SETUP"
echo "   bash scripts/setup-database.sh"
echo ""
echo "5. START DEVELOPMENT SERVER"
echo "   npm run dev"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - HOW_TO_GET_API_KEYS.md"
echo "   - DATABASE_SETUP.md"
echo "   - QUICK_START.md"
echo ""

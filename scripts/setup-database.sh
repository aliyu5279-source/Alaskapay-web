#!/bin/bash

# AlaskaPay Database Setup Script
# This script sets up the complete Supabase database with all tables and initial data

set -e

echo "🚀 Starting AlaskaPay Database Setup..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

echo "📦 Linking to Supabase project..."
supabase link --project-ref ${VITE_SUPABASE_URL##*//} || true

echo "🔄 Running database migrations..."
supabase db push

echo "🌱 Seeding initial data..."
node scripts/seed-database.js

echo "✅ Database setup complete!"
echo ""
echo "📊 Database includes:"
echo "  - User authentication & profiles"
echo "  - Wallet & transaction management"
echo "  - KYC verification system"
echo "  - Payment methods & virtual cards"
echo "  - Bill payments & beneficiaries"
echo "  - Referral & commission tracking"
echo "  - Support tickets & live chat"
echo "  - Admin audit logs & notifications"
echo "  - Email templates & campaigns"
echo "  - Webhook management"
echo "  - Subscription billing"
echo "  - Fraud detection & compliance"
echo ""
echo "🎉 Ready to start development!"

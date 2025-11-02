#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you set up all required environment variables in Vercel

echo "🚀 Vercel Environment Variables Setup"
echo "======================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📝 Please have the following ready:"
echo "   1. Supabase Project URL and Keys"
echo "   2. Paystack Public and Secret Keys"
echo ""

# Login to Vercel
echo "🔐 Logging in to Vercel..."
vercel login

# Link project
echo "🔗 Linking to your Vercel project..."
vercel link

echo ""
echo "📋 Now let's add your environment variables..."
echo ""

# Supabase URL
echo "1️⃣ VITE_SUPABASE_URL"
echo "   Get from: https://supabase.com/dashboard/project/psafbcbhbidnbzfsccsu/settings/api"
read -p "   Enter your Supabase URL: " SUPABASE_URL
echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL production
echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL preview
echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL development

# Supabase Anon Key
echo ""
echo "2️⃣ VITE_SUPABASE_ANON_KEY"
read -p "   Enter your Supabase anon key: " SUPABASE_ANON_KEY
echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY production
echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY preview
echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY development

# Supabase Service Role Key
echo ""
echo "3️⃣ SUPABASE_SERVICE_ROLE_KEY"
read -p "   Enter your Supabase service_role key: " SUPABASE_SERVICE_KEY
echo "$SUPABASE_SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo "$SUPABASE_SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY preview
echo "$SUPABASE_SERVICE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY development

# Paystack Public Key
echo ""
echo "4️⃣ VITE_PAYSTACK_PUBLIC_KEY"
echo "   Get from: https://dashboard.paystack.com/#/settings/developers"
read -p "   Enter your Paystack public key: " PAYSTACK_PUBLIC_KEY
echo "$PAYSTACK_PUBLIC_KEY" | vercel env add VITE_PAYSTACK_PUBLIC_KEY production
echo "$PAYSTACK_PUBLIC_KEY" | vercel env add VITE_PAYSTACK_PUBLIC_KEY preview
echo "$PAYSTACK_PUBLIC_KEY" | vercel env add VITE_PAYSTACK_PUBLIC_KEY development

# Paystack Secret Key
echo ""
echo "5️⃣ PAYSTACK_SECRET_KEY"
read -p "   Enter your Paystack secret key: " PAYSTACK_SECRET_KEY
echo "$PAYSTACK_SECRET_KEY" | vercel env add PAYSTACK_SECRET_KEY production
echo "$PAYSTACK_SECRET_KEY" | vercel env add PAYSTACK_SECRET_KEY preview
echo "$PAYSTACK_SECRET_KEY" | vercel env add PAYSTACK_SECRET_KEY development

# App URL
echo ""
echo "6️⃣ VITE_APP_URL"
read -p "   Enter your Vercel app URL (e.g., https://yourapp.vercel.app): " APP_URL
echo "$APP_URL" | vercel env add VITE_APP_URL production
echo "$APP_URL" | vercel env add VITE_APP_URL preview
echo "$APP_URL" | vercel env add VITE_APP_URL development

# Commission settings
echo ""
echo "7️⃣ Setting up commission configuration..."
echo "0.015" | vercel env add VITE_COMMISSION_RATE production preview development
echo "0013010127" | vercel env add VITE_COMMISSION_BANK_ACCOUNT production preview development
echo "Taj Bank" | vercel env add VITE_COMMISSION_BANK_NAME production preview development
echo "Alaska Mega Plus Ltd" | vercel env add VITE_COMMISSION_ACCOUNT_NAME production preview development

echo ""
echo "✅ All environment variables added successfully!"
echo ""
echo "🚀 Deploying to production..."
vercel --prod

echo ""
echo "✨ Setup complete! Your app is now live with all configurations."
echo ""
echo "📋 Next steps:"
echo "   1. Visit your deployed site"
echo "   2. Test user signup and login"
echo "   3. Test wallet funding with Paystack"
echo "   4. Verify commission deduction (1.5%)"
echo ""

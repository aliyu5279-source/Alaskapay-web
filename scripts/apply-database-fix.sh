#!/bin/bash

# Apply Database Fix Script
# This script automatically applies the database migration

echo "🔧 AlaskaPay Database Fix Script"
echo "================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if linked to project
echo "🔗 Checking project link..."
if ! supabase status &> /dev/null; then
    echo "⚠️  Not linked to Supabase project"
    echo ""
    echo "Linking to project psafbcbhbidnbzfsccsu..."
    supabase link --project-ref psafbcbhbidnbzfsccsu
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to link project"
        echo "Please run manually: supabase link --project-ref psafbcbhbidnbzfsccsu"
        exit 1
    fi
fi

echo "✅ Project linked"
echo ""

# Apply migration
echo "📤 Applying database migration..."
echo ""
supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database migration applied successfully!"
    echo ""
    echo "📊 Tables created/updated:"
    echo "  ✓ profiles"
    echo "  ✓ wallets"
    echo "  ✓ transactions (FIXED)"
    echo "  ✓ bank_accounts"
    echo "  ✓ virtual_cards"
    echo "  ✓ bill_payments"
    echo "  ✓ commissions"
    echo "  ✓ payment_methods"
    echo "  ✓ kyc_verifications"
    echo ""
    echo "🔐 Security:"
    echo "  ✓ Row Level Security enabled"
    echo "  ✓ RPC functions created"
    echo "  ✓ Indexes added"
    echo ""
    echo "🎯 Next Steps:"
    echo "  1. Run: node scripts/test-connection.js"
    echo "  2. Test wallet funding on your site"
    echo "  3. Check transaction history"
    echo ""
else
    echo ""
    echo "❌ Migration failed!"
    echo ""
    echo "Try manual application:"
    echo "  1. Go to: https://supabase.com/dashboard/project/psafbcbhbidnbzfsccsu/editor"
    echo "  2. Open SQL Editor"
    echo "  3. Copy content from: supabase/migrations/20250102_fix_transactions_and_tables.sql"
    echo "  4. Paste and run"
    echo ""
    exit 1
fi

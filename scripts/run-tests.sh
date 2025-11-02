#!/bin/bash

# Alaska Pay - Automated Testing Script
# Tests complete payment flow including commission deduction

set -e

echo "🧪 Alaska Pay - Automated Testing Suite"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check prerequisites
echo "📋 Checking prerequisites..."

if [ -z "$VITE_SUPABASE_URL" ]; then
    echo -e "${RED}❌ VITE_SUPABASE_URL not set${NC}"
    exit 1
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ VITE_SUPABASE_ANON_KEY not set${NC}"
    exit 1
fi

if [ -z "$VITE_PAYSTACK_PUBLIC_KEY" ]; then
    echo -e "${RED}❌ VITE_PAYSTACK_PUBLIC_KEY not set${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables configured${NC}"
echo ""

# Test 1: Database Connection
echo "🔌 Test 1: Database Connection"
echo "--------------------------------"

response=$(curl -s -X POST "${VITE_SUPABASE_URL}/rest/v1/rpc/health_check" \
  -H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi
echo ""

# Test 2: Create Test Users
echo "👤 Test 2: Create Test Users"
echo "--------------------------------"

# This would require Supabase service role key for auth
echo -e "${YELLOW}⚠️  Manual step: Create test users via Supabase dashboard${NC}"
echo "   - user1@test.com (password: Test123!@#)"
echo "   - user2@test.com (password: Test123!@#)"
echo ""

# Test 3: Wallet Creation
echo "💰 Test 3: Wallet Verification"
echo "--------------------------------"

echo "SQL to run in Supabase SQL Editor:"
echo ""
echo "SELECT id, email, (SELECT balance FROM wallets WHERE user_id = profiles.id) as wallet_balance"
echo "FROM profiles"
echo "WHERE email IN ('user1@test.com', 'user2@test.com');"
echo ""
echo -e "${YELLOW}⚠️  Manual verification required${NC}"
echo ""

# Test 4: Commission Configuration
echo "💼 Test 4: Commission Configuration"
echo "--------------------------------"

echo "Verifying commission settings..."
echo "Expected: 1.5% to Taj Bank 0013010127 (Alaska Mega Plus Ltd)"
echo ""
echo "SQL to verify:"
echo ""
echo "SELECT * FROM commission_settings WHERE is_active = true;"
echo ""
echo -e "${YELLOW}⚠️  Manual verification required${NC}"
echo ""

# Test 5: Transfer with Commission
echo "💸 Test 5: Transfer with Commission Calculation"
echo "--------------------------------"

echo "Test scenario:"
echo "1. User A transfers ₦1,000 to User B"
echo "2. Commission: ₦15 (1.5%)"
echo "3. Total deducted from User A: ₦1,015"
echo "4. User B receives: ₦1,000"
echo ""
echo "SQL to test:"
echo ""
cat << 'EOF'
-- Simulate transfer
BEGIN;

-- Check User A balance before
SELECT balance FROM wallets WHERE user_id = 'USER_A_ID';

-- Execute transfer (replace with actual user IDs)
SELECT transfer_funds(
  'USER_A_ID',
  'USER_B_ID',
  1000.00,
  'Test transfer'
);

-- Check balances after
SELECT 
  u.email,
  w.balance
FROM wallets w
JOIN profiles u ON u.id = w.user_id
WHERE u.email IN ('user1@test.com', 'user2@test.com');

-- Check commission
SELECT * FROM commissions 
WHERE created_at > NOW() - INTERVAL '1 minute'
ORDER BY created_at DESC;

ROLLBACK; -- Remove this to commit
EOF
echo ""
echo -e "${YELLOW}⚠️  Run above SQL in Supabase SQL Editor${NC}"
echo ""

# Test 6: Transaction History
echo "📊 Test 6: Transaction History"
echo "--------------------------------"

echo "SQL to verify transaction records:"
echo ""
cat << 'EOF'
SELECT 
  t.id,
  t.type,
  t.amount,
  t.commission_amount,
  t.status,
  t.created_at,
  p.email as user_email
FROM transactions t
JOIN profiles p ON p.id = t.user_id
WHERE t.created_at > NOW() - INTERVAL '1 hour'
ORDER BY t.created_at DESC;
EOF
echo ""
echo -e "${YELLOW}⚠️  Manual verification required${NC}"
echo ""

# Test 7: Paystack Integration
echo "💳 Test 7: Paystack Integration"
echo "--------------------------------"

echo "Test cards for Paystack:"
echo ""
echo "✅ Success: 4084084084084081"
echo "   Expiry: 12/25, CVV: 408, PIN: 0000, OTP: 123456"
echo ""
echo "❌ Decline: 5060666666666666666"
echo ""
echo "Test in browser:"
echo "1. Login to dashboard"
echo "2. Click 'Fund Wallet'"
echo "3. Enter amount: ₦5,000"
echo "4. Use test card above"
echo "5. Verify wallet balance updates"
echo ""
echo -e "${YELLOW}⚠️  Manual browser testing required${NC}"
echo ""

# Test 8: Edge Cases
echo "⚠️  Test 8: Edge Cases"
echo "--------------------------------"

echo "Test scenarios to verify:"
echo ""
echo "1. Insufficient balance:"
echo "   - Attempt transfer > wallet balance"
echo "   - Expected: Error message, no transaction"
echo ""
echo "2. Invalid recipient:"
echo "   - Transfer to non-existent user"
echo "   - Expected: Error message"
echo ""
echo "3. Concurrent transactions:"
echo "   - Two simultaneous transfers"
echo "   - Expected: Proper locking, no race conditions"
echo ""
echo "4. Network failure:"
echo "   - Disconnect during payment"
echo "   - Expected: Transaction marked pending, webhook updates"
echo ""
echo -e "${YELLOW}⚠️  Manual testing required${NC}"
echo ""

# Summary
echo "📋 Testing Summary"
echo "=================================="
echo ""
echo "Automated checks completed:"
echo -e "${GREEN}✅ Environment variables${NC}"
echo -e "${GREEN}✅ Database connection${NC}"
echo ""
echo "Manual verification required:"
echo -e "${YELLOW}⚠️  User creation and authentication${NC}"
echo -e "${YELLOW}⚠️  Wallet funding via Paystack${NC}"
echo -e "${YELLOW}⚠️  Money transfers with commission${NC}"
echo -e "${YELLOW}⚠️  Transaction history${NC}"
echo -e "${YELLOW}⚠️  Commission tracking${NC}"
echo -e "${YELLOW}⚠️  Edge cases and error handling${NC}"
echo ""
echo "📖 See PRE_LAUNCH_TESTING.md for detailed test scenarios"
echo ""
echo "🚀 Ready for manual testing!"

# 🔧 Apply Database Fix - Transactions Table

## ✅ What This Fixes

This migration creates/fixes:
- ✅ **Transactions table** with proper structure
- ✅ **Wallets table** for user balances
- ✅ **Profiles table** for user data
- ✅ **Bank accounts table** for withdrawals
- ✅ **Virtual cards table** for card management
- ✅ **Bill payments table** for bill tracking
- ✅ **Commissions table** for referral earnings
- ✅ **Payment methods table** for saved cards
- ✅ **KYC verifications table** for identity verification
- ✅ **RPC functions** for wallet operations (top_up, transfer, withdraw)
- ✅ **Indexes** for fast queries
- ✅ **Row Level Security** policies

---

## 🚀 Quick Apply (2 Minutes)

### Option 1: Using Supabase CLI (Recommended)

```bash
# 1. Make sure you're linked to your project
supabase link --project-ref psafbcbhbidnbzfsccsu

# 2. Apply the migration
supabase db push

# 3. Verify it worked
supabase db diff
```

### Option 2: Using Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/psafbcbhbidnbzfsccsu/editor
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Copy the entire content from `supabase/migrations/20250102_fix_transactions_and_tables.sql`
5. Paste it into the SQL editor
6. Click **Run** button
7. Wait for "Success" message

---

## 🧪 Test After Applying

```bash
# Run the test script
node scripts/test-connection.js
```

Or test manually:
1. Sign up on your site: https://secure-payments-wallet-1-4c5mv7347-aliyu-ibrahims-projects.vercel.app
2. Try to fund wallet
3. Check if transaction appears in history
4. Try to transfer money
5. Check wallet balance updates

---

## 📊 What Tables Are Created

| Table | Purpose |
|-------|---------|
| `profiles` | User profile information |
| `wallets` | User wallet balances |
| `transactions` | All payment transactions |
| `bank_accounts` | Linked bank accounts |
| `virtual_cards` | Virtual debit cards |
| `bill_payments` | Bill payment records |
| `commissions` | Referral commissions |
| `payment_methods` | Saved payment methods |
| `kyc_verifications` | Identity verification |

---

## 🔐 Security Features

✅ Row Level Security (RLS) enabled
✅ Users can only access their own data
✅ Secure RPC functions with validation
✅ Balance checks before transactions
✅ Unique constraints on references

---

## 🆘 Troubleshooting

### Error: "relation already exists"
**Solution:** This is OK! It means the table already exists. The migration uses `IF NOT EXISTS` so it won't break anything.

### Error: "insufficient privilege"
**Solution:** Make sure you're the project owner or have admin access.

### Error: "syntax error"
**Solution:** Make sure you copied the ENTIRE SQL file content.

---

## ✅ Verification Checklist

After applying, verify these work:

- [ ] Can sign up new user
- [ ] Can fund wallet via Paystack
- [ ] Transaction appears in history
- [ ] Wallet balance updates correctly
- [ ] Can transfer to another user
- [ ] Can request withdrawal
- [ ] Commission is calculated (1.5%)
- [ ] Can link bank account
- [ ] Can create virtual card

---

## 📞 Next Steps

After database is fixed:

1. ✅ Set Vercel environment variables (see VERCEL_ENV_SETUP_GUIDE.md)
2. ✅ Deploy Supabase Edge Functions (see START_HERE_INTEGRATION.md)
3. ✅ Test all services (see TEST_SERVICES_GUIDE.md)
4. ✅ Deploy to Android/iOS

---

## 🎯 Commission Setup

The database is configured for **1.5% commission** on all transactions, automatically settled to:

**Alaska Mega Plus Ltd**
- Bank: Taj Bank (000026)
- Account: 0013010127
- Account Name: Alaska Mega Plus Ltd

Commission is calculated and stored in the `commissions` table for each transaction.

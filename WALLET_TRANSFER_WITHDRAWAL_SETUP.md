# Wallet Transfer & Withdrawal Setup Guide

## Overview
This guide sets up:
1. **Wallet-to-Wallet Transfers** - Send money between AlaskaPay users via phone number
2. **Bank Withdrawals** - Withdraw funds to Nigerian bank accounts via Paystack

## Step 1: Apply Database Migration

Run this in Supabase SQL Editor:

```bash
# The migration file is ready at:
supabase/migrations/20250103_wallet_transfer_withdrawal.sql
```

Or copy and run the SQL directly in Supabase Dashboard → SQL Editor → New Query

This creates:
- `linked_bank_accounts` table
- `withdrawal_requests` table
- `withdrawal_fees` table
- `transfer_between_wallets()` function

## Step 2: Deploy Edge Functions

### Deploy wallet-transfer function:
```bash
supabase functions deploy wallet-transfer
```

### Deploy process-withdrawal function:
```bash
supabase functions deploy process-withdrawal
```

## Step 3: Configure Paystack for Withdrawals

### Enable Paystack Transfers:
1. Go to Paystack Dashboard → Settings → API Keys & Webhooks
2. Enable "Transfers" feature (requires business verification)
3. Add your bank account for settlement
4. Set transfer webhook URL: `https://[your-project].supabase.co/functions/v1/paystack-webhook`

### Required Environment Variables:
Already set in your project:
- `PAYSTACK_SECRET_KEY` ✓
- `PAYSTACK_PUBLIC_KEY` ✓

## How It Works

### Wallet Transfers (P2P)
1. User clicks "Transfer" in wallet dashboard
2. Enters recipient's phone number and amount
3. Verifies with transaction PIN
4. Funds instantly transferred between wallets
5. Both users see transaction in history

### Bank Withdrawals
1. User links bank account (one-time setup)
2. Clicks "Withdraw" and enters amount
3. System calculates fees based on KYC tier
4. User verifies with transaction PIN
5. Request submitted and processed via Paystack
6. Funds arrive in 1-2 business days

## Testing

### Test Wallet Transfer:
1. Create two test accounts with different phone numbers
2. Top up first account's wallet
3. Use Transfer feature to send to second account's phone
4. Check both wallets updated correctly

### Test Bank Withdrawal:
1. Link a test bank account (use Paystack test banks)
2. Request withdrawal
3. Check `withdrawal_requests` table for status
4. Admin can approve/process from admin dashboard

## Features Included

### Transfer Features:
- ✅ Phone number lookup for recipients
- ✅ Instant balance updates
- ✅ Transaction PIN verification
- ✅ Transaction history for both parties
- ✅ Real-time notifications

### Withdrawal Features:
- ✅ Multiple bank account linking
- ✅ Primary account selection
- ✅ KYC tier-based fee calculation
- ✅ Daily withdrawal limits
- ✅ Transaction PIN verification
- ✅ Status tracking (pending → processing → completed)
- ✅ Email notifications

## KYC Tier Limits

Default withdrawal fees:
- **Tier 1** (Unverified): ₦50 per withdrawal
- **Tier 2** (Basic KYC): ₦25 per withdrawal
- **Tier 3** (Full KYC): ₦10 per withdrawal

Modify in `withdrawal_fees` table as needed.

## Admin Management

Admins can:
- View all withdrawal requests
- Process pending withdrawals
- Cancel failed withdrawals
- Refund to wallet if needed
- Export withdrawal reports

## Troubleshooting

### Transfer fails with "Recipient not found":
- Ensure recipient has registered with that phone number
- Check phone format: +234XXXXXXXXXX or 0XXXXXXXXXX

### Withdrawal fails:
- Check Paystack transfers are enabled
- Verify bank account is verified
- Ensure sufficient balance (amount + fee)
- Check daily withdrawal limit not exceeded

### Bank account linking fails:
- Verify account number is correct
- Check bank code is valid
- Ensure Paystack account verification is enabled

## Next Steps

After VTPass API keys arrive:
- Bill payment integration will use same wallet balance
- All transactions (transfers, withdrawals, bills) in one history
- Unified transaction PIN for all operations

## Support

For issues:
1. Check Supabase logs: Dashboard → Edge Functions → Logs
2. Check database: `withdrawal_requests` and `transactions` tables
3. Verify Paystack webhook is receiving events

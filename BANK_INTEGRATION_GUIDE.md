# Nigerian Bank Account Integration Guide

## Overview
AlaskaPay now supports direct bank account integration for funding wallets using Nigerian banks.

## Features Implemented
✅ 20+ Nigerian banks supported (GTBank, Access, First Bank, UBA, Zenith, etc.)
✅ Bank account verification via Paystack API
✅ Link multiple bank accounts
✅ Set primary account for quick transfers
✅ Instant bank transfers for wallet funding
✅ Secure account management

## How to Use

### For Users:
1. Go to Wallet Dashboard
2. Click "Bank Transfer" in Quick Actions
3. Select "Link New Account"
4. Choose your bank from dropdown
5. Enter 10-digit account number
6. Click "Verify Account" - Paystack validates in real-time
7. Confirm account name and click "Link Account"
8. Use linked account for instant wallet funding

### Linked Banks Tab:
- View all linked accounts
- Set primary account
- Remove accounts
- See verification status

## Database Setup Required

Run this SQL in Supabase:

```sql
CREATE TABLE linked_bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  bank_code TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT true,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_linked_banks_user ON linked_bank_accounts(user_id);
```

## Supported Banks
Access Bank, GTBank, First Bank, UBA, Zenith, Fidelity, Union Bank, Stanbic IBTC, Sterling, Polaris, Wema, Ecobank, FCMB, Keystone, Kuda, Opay, PalmPay, Moniepoint, VFD, Providus

## API Integration
- Uses Paystack Bank Account Resolution API
- Real-time verification
- Secure account linking
- Edge function: verify-bank-account

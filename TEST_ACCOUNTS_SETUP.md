# 🧪 Test Accounts Setup Guide

## Quick Test Account Creation

### Method 1: Automated Setup (Recommended)
```bash
# Run the test account creation script
npm run setup:test-accounts
```

This creates:
- 1 Admin account
- 5 Regular user accounts
- 2 Merchant accounts
- Pre-funded wallets
- Sample transactions

### Method 2: Manual Creation

#### Admin Account
```
Email: admin@alaskapay.test
Password: Admin123!@#
Role: admin
Wallet Balance: ₦100,000
KYC Status: Verified (Tier 3)
```

#### Test Users
```
User 1:
Email: john.doe@alaskapay.test
Password: Test123!@#
Wallet: ₦10,000
KYC: Tier 2

User 2:
Email: jane.smith@alaskapay.test
Password: Test123!@#
Wallet: ₦5,000
KYC: Tier 1

User 3:
Email: mike.johnson@alaskapay.test
Password: Test123!@#
Wallet: ₦15,000
KYC: Tier 3

User 4:
Email: sarah.williams@alaskapay.test
Password: Test123!@#
Wallet: ₦2,000
KYC: Tier 0 (Unverified)

User 5:
Email: david.brown@alaskapay.test
Password: Test123!@#
Wallet: ₦8,000
KYC: Tier 2
```

#### Merchant Accounts
```
Merchant 1:
Email: shop@alaskapay.test
Password: Merchant123!@#
Business: AlaskaPay Shop
Wallet: ₦50,000
Commission Rate: 2.5%

Merchant 2:
Email: store@alaskapay.test
Password: Merchant123!@#
Business: AlaskaPay Store
Wallet: ₦30,000
Commission Rate: 3.0%
```

## Test Payment Methods

### Test Bank Accounts
```
Bank: GTBank
Account: 0123456789
Name: John Doe Test

Bank: Access Bank
Account: 9876543210
Name: Jane Smith Test

Bank: Zenith Bank
Account: 5555555555
Name: Mike Johnson Test
```

### Test Cards (Paystack Test Mode)
```
Successful Transaction:
Card: 4084 0840 8408 4081
CVV: 408
Expiry: 12/30
PIN: 0000

Failed Transaction:
Card: 5060 6666 6666 6666
CVV: 123
Expiry: 12/30
PIN: 0000

3DS Authentication:
Card: 5531 8866 5214 2950
CVV: 564
Expiry: 10/30
PIN: 3310
OTP: 123456
```

## Test Scenarios Data

### Sample Transactions
```sql
-- Pre-populate test transactions
INSERT INTO transactions (user_id, type, amount, status, description)
VALUES
  ('user1-id', 'transfer', 1000, 'completed', 'Test transfer to User 2'),
  ('user1-id', 'withdrawal', 500, 'completed', 'Test withdrawal'),
  ('user2-id', 'deposit', 2000, 'completed', 'Test wallet top-up'),
  ('user3-id', 'bill_payment', 300, 'completed', 'Airtime purchase'),
  ('user4-id', 'transfer', 100, 'failed', 'Insufficient balance');
```

### Sample Bills
```
Airtime:
Provider: MTN
Amount: ₦100 - ₦50,000
Phone: 08012345678

Data:
Provider: Airtel
Plan: 1GB - ₦500
Phone: 08098765432

Electricity:
Provider: EKEDC
Meter: 12345678901
Amount: ₦1,000 - ₦50,000
```

### Sample Virtual Cards
```
Card 1:
Type: Mastercard
Balance: ₦5,000
Status: Active
Usage: Online shopping

Card 2:
Type: Visa
Balance: ₦10,000
Status: Frozen
Usage: Subscriptions
```

## Testing Workflows

### 1. New User Journey
1. Sign up with test email
2. Verify email (auto-verify in test mode)
3. Set transaction PIN
4. Complete KYC (Tier 1)
5. Top up wallet (₦1,000)
6. Make first transaction

### 2. Payment Flow
1. Login as User 1
2. Generate payment link (₦500)
3. Login as User 2 (different browser)
4. Pay via link
5. Verify both wallets updated

### 3. Bill Payment Flow
1. Login as any user
2. Select airtime purchase
3. Enter phone number
4. Confirm with PIN
5. Receive confirmation

### 4. Virtual Card Flow
1. Login as verified user (Tier 2+)
2. Create virtual card
3. Fund card (₦5,000)
4. View card details
5. Test freeze/unfreeze

### 5. Referral Flow
1. Login as User 1
2. Generate referral link
3. Share link (copy URL)
4. Sign up new user via link
5. Check User 1's referral earnings

## Database Reset Commands

### Reset All Test Data
```bash
# Clear test transactions
npm run db:clear-test-data

# Reset test wallets
npm run db:reset-wallets

# Remove test accounts
npm run db:remove-test-accounts

# Full reset and recreate
npm run db:reset-all-test
```

### Selective Reset
```sql
-- Reset specific user's wallet
UPDATE wallets 
SET balance = 10000 
WHERE user_id = 'test-user-id';

-- Clear user's transactions
DELETE FROM transactions 
WHERE user_id = 'test-user-id';

-- Reset KYC status
UPDATE profiles 
SET kyc_tier = 0, kyc_status = 'pending' 
WHERE user_id = 'test-user-id';
```

## Environment Variables for Testing

```env
# Test Mode Flags
VITE_TEST_MODE=true
VITE_SKIP_EMAIL_VERIFICATION=true
VITE_AUTO_APPROVE_KYC=false
VITE_USE_TEST_PAYMENT_GATEWAY=true

# Test API Keys
VITE_PAYSTACK_TEST_PUBLIC_KEY=pk_test_xxxxx
VITE_PAYSTACK_TEST_SECRET_KEY=sk_test_xxxxx

# Test Database
VITE_SUPABASE_TEST_URL=https://test.supabase.co
VITE_SUPABASE_TEST_ANON_KEY=xxxxx
```

## Quick Test Commands

```bash
# Create test accounts
npm run test:create-accounts

# Fund test wallets
npm run test:fund-wallets

# Generate test transactions
npm run test:generate-transactions

# Reset everything
npm run test:reset-all

# Run full test suite
npm run test:e2e
```

## Beta Tester Accounts

For external beta testers, create accounts with:
- Real email addresses
- Limited wallet balance (₦1,000)
- Auto-verify email
- Tier 1 KYC by default
- Rate limiting enabled

```bash
# Create beta tester account
npm run create:beta-tester email@example.com
```

## Troubleshooting

### Issue: Can't login with test account
**Solution**: Check if account exists in database, reset password if needed

### Issue: Wallet balance not updating
**Solution**: Check transaction logs, verify webhook processing

### Issue: Payment failing
**Solution**: Verify test mode is enabled, check API keys

### Issue: KYC not approving
**Solution**: Check auto-approve flag, manually approve in admin panel

---

**Need Help?** Check TESTING_GUIDE.md for detailed testing procedures

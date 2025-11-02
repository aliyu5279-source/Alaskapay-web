# 🧪 Quick Testing Guide - Alaska Pay

## Run Automated Tests

### Option 1: Bash Script (Mac/Linux)
```bash
chmod +x scripts/run-tests.sh
./scripts/run-tests.sh
```

### Option 2: Manual Testing (All Platforms)

#### Step 1: Verify Environment Variables
Check your `.env` file has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_key
PAYSTACK_SECRET_KEY=your_secret_key
```

#### Step 2: Test Database Connection
Open Supabase SQL Editor and run:
```sql
SELECT NOW() as current_time;
```

#### Step 3: Create Test Users
In Supabase Authentication > Users:
1. Add user: `user1@test.com` (password: `Test123!@#`)
2. Add user: `user2@test.com` (password: `Test123!@#`)

#### Step 4: Verify Wallets Created
```sql
SELECT 
  p.email,
  w.balance,
  w.created_at
FROM profiles p
LEFT JOIN wallets w ON w.user_id = p.id
WHERE p.email IN ('user1@test.com', 'user2@test.com');
```

#### Step 5: Fund Test Wallet
```sql
-- Give User 1 test balance
UPDATE wallets 
SET balance = 10000.00 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'user1@test.com');
```

#### Step 6: Test Transfer with Commission
```sql
-- Transfer ₦1,000 from User 1 to User 2
-- Commission: ₦15 (1.5%)
SELECT transfer_funds(
  (SELECT id FROM profiles WHERE email = 'user1@test.com'),
  (SELECT id FROM profiles WHERE email = 'user2@test.com'),
  1000.00,
  'Test transfer'
);

-- Verify results
SELECT 
  p.email,
  w.balance
FROM profiles p
JOIN wallets w ON w.user_id = p.id
WHERE p.email IN ('user1@test.com', 'user2@test.com');

-- Expected:
-- user1@test.com: ₦8,985 (10,000 - 1,000 - 15)
-- user2@test.com: ₦1,000
```

#### Step 7: Verify Commission
```sql
SELECT 
  c.amount as commission_amount,
  c.transaction_id,
  c.status,
  c.created_at
FROM commissions c
ORDER BY c.created_at DESC
LIMIT 5;

-- Expected: ₦15 commission, status: 'pending'
```

#### Step 8: Check Transaction History
```sql
SELECT 
  t.type,
  t.amount,
  t.commission_amount,
  t.status,
  p.email,
  t.created_at
FROM transactions t
JOIN profiles p ON p.id = t.user_id
ORDER BY t.created_at DESC
LIMIT 10;
```

---

## Browser Testing

### Test Paystack Payment
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:5173`
3. Login as `user1@test.com`
4. Click "Fund Wallet"
5. Enter amount: ₦5,000
6. Use Paystack test card:
   - **Card:** 4084084084084081
   - **Expiry:** 12/25
   - **CVV:** 408
   - **PIN:** 0000
   - **OTP:** 123456
7. Verify wallet updates

### Test Money Transfer
1. Login as `user1@test.com`
2. Click "Transfer Money"
3. Enter recipient: `user2@test.com` or phone
4. Amount: ₦1,000
5. Confirm transfer
6. Verify:
   - User 1 balance: -₦1,015 (includes ₦15 commission)
   - User 2 balance: +₦1,000
   - Commission recorded

### Test Transaction History
1. Navigate to "Transactions"
2. Verify all transactions listed
3. Check commission amounts
4. Test filters (date, type, status)
5. Export to CSV/PDF

---

## Commission Verification

### Check Total Commissions
```sql
SELECT 
  COUNT(*) as total_transactions,
  SUM(amount) as total_commissions,
  status
FROM commissions
GROUP BY status;
```

### Commission Breakdown by Date
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as transaction_count,
  SUM(amount) as daily_commission
FROM commissions
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Verify Beneficiary Details
```sql
SELECT * FROM commission_settings WHERE is_active = true;

-- Expected:
-- rate: 1.5
-- beneficiary_name: Alaska Mega Plus Ltd
-- bank_name: Taj Bank
-- account_number: 0013010127
```

---

## Error Testing

### Test 1: Insufficient Balance
```sql
-- Try to transfer more than balance
SELECT transfer_funds(
  (SELECT id FROM profiles WHERE email = 'user2@test.com'),
  (SELECT id FROM profiles WHERE email = 'user1@test.com'),
  10000.00,
  'Should fail'
);

-- Expected: Error message
```

### Test 2: Invalid Recipient
```sql
-- Try to transfer to non-existent user
SELECT transfer_funds(
  (SELECT id FROM profiles WHERE email = 'user1@test.com'),
  '00000000-0000-0000-0000-000000000000',
  100.00,
  'Should fail'
);

-- Expected: Error message
```

### Test 3: Negative Amount
```sql
-- Try negative transfer
SELECT transfer_funds(
  (SELECT id FROM profiles WHERE email = 'user1@test.com'),
  (SELECT id FROM profiles WHERE email = 'user2@test.com'),
  -100.00,
  'Should fail'
);

-- Expected: Error message
```

---

## Performance Testing

### Test Concurrent Transfers
Open 2 browser tabs:
1. Both login as same user
2. Initiate transfers simultaneously
3. Verify no race conditions
4. Check final balance is correct

### Test Large Volume
```sql
-- Create 100 test transactions
DO $$
BEGIN
  FOR i IN 1..100 LOOP
    PERFORM transfer_funds(
      (SELECT id FROM profiles WHERE email = 'user1@test.com'),
      (SELECT id FROM profiles WHERE email = 'user2@test.com'),
      10.00,
      'Load test ' || i
    );
  END LOOP;
END $$;

-- Verify all commissions calculated
SELECT COUNT(*), SUM(amount) FROM commissions;
-- Expected: 100 transactions, ₦15 total commission
```

---

## ✅ Success Criteria

All tests pass when:
- [x] Users can signup and login
- [x] Wallets created automatically
- [x] Paystack payments work
- [x] Transfers deduct 1.5% commission
- [x] Commission goes to Taj Bank 0013010127
- [x] Transaction history accurate
- [x] No negative balances possible
- [x] Error messages clear
- [x] Concurrent transactions handled
- [x] Webhooks update status

---

## 🆘 Troubleshooting

**Wallet not updating?**
- Check Paystack webhook URL
- Verify environment variables
- Check Supabase logs

**Commission not calculated?**
- Verify commission_settings table
- Check transfer_funds() function
- Review transaction triggers

**Transfer fails?**
- Check wallet balance includes commission
- Verify recipient exists
- Check database constraints

---

## 📞 Need Help?

1. Check Supabase logs: Dashboard > Logs
2. Review Paystack events: Dashboard > Events
3. See detailed guide: `PRE_LAUNCH_TESTING.md`

**Ready to test!** 🚀

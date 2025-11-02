# 🚀 Pre-Launch Testing Guide - Alaska Pay

## Complete Payment Flow Testing Checklist

### Prerequisites
- ✅ Database migrations applied
- ✅ Vercel environment variables configured
- ✅ Paystack test keys active
- ✅ Supabase project running

---

## 1️⃣ USER SIGNUP & AUTHENTICATION

### Test Scenario 1.1: Successful Signup
**Steps:**
1. Navigate to `/signup`
2. Enter valid email, phone, password
3. Submit form
4. Verify email sent
5. Click verification link
6. Confirm account activated

**Expected Results:**
- ✅ User created in `profiles` table
- ✅ Wallet created with ₦0.00 balance
- ✅ Email verification sent
- ✅ User redirected to dashboard

**SQL Verification:**
```sql
SELECT * FROM profiles WHERE email = 'test@example.com';
SELECT * FROM wallets WHERE user_id = 'USER_ID';
```

### Test Scenario 1.2: Duplicate Email
**Steps:**
1. Attempt signup with existing email
2. Submit form

**Expected Results:**
- ❌ Error: "Email already exists"
- ❌ No duplicate profile created

---

## 2️⃣ WALLET FUNDING VIA PAYSTACK

### Test Scenario 2.1: Successful Funding (Test Mode)
**Steps:**
1. Login to dashboard
2. Click "Fund Wallet"
3. Enter amount: ₦5,000
4. Click "Pay with Paystack"
5. Use Paystack test card:
   - Card: 4084084084084081
   - Expiry: 12/25
   - CVV: 408
   - PIN: 0000
   - OTP: 123456
6. Complete payment

**Expected Results:**
- ✅ Payment successful
- ✅ Wallet balance: ₦5,000
- ✅ Transaction recorded with status: 'completed'
- ✅ Transaction type: 'deposit'
- ✅ No commission on deposits

**SQL Verification:**
```sql
SELECT * FROM wallets WHERE user_id = 'USER_ID';
SELECT * FROM transactions WHERE user_id = 'USER_ID' AND type = 'deposit';
```

### Test Scenario 2.2: Failed Payment
**Steps:**
1. Click "Fund Wallet"
2. Enter amount: ₦2,000
3. Use declined test card: 5060666666666666666
4. Attempt payment

**Expected Results:**
- ❌ Payment declined
- ❌ Wallet balance unchanged
- ✅ Transaction recorded with status: 'failed'

---

## 3️⃣ MONEY TRANSFERS WITH COMMISSION

### Test Scenario 3.1: Successful Transfer (1.5% Commission)
**Setup:**
- User A wallet: ₦10,000
- User B wallet: ₦0

**Steps:**
1. Login as User A
2. Navigate to "Transfer"
3. Enter User B phone/email
4. Amount: ₦1,000
5. Confirm transfer

**Expected Results:**
- ✅ User A balance: ₦10,000 - ₦1,000 - ₦15 = ₦8,985
- ✅ User B balance: ₦1,000
- ✅ Commission: ₦15 (1.5% of ₦1,000)
- ✅ Commission recorded for Taj Bank 0013010127
- ✅ Transaction history shows:
  - User A: -₦1,015 (transfer + commission)
  - User B: +₦1,000 (received)
  - Alaska Mega Plus: +₦15 (commission)

**SQL Verification:**
```sql
-- Check User A balance
SELECT balance FROM wallets WHERE user_id = 'USER_A_ID';

-- Check User B balance
SELECT balance FROM wallets WHERE user_id = 'USER_B_ID';

-- Check commission record
SELECT * FROM commissions 
WHERE transaction_id = 'TRANSACTION_ID' 
AND amount = 15.00 
AND status = 'pending';

-- Check all transactions
SELECT * FROM transactions 
WHERE reference LIKE 'TXN-%' 
ORDER BY created_at DESC 
LIMIT 5;
```

### Test Scenario 3.2: Insufficient Balance
**Setup:**
- User wallet: ₦100

**Steps:**
1. Attempt transfer of ₦500
2. Submit

**Expected Results:**
- ❌ Error: "Insufficient balance"
- ❌ No transaction created
- ✅ Wallet balance unchanged

### Test Scenario 3.3: Large Transfer Commission
**Setup:**
- User wallet: ₦100,000

**Steps:**
1. Transfer ₦50,000
2. Confirm

**Expected Results:**
- ✅ Amount transferred: ₦50,000
- ✅ Commission: ₦750 (1.5% of ₦50,000)
- ✅ Total deducted: ₦50,750
- ✅ Final balance: ₦49,250

---

## 4️⃣ COMMISSION TRACKING

### Test Scenario 4.1: Commission Dashboard
**Steps:**
1. Login as admin
2. Navigate to Admin > Commissions
3. View commission summary

**Expected Results:**
- ✅ Total commissions displayed
- ✅ Pending commissions listed
- ✅ Beneficiary: Alaska Mega Plus Ltd
- ✅ Bank: Taj Bank (0013010127)
- ✅ All 1.5% calculations correct

**SQL Verification:**
```sql
-- Total commissions
SELECT SUM(amount) as total_commissions 
FROM commissions 
WHERE status = 'pending';

-- Commission breakdown
SELECT 
  DATE(created_at) as date,
  COUNT(*) as transaction_count,
  SUM(amount) as daily_commission
FROM commissions
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Test Scenario 4.2: Commission Withdrawal
**Steps:**
1. Navigate to Commission Withdrawal
2. Request payout
3. Verify Paystack transfer initiated

**Expected Results:**
- ✅ Transfer to Taj Bank 0013010127
- ✅ Commission status: 'paid'
- ✅ Payout recorded in system

---

## 5️⃣ TRANSACTION HISTORY

### Test Scenario 5.1: View All Transactions
**Steps:**
1. Navigate to "Transactions"
2. View transaction list

**Expected Results:**
- ✅ All transactions displayed
- ✅ Correct timestamps
- ✅ Accurate amounts
- ✅ Status indicators (completed/failed/pending)
- ✅ Transaction types (deposit/transfer/withdrawal)
- ✅ Commission charges visible

### Test Scenario 5.2: Filter Transactions
**Steps:**
1. Filter by date range
2. Filter by type (deposits only)
3. Filter by status (completed)

**Expected Results:**
- ✅ Filters work correctly
- ✅ Results match criteria
- ✅ Export functionality works

### Test Scenario 5.3: Transaction Details
**Steps:**
1. Click on any transaction
2. View details modal

**Expected Results:**
- ✅ Full transaction details
- ✅ Reference number
- ✅ Timestamp
- ✅ Amount breakdown
- ✅ Commission (if applicable)
- ✅ Recipient info (if transfer)

---

## 6️⃣ WITHDRAWAL FLOW

### Test Scenario 6.1: Bank Withdrawal
**Steps:**
1. Link bank account
2. Request withdrawal: ₦2,000
3. Confirm

**Expected Results:**
- ✅ Wallet balance reduced
- ✅ Withdrawal status: 'pending'
- ✅ Paystack transfer initiated
- ✅ Transaction recorded
- ✅ No commission on withdrawals

**SQL Verification:**
```sql
SELECT * FROM transactions 
WHERE type = 'withdrawal' 
AND user_id = 'USER_ID';

SELECT * FROM bank_accounts 
WHERE user_id = 'USER_ID';
```

---

## 7️⃣ EDGE CASES & ERROR HANDLING

### Test Scenario 7.1: Concurrent Transactions
**Steps:**
1. Open two browser tabs
2. Initiate transfer in both simultaneously
3. Submit both

**Expected Results:**
- ✅ Only one succeeds (if insufficient balance)
- ✅ Database consistency maintained
- ✅ No negative balances

### Test Scenario 7.2: Network Failure
**Steps:**
1. Disconnect internet during payment
2. Reconnect
3. Check transaction status

**Expected Results:**
- ✅ Transaction marked as 'pending'
- ✅ Webhook updates status when reconnected
- ✅ User notified of status

### Test Scenario 7.3: Invalid Recipient
**Steps:**
1. Attempt transfer to non-existent user
2. Submit

**Expected Results:**
- ❌ Error: "Recipient not found"
- ❌ No transaction created

---

## 8️⃣ PAYSTACK WEBHOOK TESTING

### Test Scenario 8.1: Payment Success Webhook
**Steps:**
1. Use Paystack webhook tester
2. Send 'charge.success' event
3. Verify system response

**Expected Results:**
- ✅ Wallet updated
- ✅ Transaction status: 'completed'
- ✅ User notified

### Test Scenario 8.2: Transfer Webhook
**Steps:**
1. Send 'transfer.success' webhook
2. Verify commission payout

**Expected Results:**
- ✅ Commission status: 'paid'
- ✅ Payout recorded

---

## 🧪 AUTOMATED TEST SCRIPT

Run this SQL to create test data:

```sql
-- Create test users
INSERT INTO auth.users (id, email) VALUES
('test-user-1', 'user1@test.com'),
('test-user-2', 'user2@test.com');

-- Create profiles
INSERT INTO profiles (id, email, phone, full_name) VALUES
('test-user-1', 'user1@test.com', '+2348012345678', 'Test User 1'),
('test-user-2', 'user2@test.com', '+2348087654321', 'Test User 2');

-- Create wallets
INSERT INTO wallets (user_id, balance) VALUES
('test-user-1', 10000.00),
('test-user-2', 0.00);
```

---

## ✅ FINAL CHECKLIST

Before going live, ensure:

- [ ] All test scenarios pass
- [ ] Commission calculations accurate (1.5%)
- [ ] Taj Bank 0013010127 receives commissions
- [ ] No negative balances possible
- [ ] Webhooks configured and tested
- [ ] Error messages user-friendly
- [ ] Transaction history accurate
- [ ] Email notifications working
- [ ] Mobile responsive
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Backup system tested

---

## 📊 SUCCESS METRICS

**Target Performance:**
- Payment success rate: >95%
- Commission accuracy: 100%
- Transaction processing: <3 seconds
- Webhook response: <1 second
- Zero negative balances
- Zero duplicate transactions

---

## 🆘 TROUBLESHOOTING

### Issue: Wallet not updating
**Solution:** Check Paystack webhook URL in dashboard

### Issue: Commission not deducted
**Solution:** Verify commission trigger in transactions table

### Issue: Transfer fails
**Solution:** Check wallet balance includes commission amount

---

## 📞 SUPPORT

For testing issues:
- Check Supabase logs
- Review Paystack dashboard
- Verify environment variables
- Test in incognito mode

**Ready to launch!** 🚀

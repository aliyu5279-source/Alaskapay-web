# 🔧 Service Testing Guide - Alaska Pay

## Test Individual Services

### 1. Wallet Service Tests

#### Test Top-Up Function
```typescript
// In browser console or test file
import { walletService } from './src/services/walletService';

// Test wallet top-up
const result = await walletService.topUp(5000, 'paystack');
console.log('Top-up result:', result);

// Expected: Transaction ID and reference
```

#### Test Transfer Function
```typescript
// Test money transfer
const transfer = await walletService.transfer(
  'recipient-user-id',
  1000,
  'Test transfer'
);
console.log('Transfer result:', transfer);

// Verify commission deducted
// Expected: 1.5% commission (₦15 for ₦1,000)
```

#### Test Withdrawal
```typescript
// Test withdrawal
const withdrawal = await walletService.requestWithdrawal(
  2000,
  'bank-account-id'
);
console.log('Withdrawal result:', withdrawal);
```

---

### 2. Payment Service Tests

#### Test Paystack Initialization
```typescript
import { paymentService } from './src/services/paymentService';

// Initialize payment
const payment = await paymentService.initializePayment({
  amount: 5000,
  email: 'user@test.com',
  metadata: {
    userId: 'user-id',
    purpose: 'wallet_funding'
  }
});

console.log('Payment URL:', payment.authorization_url);
// Open URL to complete payment
```

#### Test Payment Verification
```typescript
// After payment, verify with reference
const verified = await paymentService.verifyPayment('REFERENCE');
console.log('Payment verified:', verified);

// Expected: status = 'success', amount matches
```

---

### 3. Commission Service Tests

#### Test Commission Calculation
```typescript
// Test commission calculation
const amount = 10000; // ₦10,000
const commission = amount * 0.015; // 1.5%

console.log(`Amount: ₦${amount}`);
console.log(`Commission: ₦${commission}`);
console.log(`Total: ₦${amount + commission}`);

// Expected: Commission = ₦150
```

#### Test Commission Tracking
```sql
-- In Supabase SQL Editor
-- Get all commissions for today
SELECT 
  c.id,
  c.amount,
  c.transaction_id,
  c.status,
  t.amount as transaction_amount,
  (c.amount / t.amount * 100) as commission_percentage
FROM commissions c
JOIN transactions t ON t.id = c.transaction_id
WHERE DATE(c.created_at) = CURRENT_DATE
ORDER BY c.created_at DESC;

-- Verify all commissions are 1.5%
```

---

### 4. Bank Service Tests

#### Test Bank Account Linking
```typescript
import { bankService } from './src/services/bankService';

// Link bank account
const linked = await bankService.linkBankAccount({
  bank_code: '000013', // Taj Bank
  account_number: '0013010127',
  account_name: 'Alaska Mega Plus Ltd'
});

console.log('Bank linked:', linked);
```

#### Test Bank Verification
```typescript
// Verify bank account
const verified = await bankService.verifyBankAccount(
  '000013',
  '0013010127'
);

console.log('Account name:', verified.account_name);
// Expected: Alaska Mega Plus Ltd
```

---

### 5. KYC Service Tests

#### Test Document Upload
```typescript
import { kycService } from './src/services/kycService';

// Upload KYC document
const file = document.querySelector('input[type="file"]').files[0];
const uploaded = await kycService.uploadDocument(
  'user-id',
  'id_card',
  file
);

console.log('Document uploaded:', uploaded);
```

#### Test KYC Status Check
```sql
-- Check KYC verification status
SELECT 
  u.email,
  k.status,
  k.tier,
  k.verified_at
FROM profiles u
LEFT JOIN kyc_verifications k ON k.user_id = u.id
WHERE u.email = 'test@example.com';
```

---

### 6. Transaction History Tests

#### Test Transaction Retrieval
```typescript
// Get user transactions
const transactions = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', 'user-id')
  .order('created_at', { ascending: false })
  .limit(10);

console.log('Recent transactions:', transactions.data);
```

#### Test Transaction Filtering
```sql
-- Filter by type
SELECT * FROM transactions 
WHERE user_id = 'USER_ID' 
AND type = 'transfer'
ORDER BY created_at DESC;

-- Filter by date range
SELECT * FROM transactions 
WHERE user_id = 'USER_ID' 
AND created_at BETWEEN '2025-01-01' AND '2025-01-31'
ORDER BY created_at DESC;

-- Filter by status
SELECT * FROM transactions 
WHERE user_id = 'USER_ID' 
AND status = 'completed'
ORDER BY created_at DESC;
```

---

### 7. Webhook Tests

#### Test Paystack Webhook
```bash
# Use Paystack webhook tester or curl
curl -X POST https://your-domain.com/api/paystack-webhook \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: YOUR_SIGNATURE" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "TEST_REF_123",
      "amount": 500000,
      "status": "success"
    }
  }'
```

#### Test Webhook Processing
```sql
-- Check if webhook updated transaction
SELECT * FROM transactions 
WHERE reference = 'TEST_REF_123';

-- Should show status = 'completed'
```

---

### 8. Real-Time Updates Tests

#### Test Wallet Balance Updates
```typescript
// Subscribe to wallet changes
const subscription = supabase
  .channel('wallet-changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'wallets',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Wallet updated:', payload.new.balance);
    }
  )
  .subscribe();

// Make a transaction and watch balance update in real-time
```

#### Test Transaction Notifications
```typescript
// Subscribe to new transactions
const txSubscription = supabase
  .channel('transaction-notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'transactions',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New transaction:', payload.new);
    }
  )
  .subscribe();
```

---

### 9. Error Handling Tests

#### Test Network Errors
```typescript
// Simulate network failure
const originalFetch = window.fetch;
window.fetch = () => Promise.reject(new Error('Network error'));

try {
  await walletService.transfer('recipient-id', 1000, 'Test');
} catch (error) {
  console.log('Error caught:', error.message);
  // Expected: User-friendly error message
}

// Restore fetch
window.fetch = originalFetch;
```

#### Test Validation Errors
```typescript
// Test invalid amount
try {
  await walletService.transfer('recipient-id', -100, 'Invalid');
} catch (error) {
  console.log('Validation error:', error.message);
  // Expected: "Amount must be positive"
}

// Test insufficient balance
try {
  await walletService.transfer('recipient-id', 999999, 'Too much');
} catch (error) {
  console.log('Balance error:', error.message);
  // Expected: "Insufficient balance"
}
```

---

### 10. Load Testing

#### Test Multiple Concurrent Transfers
```typescript
// Create 10 simultaneous transfers
const transfers = Array.from({ length: 10 }, (_, i) => 
  walletService.transfer(
    'recipient-id',
    100,
    `Load test ${i + 1}`
  )
);

const results = await Promise.allSettled(transfers);
console.log('Completed:', results.filter(r => r.status === 'fulfilled').length);
console.log('Failed:', results.filter(r => r.status === 'rejected').length);
```

#### Monitor Database Performance
```sql
-- Check transaction processing time
SELECT 
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_processing_seconds,
  MAX(EXTRACT(EPOCH FROM (updated_at - created_at))) as max_processing_seconds,
  COUNT(*) as total_transactions
FROM transactions
WHERE created_at > NOW() - INTERVAL '1 hour'
AND status = 'completed';

-- Target: < 3 seconds average
```

---

## 🎯 Testing Checklist

### Core Functionality
- [ ] User signup/login works
- [ ] Wallet created on signup
- [ ] Paystack payment successful
- [ ] Money transfer works
- [ ] Commission calculated (1.5%)
- [ ] Commission to Taj Bank 0013010127
- [ ] Transaction history accurate
- [ ] Withdrawal processing works

### Error Handling
- [ ] Insufficient balance error
- [ ] Invalid recipient error
- [ ] Network error handling
- [ ] Validation errors clear
- [ ] No negative balances
- [ ] No duplicate transactions

### Performance
- [ ] Transfers complete < 3s
- [ ] Webhooks process < 1s
- [ ] Real-time updates instant
- [ ] Concurrent transactions handled
- [ ] Database queries optimized

### Security
- [ ] RLS policies active
- [ ] API keys secure
- [ ] Webhook signatures verified
- [ ] SQL injection prevented
- [ ] XSS protection enabled

---

## 📊 Test Results Template

```
Test Date: ___________
Tester: ___________

✅ PASSED:
- Wallet service: All functions work
- Payment service: Paystack integration successful
- Commission: 1.5% calculated correctly
- Transaction history: Accurate records

❌ FAILED:
- [List any failures]

⚠️ ISSUES:
- [List any concerns]

📝 NOTES:
- [Additional observations]
```

---

## 🚀 Ready for Production?

Before deploying:
1. All tests pass ✅
2. Commission verified ✅
3. Error handling tested ✅
4. Performance acceptable ✅
5. Security reviewed ✅
6. Backups configured ✅

**Go live!** 🎉

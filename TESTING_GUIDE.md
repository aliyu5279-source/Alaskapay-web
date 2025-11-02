# 🎯 Alaska Pay Testing Guide - Quick Start

## 🚀 Start Here

### Step 1: Choose Your Testing Method

#### Option A: Interactive Browser Test (Easiest)
```bash
# Open in browser
open TEST_ENV_IN_BROWSER.html
# or double-click the file
```

This will test:
- ✅ Environment variables
- ✅ Supabase connection
- ✅ Commission calculation (1.5%)
- ✅ Paystack integration
- ✅ Full payment flow simulation

#### Option B: Automated Script (Mac/Linux)
```bash
chmod +x scripts/run-tests.sh
./scripts/run-tests.sh
```

#### Option C: Manual Testing (All Platforms)
Follow the guide in `RUN_TESTS.md`

---

## 📋 Complete Testing Checklist

### Phase 1: Environment Setup ✓
- [ ] Database migration applied
- [ ] Vercel environment variables set
- [ ] Supabase project configured
- [ ] Paystack keys added

**Files to check:**
- `APPLY_DATABASE_FIX.md` - Database setup
- `VERCEL_ENV_COMPLETE_SETUP.md` - Environment variables
- `scripts/setup-vercel-env.sh` - Automated setup

---

### Phase 2: Core Functionality Testing

#### 2.1 User Authentication
- [ ] Signup creates user
- [ ] Wallet auto-created
- [ ] Email verification works
- [ ] Login successful

**Test users:**
- user1@test.com (password: Test123!@#)
- user2@test.com (password: Test123!@#)

#### 2.2 Wallet Funding
- [ ] Paystack modal opens
- [ ] Test card accepted (4084084084084081)
- [ ] Wallet balance updates
- [ ] Transaction recorded

**Test amount:** ₦5,000

#### 2.3 Money Transfer with Commission
- [ ] Transfer initiated
- [ ] Commission calculated (1.5%)
- [ ] Sender debited (amount + commission)
- [ ] Recipient credited (amount only)
- [ ] Commission recorded

**Test scenario:**
```
Transfer: ₦1,000
Commission: ₦15 (1.5%)
Total deducted: ₦1,015
Recipient receives: ₦1,000
Commission to: Taj Bank 0013010127
```

#### 2.4 Transaction History
- [ ] All transactions listed
- [ ] Amounts accurate
- [ ] Commission visible
- [ ] Filters work
- [ ] Export functions

---

### Phase 3: Commission Verification

#### SQL Checks
```sql
-- Total commissions today
SELECT SUM(amount) FROM commissions 
WHERE DATE(created_at) = CURRENT_DATE;

-- Verify beneficiary
SELECT * FROM commission_settings 
WHERE is_active = true;

-- Commission breakdown
SELECT 
  COUNT(*) as transactions,
  SUM(amount) as total_commission
FROM commissions
WHERE status = 'pending';
```

**Expected:**
- Rate: 1.5%
- Beneficiary: Alaska Mega Plus Ltd
- Bank: Taj Bank
- Account: 0013010127

---

### Phase 4: Error Handling

#### Test These Scenarios:
- [ ] Insufficient balance error
- [ ] Invalid recipient error
- [ ] Negative amount blocked
- [ ] Duplicate transaction prevented
- [ ] Network failure handled

**See:** `PRE_LAUNCH_TESTING.md` Section 7

---

### Phase 5: Performance Testing

#### Metrics to Verify:
- [ ] Transfer completes < 3 seconds
- [ ] Webhook processes < 1 second
- [ ] No race conditions
- [ ] Concurrent transfers handled
- [ ] Database queries optimized

**See:** `TEST_SERVICES_GUIDE.md` Section 10

---

## 🎓 Testing Resources

### Quick References
1. **PRE_LAUNCH_TESTING.md** - Complete test scenarios
2. **RUN_TESTS.md** - Step-by-step manual testing
3. **TEST_SERVICES_GUIDE.md** - Service-level testing
4. **TEST_ENV_IN_BROWSER.html** - Interactive browser tests

### SQL Test Queries
```sql
-- Check wallet balances
SELECT p.email, w.balance 
FROM profiles p 
JOIN wallets w ON w.user_id = p.id;

-- Recent transactions
SELECT * FROM transactions 
ORDER BY created_at DESC 
LIMIT 10;

-- Commission summary
SELECT 
  DATE(created_at) as date,
  COUNT(*) as count,
  SUM(amount) as total
FROM commissions
GROUP BY DATE(created_at);
```

---

## ✅ Pre-Launch Checklist

Before going live:

### Technical
- [ ] All tests pass
- [ ] Commission accurate (1.5%)
- [ ] No negative balances possible
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] Security reviewed

### Business
- [ ] Taj Bank account verified (0013010127)
- [ ] Commission beneficiary confirmed
- [ ] Paystack live keys ready
- [ ] Terms of service updated
- [ ] Privacy policy reviewed

### Operations
- [ ] Monitoring configured
- [ ] Backup system tested
- [ ] Support team trained
- [ ] Incident response plan ready

---

## 🧪 Test Data

### Paystack Test Cards

**Success Card:**
```
Card: 4084084084084081
Expiry: 12/25
CVV: 408
PIN: 0000
OTP: 123456
```

**Decline Card:**
```
Card: 5060666666666666666
```

### Test Amounts
- Small: ₦100 (Commission: ₦1.50)
- Medium: ₦1,000 (Commission: ₦15)
- Large: ₦10,000 (Commission: ₦150)

---

## 🆘 Troubleshooting

### Common Issues

**1. Wallet not updating**
- Check Paystack webhook URL
- Verify environment variables
- Review Supabase logs

**2. Commission not calculated**
- Verify commission_settings table
- Check transfer_funds() function
- Review transaction triggers

**3. Transfer fails**
- Ensure balance includes commission
- Verify recipient exists
- Check database constraints

**4. Environment variables not working**
- Restart dev server
- Clear browser cache
- Check .env file format

---

## 📊 Success Criteria

### All Green? ✅
- Users can signup/login
- Payments process successfully
- Transfers work with commission
- Commission goes to Taj Bank 0013010127
- Transaction history accurate
- Errors handled gracefully
- Performance meets targets

### Ready to Launch! 🚀

---

## 📞 Next Steps

1. **Run Interactive Test**
   ```bash
   open TEST_ENV_IN_BROWSER.html
   ```

2. **Run Full Test Suite**
   ```bash
   ./scripts/run-tests.sh
   ```

3. **Manual Verification**
   - Follow `RUN_TESTS.md`
   - Check each scenario in `PRE_LAUNCH_TESTING.md`

4. **Production Deployment**
   - Switch to Paystack live keys
   - Update environment variables
   - Monitor first transactions
   - Verify commission settlements

---

## 🎉 You're Ready!

All testing documentation is complete. Start with the interactive browser test, then move through the checklist systematically.

**Good luck with your launch!** 🚀

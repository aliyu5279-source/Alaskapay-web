# KYC Tier-Based Transaction Limits

AlaskaPay implements a comprehensive KYC (Know Your Customer) tier system that determines transaction limits for users based on their verification level.

## Tier Structure

### Tier 1 - Basic (₦50,000/day)
**Requirements:**
- BVN verification
- Email verification
- Phone number verification

**Limits:**
- Daily limit: ₦50,000
- Monthly limit: ₦1,000,000
- Per transaction: ₦10,000

**Suitable for:** Everyday transactions, bill payments, airtime purchases

### Tier 2 - Enhanced (₦500,000/day)
**Requirements:**
- All Tier 1 requirements
- Government-issued ID upload
- Address verification
- Selfie verification

**Limits:**
- Daily limit: ₦500,000
- Monthly limit: ₦10,000,000
- Per transaction: ₦100,000

**Suitable for:** Business transactions, high-value transfers, regular merchants

### Tier 3 - Full (Unlimited)
**Requirements:**
- All Tier 2 requirements
- Business registration documents (if applicable)
- Utility bill verification
- Video KYC verification

**Limits:**
- Daily limit: Unlimited
- Monthly limit: Unlimited
- Per transaction: Unlimited

**Suitable for:** Verified businesses, high-volume merchants, corporate accounts

## Database Schema

### kyc_tier_limits Table
```sql
CREATE TABLE kyc_tier_limits (
  id uuid PRIMARY KEY,
  tier_name text NOT NULL,
  kyc_level text UNIQUE NOT NULL,
  daily_limit numeric NOT NULL,
  monthly_limit numeric NOT NULL,
  per_transaction_limit numeric NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
```

### transaction_limits Table (Usage Tracking)
```sql
CREATE TABLE transaction_limits (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  date date NOT NULL,
  total_amount numeric DEFAULT 0,
  transaction_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Edge Functions

### get-tier-limits
Retrieves user's current KYC tier, limits, and daily usage.

**Response:**
```json
{
  "kycLevel": "basic",
  "tierName": "Tier 1 - Basic",
  "dailyLimit": 50000,
  "monthlyLimit": 1000000,
  "perTransactionLimit": 10000,
  "currentUsage": 15000,
  "transactionCount": 3,
  "remaining": 35000,
  "percentUsed": "30.00"
}
```

### check-transaction-limit
Validates if a transaction would exceed user's limits.

**Request:**
```json
{
  "amount": 25000,
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "allowed": true,
  "kycLevel": "basic",
  "dailyLimit": 50000,
  "perTransactionLimit": 10000,
  "currentUsage": 15000,
  "remaining": 35000,
  "wouldExceedDaily": false,
  "exceedsPerTransaction": false,
  "message": "Transaction allowed"
}
```

## UI Components

### TransactionLimitCard
Displays current tier, daily usage with progress bar, and upgrade prompts.

**Features:**
- Real-time usage tracking
- Visual progress bar
- Alerts at 80% and 100% usage
- Upgrade button for non-Tier 3 users
- Nigerian Naira formatting

### LimitUpgradeModal
Shows available upgrade tiers with benefits and requirements.

**Features:**
- Comparison of tier limits
- Feature lists for each tier
- Direct upgrade action
- Clear benefit communication

## Integration Example

```typescript
// Check limit before transfer
const { data } = await supabase.functions.invoke('check-transaction-limit', {
  body: { amount: transferAmount }
});

if (!data.allowed) {
  if (data.wouldExceedDaily) {
    showAlert('Daily limit exceeded. Please upgrade your KYC tier.');
  } else if (data.exceedsPerTransaction) {
    showAlert('Transaction exceeds per-transaction limit.');
  }
  return;
}

// Proceed with transfer
await processTransfer(transferAmount);

// Update usage tracking
await supabase.functions.invoke('record-transaction-usage', {
  body: { amount: transferAmount }
});
```

## Best Practices

1. **Always check limits before transactions**
   - Validate on frontend for UX
   - Validate on backend for security

2. **Update usage immediately**
   - Record transaction in transaction_limits table
   - Keep running totals for the day

3. **Prompt upgrades proactively**
   - Show upgrade options at 80% usage
   - Display benefits of higher tiers

4. **Clear communication**
   - Show remaining limits in dashboard
   - Explain upgrade requirements clearly

5. **Compliance**
   - Follow CBN guidelines for KYC tiers
   - Maintain audit trail of verifications
   - Regular review of tier requirements

## Regulatory Compliance

AlaskaPay's tier system complies with:
- Central Bank of Nigeria (CBN) KYC requirements
- Anti-Money Laundering (AML) regulations
- Counter-Terrorism Financing (CTF) guidelines

All transaction limits are designed to balance user convenience with regulatory compliance and fraud prevention.

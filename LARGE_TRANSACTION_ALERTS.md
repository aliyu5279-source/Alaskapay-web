# Transaction Limits System

## Overview
Alaska Pay implements a comprehensive transaction limits system based on KYC verification levels to comply with financial regulations and prevent fraud.

## Verification Levels and Limits

### 1. Unverified (None)
- **Daily Limit**: $100
- **Requirements**: None
- **Status**: Default for new users

### 2. Basic Verification
- **Daily Limit**: $1,000
- **Requirements**: 
  - Personal information
  - Government-issued ID
  - Proof of address

### 3. Enhanced Verification
- **Daily Limit**: $10,000
- **Requirements**:
  - All Basic requirements
  - Facial liveness verification
  - Additional identity verification

### 4. Full Verification
- **Daily Limit**: Unlimited
- **Requirements**:
  - All Enhanced requirements
  - Business documentation (if applicable)
  - Enhanced due diligence checks

## Features

### Automatic Limit Checking
- Real-time verification before each transaction
- Checks current daily usage against limit
- Blocks transactions that exceed limits

### Warning System
- **80% Warning**: Shows warning when 80% of limit is used
- **100% Block**: Prevents transactions when limit is reached
- **Upgrade Prompts**: Encourages users to upgrade verification

### Dashboard Integration
- Transaction Limit Card showing:
  - Current verification level
  - Daily limit
  - Current usage
  - Remaining balance
  - Progress bar
  - Upgrade button

### Transaction Modal Integration
- Pre-transaction limit checks
- Warning modal for near-limit transactions
- Blocking modal for exceeded limits
- Direct upgrade path from warnings

## Database Schema

### transaction_limits Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- date: DATE (Current date)
- total_amount: DECIMAL(15, 2)
- transaction_count: INTEGER
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

## Edge Functions

### check-transaction-limit
**Purpose**: Check if a transaction is within user's daily limit

**Input**:
```json
{
  "amount": 500.00,
  "userId": "user-uuid"
}
```

**Output**:
```json
{
  "canProceed": true,
  "kycLevel": "basic",
  "dailyLimit": 1000.00,
  "currentUsage": 450.00,
  "remaining": 550.00,
  "requestedAmount": 500.00,
  "newTotal": 950.00,
  "limitExceeded": false,
  "percentUsed": 95.0
}
```

### record-transaction-usage
**Purpose**: Record transaction usage against daily limit

**Input**:
```json
{
  "amount": 500.00,
  "userId": "user-uuid"
}
```

## Usage in Code

### Check Limit Before Transaction
```typescript
const { data } = await supabase.functions.invoke('check-transaction-limit', {
  body: { amount: 500, userId: user.id }
});

if (!data.canProceed) {
  // Show limit exceeded modal
  setShowLimitWarning(true);
  return;
}

// Proceed with transaction
```

### Record Transaction
```typescript
await supabase.functions.invoke('record-transaction-usage', {
  body: { amount: 500, userId: user.id }
});
```

### Display Limit Card
```tsx
<TransactionLimitCard
  kycLevel={limitData.kycLevel}
  dailyLimit={limitData.dailyLimit}
  currentUsage={limitData.currentUsage}
  onUpgradeClick={() => setShowKYCFlow(true)}
/>
```

## User Experience Flow

1. **User Initiates Transaction**
   - Enters amount in transaction modal
   - Clicks submit

2. **System Checks Limit**
   - Calls check-transaction-limit function
   - Calculates if transaction would exceed limit

3. **Decision Point**
   - **Under 80%**: Transaction proceeds normally
   - **80-100%**: Warning shown, user can proceed
   - **Over 100%**: Transaction blocked, upgrade required

4. **Post-Transaction**
   - Usage recorded in database
   - Limit card updates in real-time
   - Receipt sent via email

## Compliance Features

- **Daily Reset**: Limits reset at midnight UTC
- **Audit Trail**: All limit checks logged
- **Regulatory Compliance**: Meets AML/KYC requirements
- **Fraud Prevention**: Prevents large unauthorized transactions
- **Gradual Access**: Users unlock higher limits through verification

## Admin Monitoring

Admins can view:
- User verification levels
- Daily transaction volumes
- Limit breach attempts
- Upgrade conversion rates

## Future Enhancements

- [ ] Monthly limits in addition to daily
- [ ] Per-transaction limits
- [ ] Velocity checks (transactions per hour)
- [ ] Risk-based dynamic limits
- [ ] Temporary limit increases
- [ ] Business account limits

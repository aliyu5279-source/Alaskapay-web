# Wallet Withdrawal System

Complete wallet withdrawal system for AlaskaPay allowing users to withdraw funds from their wallet to linked bank accounts with KYC tier-based limits and fee calculation.

## Features

### 1. Withdrawal Requests
- Withdraw funds to verified bank accounts
- Real-time balance validation
- KYC tier-based daily limits
- Automatic fee calculation
- Processing time estimates
- Status tracking (pending, processing, completed, failed)

### 2. Fee Structure
- Tier 1: ₦50 fixed fee (up to ₦50,000)
- Tier 2: ₦100 fixed fee (up to ₦500,000)
- Tier 3: 0.5% percentage fee (unlimited)

### 3. Bank Integration
- Flutterwave API integration
- Paystack API integration
- Bank account verification
- Automatic provider selection

### 4. UI Components
- WithdrawModal: Withdrawal request form
- WithdrawalHistory: Transaction history with filters
- Real-time status updates
- Export to CSV functionality

## Database Schema

### withdrawal_requests
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- wallet_account_id: UUID (references wallet_accounts)
- bank_account_id: UUID (references linked_bank_accounts)
- amount: DECIMAL(15,2)
- fee: DECIMAL(15,2)
- net_amount: DECIMAL(15,2)
- currency: VARCHAR(3)
- status: VARCHAR(20)
- kyc_tier: INTEGER
- processing_time_estimate: VARCHAR(50)
- reference: VARCHAR(100) UNIQUE
- provider: VARCHAR(20)
- provider_reference: VARCHAR(100)
- failure_reason: TEXT
- metadata: JSONB
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- completed_at: TIMESTAMPTZ
```

### withdrawal_fees
```sql
- id: UUID (primary key)
- tier: INTEGER
- min_amount: DECIMAL(15,2)
- max_amount: DECIMAL(15,2)
- fee_type: VARCHAR(20) (fixed, percentage, tiered)
- fee_value: DECIMAL(10,4)
- currency: VARCHAR(3)
- is_active: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

## Edge Functions

### process-withdrawal (To Be Deployed)
Processes withdrawal requests via Flutterwave/Paystack APIs.

**Endpoint:** `https://[project].supabase.co/functions/v1/process-withdrawal`

**Request:**
```json
{
  "withdrawal_id": "uuid",
  "provider": "flutterwave" | "paystack"
}
```

**Response:**
```json
{
  "success": true,
  "reference": "WD-123456789",
  "provider_reference": "FLW-REF-123",
  "status": "processing",
  "estimated_completion": "2024-01-15T10:00:00Z"
}
```

### verify-withdrawal-eligibility (To Be Deployed)
Checks if user can make withdrawal based on KYC limits.

**Request:**
```json
{
  "user_id": "uuid",
  "amount": 50000
}
```

**Response:**
```json
{
  "eligible": true,
  "daily_limit": 500000,
  "withdrawn_today": 100000,
  "remaining_limit": 400000,
  "kyc_tier": 2
}
```

## Usage

### Initiating a Withdrawal

```typescript
import { WithdrawModal } from '@/components/wallet/WithdrawModal';

function WalletPage() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);

  return (
    <>
      <Button onClick={() => setWithdrawOpen(true)}>
        Withdraw Funds
      </Button>

      <WithdrawModal
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        walletId={walletInfo.id}
        currentBalance={walletInfo.balance}
        currency={walletInfo.currency}
        onSuccess={() => {
          // Refresh wallet balance
        }}
      />
    </>
  );
}
```

### Viewing Withdrawal History

```typescript
import { WithdrawalHistory } from '@/components/wallet/WithdrawalHistory';

function WalletPage() {
  return (
    <WithdrawalHistory />
  );
}
```

## KYC Tier Limits

| Tier | Daily Limit | Fee Structure |
|------|-------------|---------------|
| 1    | ₦50,000     | ₦50 fixed     |
| 2    | ₦500,000    | ₦100 fixed    |
| 3    | Unlimited   | 0.5% of amount|

## Processing Flow

1. **User Initiates Withdrawal**
   - Selects bank account
   - Enters amount
   - System calculates fee
   - Validates against daily limit

2. **Request Created**
   - Status: pending
   - Reference generated
   - Fee deducted from amount

3. **Processing**
   - Edge function triggered
   - API call to Flutterwave/Paystack
   - Status: processing
   - Provider reference saved

4. **Completion**
   - Webhook received from provider
   - Status updated (completed/failed)
   - Email notification sent
   - Wallet balance updated

## Email Notifications

Users receive emails for:
- Withdrawal request received
- Withdrawal processing
- Withdrawal completed
- Withdrawal failed

## Security Features

1. **Row Level Security (RLS)**
   - Users can only view their own withdrawals
   - System-level updates only

2. **Validation**
   - Minimum withdrawal amount
   - Maximum based on KYC tier
   - Daily limit enforcement
   - Bank account verification required

3. **Audit Trail**
   - All withdrawals logged
   - Status changes tracked
   - Failure reasons recorded

## API Integration

### Flutterwave Transfer API
```typescript
const response = await fetch('https://api.flutterwave.com/v3/transfers', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    account_bank: bankCode,
    account_number: accountNumber,
    amount: netAmount,
    currency: 'NGN',
    reference: reference,
    narration: 'AlaskaPay Withdrawal'
  })
});
```

### Paystack Transfer API
```typescript
const response = await fetch('https://api.paystack.co/transfer', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    source: 'balance',
    amount: netAmount * 100, // Kobo
    recipient: recipientCode,
    reference: reference,
    reason: 'AlaskaPay Withdrawal'
  })
});
```

## Error Handling

Common error scenarios:
- Insufficient wallet balance
- Daily limit exceeded
- Unverified bank account
- Provider API failure
- Network timeout

All errors are logged and user-friendly messages displayed.

## Testing

### Test Scenarios
1. Successful withdrawal (Tier 1)
2. Successful withdrawal (Tier 2)
3. Successful withdrawal (Tier 3)
4. Daily limit exceeded
5. Insufficient balance
6. Provider failure
7. Network timeout

### Test Data
```sql
-- Test withdrawal fees
INSERT INTO withdrawal_fees (tier, fee_type, fee_value) VALUES
  (1, 'fixed', 50),
  (2, 'fixed', 100),
  (3, 'percentage', 0.5);
```

## Monitoring

Track these metrics:
- Total withdrawal volume
- Average processing time
- Success rate by provider
- Fee revenue
- Daily active withdrawers
- Tier distribution

## Next Steps

1. Deploy edge functions for withdrawal processing
2. Set up webhook handlers for provider callbacks
3. Configure email templates for notifications
4. Implement retry logic for failed withdrawals
5. Add withdrawal analytics dashboard
6. Set up monitoring and alerts

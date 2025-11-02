# Virtual Card Funding System

## Overview
The Virtual Card Funding System allows AlaskaPay users to instantly add money to their virtual cards from their wallet balance. The system supports one-time and recurring funding with KYC tier validation.

## Features

### 1. Instant Card Funding
- Fund virtual cards directly from wallet balance
- Real-time balance updates
- Minimum funding: ₦100
- Maximum funding: Based on KYC tier limits
- Transaction reference generation

### 2. Recurring Funding
- Set up automatic recurring funding
- Frequency options:
  - Daily
  - Weekly
  - Monthly
- Next funding date calculation
- Automatic processing

### 3. Funding History
- Complete transaction history per card
- Status tracking (completed, pending, failed)
- Recurring funding indicators
- Transaction timestamps
- Balance before/after tracking

### 4. KYC Tier Validation
- Tier 1: Max ₦50,000 per funding
- Tier 2: Max ₦500,000 per funding
- Tier 3: Unlimited funding
- Wallet balance verification
- Transaction limit enforcement

## Database Schema

### virtual_card_funding Table
```sql
CREATE TABLE virtual_card_funding (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  card_id UUID REFERENCES virtual_cards(id),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  funding_source VARCHAR(50) DEFAULT 'wallet',
  transaction_reference VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending',
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency VARCHAR(20),
  next_funding_date TIMESTAMPTZ,
  kyc_tier INTEGER,
  wallet_balance_before DECIMAL(15, 2),
  wallet_balance_after DECIMAL(15, 2),
  card_balance_before DECIMAL(15, 2),
  card_balance_after DECIMAL(15, 2),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Edge Function

### fund-virtual-card
Processes card funding transactions with validation.

**Endpoint:** `POST /functions/v1/fund-virtual-card`

**Request Body:**
```json
{
  "cardId": "uuid",
  "amount": 5000,
  "isRecurring": false,
  "recurringFrequency": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "funding": {
    "id": "uuid",
    "amount": 5000,
    "status": "completed",
    "transaction_reference": "FUND-1234567890-ABC123"
  },
  "newBalance": 15000
}
```

## UI Components

### FundCardModal
Modal dialog for funding virtual cards.

**Features:**
- Amount input with min/max validation
- Wallet balance display
- Recurring funding toggle
- Frequency selector
- Real-time validation
- Loading states

### CardFundingHistory
Displays funding transaction history.

**Features:**
- Transaction list with status badges
- Recurring indicators
- Date/time formatting
- Amount display
- Empty state handling

## Usage Example

```typescript
import { FundCardModal } from '@/components/FundCardModal';
import { CardFundingHistory } from '@/components/CardFundingHistory';

function VirtualCardPage() {
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <>
      <Button onClick={() => setShowFundModal(true)}>
        Fund Card
      </Button>

      <FundCardModal
        isOpen={showFundModal}
        onClose={() => setShowFundModal(false)}
        card={selectedCard}
        onSuccess={() => {
          // Reload cards
        }}
      />

      <CardFundingHistory cardId={selectedCard?.id} />
    </>
  );
}
```

## Validation Rules

### Amount Validation
- Minimum: ₦100
- Maximum: Based on KYC tier
- Must not exceed wallet balance
- Numeric values only

### Recurring Validation
- Frequency required if recurring enabled
- Valid frequencies: daily, weekly, monthly
- Next funding date calculated automatically

### Card Validation
- Card must exist
- Card must be active
- User must own the card

## Security

### Row Level Security (RLS)
- Users can only view their own funding transactions
- Users can only create funding for their own cards
- Admin access for monitoring

### Transaction Integrity
- Unique transaction references
- Balance tracking before/after
- Atomic operations
- Error rollback

## Best Practices

1. **Always validate wallet balance** before processing
2. **Use transaction references** for tracking
3. **Implement retry logic** for failed transactions
4. **Monitor recurring funding** for failures
5. **Log all funding attempts** for audit trail

## Future Enhancements

- [ ] Multiple funding sources (bank, card)
- [ ] Scheduled one-time funding
- [ ] Funding limits per time period
- [ ] Funding notifications
- [ ] Bulk funding operations
- [ ] Funding analytics dashboard

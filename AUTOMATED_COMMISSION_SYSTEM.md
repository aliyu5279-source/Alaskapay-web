# Automated Commission Calculation System

## Overview
Comprehensive commission system that automatically tracks referrals, sales, and transactions, calculating and crediting commissions based on configurable rules and tiers.

## Features

### 1. Commission Rules Engine
- **Multiple Rule Types**: Referral, transaction, sales, revenue share
- **Calculation Methods**: Percentage, fixed amount, tiered rates
- **Conditional Logic**: Min/max amounts, user tiers, transaction types
- **Priority System**: Multiple rules with priority ordering

### 2. Automated Calculation
- **Real-time Processing**: Commissions calculated on transaction completion
- **Batch Processing**: Pending commissions processed via cron job
- **Multi-source Tracking**: Referrals, sales, transactions, custom events

### 3. Balance Management
- **Available Balance**: Ready for withdrawal
- **Pending Balance**: Awaiting confirmation
- **Lifetime Earnings**: Total earned commissions
- **Withdrawal Tracking**: Total withdrawn amounts

### 4. Payout System
- **Multiple Methods**: Bank transfer, wallet, Paystack
- **Request Management**: Submit, track, and process payouts
- **Status Tracking**: Pending, processing, completed, failed

## Database Schema

### commission_rules
```sql
- id: UUID
- name: TEXT
- rule_type: referral|transaction|sales|revenue_share
- calculation_method: percentage|fixed|tiered
- base_rate: DECIMAL
- min_amount: DECIMAL
- max_amount: DECIMAL
- tier_config: JSONB
- conditions: JSONB
- is_active: BOOLEAN
- priority: INTEGER
```

### commission_balances
```sql
- user_id: UUID
- available_balance: DECIMAL
- pending_balance: DECIMAL
- lifetime_earnings: DECIMAL
- total_withdrawn: DECIMAL
- currency: TEXT
- last_credited_at: TIMESTAMPTZ
```

### commission_transactions
```sql
- user_id: UUID
- rule_id: UUID
- transaction_type: credit|debit|pending|reversed
- amount: DECIMAL
- source_type: referral|transaction|sales
- source_id: UUID
- description: TEXT
- metadata: JSONB
- status: pending|completed|reversed|failed
```

## Edge Functions

### calculate-commission
Calculates commission based on rules:
```typescript
await supabase.functions.invoke('calculate-commission', {
  body: {
    sourceType: 'transaction',
    sourceId: 'txn-123',
    userId: 'user-456',
    amount: 10000,
    metadata: { type: 'transfer' }
  }
});
```

### process-pending-commissions
Batch processes pending commissions (run via cron):
```typescript
await supabase.functions.invoke('process-pending-commissions');
```

## Usage

### User Dashboard
```typescript
import { CommissionDashboard } from '@/components/commission/CommissionDashboard';

<CommissionDashboard />
```

### Admin Rules Manager
```typescript
import { CommissionRulesManager } from '@/components/admin/CommissionRulesManager';

<CommissionRulesManager />
```

### Manual Commission Credit
```typescript
const { data, error } = await supabase.functions.invoke('calculate-commission', {
  body: {
    sourceType: 'sales',
    sourceId: 'sale-789',
    userId: user.id,
    amount: 50000
  }
});
```

## Commission Rule Examples

### Tiered Referral Commission
```json
{
  "name": "Tiered Referral Bonus",
  "rule_type": "referral",
  "calculation_method": "tiered",
  "tier_config": [
    { "min": 0, "max": 10000, "rate": 5 },
    { "min": 10000, "max": 50000, "rate": 7.5 },
    { "min": 50000, "rate": 10 }
  ]
}
```

### Fixed Transaction Fee
```json
{
  "name": "Transaction Commission",
  "rule_type": "transaction",
  "calculation_method": "fixed",
  "base_rate": 100,
  "min_amount": 1000
}
```

### Percentage Sales Commission
```json
{
  "name": "Sales Commission",
  "rule_type": "sales",
  "calculation_method": "percentage",
  "base_rate": 3.5,
  "conditions": {
    "user_tier": "premium"
  }
}
```

## Automation Setup

### 1. Create Commission Rules
Navigate to Admin Dashboard → Commission Rules and create rules for your business model.

### 2. Enable Auto-Calculation
The system automatically triggers on revenue_events table inserts.

### 3. Setup Cron Job
Add to Supabase cron jobs:
```sql
SELECT cron.schedule(
  'process-pending-commissions',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/process-pending-commissions',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_KEY"}'::jsonb
  ) AS request_id;
  $$
);
```

## Payout Workflow

1. User views available balance in dashboard
2. User requests payout via "Request Payout" button
3. Request created with status "pending"
4. Admin reviews and processes payout
5. Funds transferred via selected method
6. Balance updated, transaction recorded

## Best Practices

1. **Rule Priority**: Set higher priority for specific rules
2. **Testing**: Test rules with small amounts first
3. **Monitoring**: Review commission transactions regularly
4. **Limits**: Set min/max amounts to prevent abuse
5. **Audit Trail**: All transactions logged with metadata

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only view their own commissions
- Admin-only access to rule management
- Service role key required for calculations
- Payout requests require verification

## Integration Examples

### Track Referral Commission
```typescript
// When user completes referred action
await supabase.from('revenue_events').insert({
  user_id: referrer_id,
  event_type: 'referral',
  amount: transaction_amount,
  metadata: { referred_user: new_user_id }
});
```

### Track Sales Commission
```typescript
// When sale is completed
await supabase.from('revenue_events').insert({
  user_id: agent_id,
  event_type: 'sales',
  amount: sale_amount,
  metadata: { product_id, customer_id }
});
```

## Monitoring & Analytics

View commission metrics:
- Total commissions paid
- Average commission per transaction
- Top earners
- Commission by source type
- Payout request status

Access via Admin Dashboard → Analytics → Commission Reports

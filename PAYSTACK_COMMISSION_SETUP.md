# Alaska Mega Plus Ltd - Automatic Commission Settlement System

## Overview
Automatic commission settlement system that processes bill payment commissions and transfers them to Alaska Mega Plus Ltd's Taj Bank account via Paystack.

## Bank Account Details
- **Company Name**: Alaska Mega Plus Ltd
- **Bank**: Taj Bank
- **Account Number**: 0013010127
- **Bank Code**: 000026

## Commission Rates

### Bill Payment Providers
- Electricity Bills: 2.5%
- Airtime Recharge: 3.0%
- Data Bundles: 3.0%
- Cable TV: 2.0%
- Internet Bills: 2.5%

### Payment Gateway
- Paystack Transactions: 1.5%
- Flutterwave Transactions: 1.5%

### Transfers
- Bank Transfers: 0.5%
- Wallet Transfers: 0.3%

## Automatic Settlement Configuration

### Settings
- **Enabled**: Yes
- **Frequency**: Daily at 11:00 PM
- **Minimum Amount**: ₦1,000
- **Settlement Method**: Paystack Transfer API

### How It Works
1. User completes a bill payment transaction
2. Commission is calculated based on transaction type
3. Commission is credited to user's commission balance
4. Daily at 11 PM, system checks all balances ≥ ₦1,000
5. Automatic transfer initiated to Taj Bank account via Paystack
6. Settlement recorded in database with Paystack reference

## Integration Points

### 1. Bill Payment Processing
When a bill payment is completed, call the commission processor:

```typescript
import { supabase } from '@/lib/supabase';

// After successful bill payment
const { data } = await supabase.functions.invoke('process-bill-commission', {
  body: {
    billType: 'electricity', // or 'airtime', 'data', etc.
    amount: 5000, // Transaction amount in Naira
    userId: user.id,
    transactionId: transaction.id
  }
});
```

### 2. Manual Settlement Trigger
Admins can trigger manual settlement:

```typescript
import { CommissionSettlementService } from '@/services/commissionSettlementService';

// Process all pending settlements
await CommissionSettlementService.processAutoSettlement();
```

### 3. Paystack Transfer Webhook
Handle transfer status updates from Paystack:

```typescript
// In your webhook handler
if (event === 'transfer.success') {
  // Update settlement status
  await supabase.rpc('process_commission_settlement', {
    p_user_id: userId,
    p_amount: amount,
    p_paystack_reference: reference
  });
}
```

## Database Schema

### commission_balances
- `user_id`: User reference
- `available_balance`: Ready for settlement
- `pending_balance`: Awaiting confirmation
- `lifetime_earnings`: Total earned
- `total_withdrawn`: Total settled

### commission_transactions
- Transaction history (credits/debits)
- Source type and transaction reference
- Metadata with rates and calculations

### commission_settlements
- Settlement records
- Paystack transfer codes
- Status tracking (pending/processing/completed/failed)

## Monitoring & Reports

### Dashboard Metrics
- Total commissions earned
- Available balance
- Settlement history
- Growth trends

### Admin Reports
- Daily settlement summaries
- Commission by provider type
- Failed settlement alerts
- Balance thresholds

## Security Features
- Row Level Security (RLS) enabled
- Service role for automated processes
- Encrypted Paystack API keys
- Audit trail for all settlements

## Troubleshooting

### Settlement Failed
1. Check Paystack balance is sufficient
2. Verify Taj Bank account details
3. Review Paystack transfer logs
4. Check network connectivity

### Commission Not Credited
1. Verify bill payment completed successfully
2. Check commission rate configuration
3. Review transaction logs
4. Ensure edge function is deployed

### Balance Discrepancy
1. Run balance reconciliation query
2. Check for pending transactions
3. Review settlement history
4. Verify database triggers

## Testing

### Test Commission Calculation
```typescript
import { CommissionSettlementService } from '@/services/commissionSettlementService';

const commission = CommissionSettlementService.calculateCommission('electricity', 10000);
console.log(commission); // Should be 250 (2.5% of 10,000)
```

### Test Settlement (Staging)
Use Paystack test keys and test bank account in development environment.

## Maintenance

### Daily Tasks
- Monitor settlement success rate
- Check for failed transfers
- Review commission calculations

### Weekly Tasks
- Reconcile balances with Paystack
- Generate commission reports
- Update rate configurations if needed

### Monthly Tasks
- Audit settlement records
- Review commission rates
- Optimize settlement thresholds

## Support
For issues or questions, contact the development team or review logs in Supabase dashboard.

# Instant Bank Transfer Implementation Guide

## Overview
AlaskaPay now supports instant bank transfers from linked Nigerian bank accounts using Paystack's charge authorization API. Users can fund their wallets directly from their bank accounts with real-time processing.

## Features Implemented

### 1. Bank Transfer Service (`src/services/bankTransferService.ts`)
- **Initiate Transfer**: Start bank transfer charge using Paystack API
- **OTP Authorization**: Handle OTP submission for secure transfers
- **Transfer Verification**: Verify payment status and update records
- **Automatic Wallet Credit**: Credit user wallet upon successful transfer

### 2. Bank Transfer Flow Component (`src/components/wallet/BankTransferFlow.tsx`)
Complete transfer flow with multiple steps:
- **Confirm**: Review transfer details before initiating
- **OTP**: Enter OTP code sent by bank
- **Processing**: Real-time transfer processing status
- **Success/Error**: Clear feedback on transfer outcome

### 3. Enhanced Bank Transfer Modal
Updated modal with full transfer workflow:
- Select linked bank account
- Enter transfer amount (minimum ₦100)
- Complete authorization flow
- Automatic wallet crediting

## Transfer Flow

```
1. User selects linked bank account
   ↓
2. User enters amount to transfer
   ↓
3. System initiates Paystack charge
   ↓
4. Bank sends OTP to user (if required)
   ↓
5. User enters OTP
   ↓
6. System verifies transfer
   ↓
7. Wallet automatically credited
   ↓
8. Transaction recorded in database
```

## API Integration

### Paystack Charge Authorization
```typescript
POST https://api.paystack.co/transaction/charge_authorization
{
  "authorization_code": "AUTH_xxx",
  "email": "user@email.com",
  "amount": 50000, // in kobo
  "currency": "NGN",
  "metadata": {
    "user_id": "uuid",
    "purpose": "wallet_funding"
  }
}
```

### OTP Submission
```typescript
POST https://api.paystack.co/transaction/submit_otp
{
  "reference": "TRX_xxx",
  "otp": "123456"
}
```

### Transfer Verification
```typescript
GET https://api.paystack.co/transaction/verify/:reference
```

## Database Schema

### bank_transfers Table
```sql
CREATE TABLE bank_transfers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  bank_account_id UUID REFERENCES linked_bank_accounts(id),
  amount DECIMAL(15,2),
  currency VARCHAR(3),
  status VARCHAR(20),
  reference VARCHAR(100) UNIQUE,
  paystack_response JSONB,
  verified_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Status Flow

1. **pending**: Transfer initiated, awaiting authorization
2. **send_otp**: OTP sent to user
3. **processing**: Transfer being processed
4. **success**: Transfer completed, wallet credited
5. **failed**: Transfer failed

## Security Features

- Authorization codes stored securely
- OTP verification for sensitive transfers
- Transaction reference tracking
- Automatic fraud detection
- Failed attempt logging

## User Experience

### Instant Feedback
- Real-time status updates
- Clear error messages
- Success confirmation
- Transaction receipts

### Minimum Requirements
- Verified bank account
- Minimum transfer: ₦100
- Valid OTP (when required)
- Sufficient bank balance

## Testing

### Test Scenarios
1. Successful transfer without OTP
2. Transfer requiring OTP authorization
3. Invalid OTP handling
4. Insufficient funds error
5. Network timeout handling
6. Wallet crediting verification

### Test Bank Accounts (Paystack Test Mode)
```
Account Number: 0123456789
Bank Code: 058 (GTBank)
OTP: 123456
```

## Error Handling

### Common Errors
- `INVALID_AUTHORIZATION`: Authorization code expired
- `INSUFFICIENT_FUNDS`: Insufficient bank balance
- `INVALID_OTP`: Wrong OTP entered
- `TIMEOUT`: Transaction timeout
- `NETWORK_ERROR`: Connection issues

### Error Recovery
- Retry mechanism for network errors
- Clear error messages for user action
- Automatic status checking
- Transaction rollback on failure

## Monitoring

### Key Metrics
- Transfer success rate
- Average processing time
- OTP submission rate
- Failed transfer reasons
- Daily transfer volume

### Alerts
- High failure rate
- Unusual transfer patterns
- System errors
- API downtime

## Next Steps

1. **Add Transfer Limits**: Implement daily/monthly limits
2. **Scheduled Transfers**: Allow recurring transfers
3. **Multiple Currencies**: Support USD, EUR transfers
4. **Instant Refunds**: Automatic refund on failure
5. **Transfer History**: Detailed transaction history
6. **Analytics Dashboard**: Transfer insights for users

## Support

For issues or questions:
- Check transaction status in wallet history
- Contact support with transaction reference
- Review error messages for guidance
- Check bank account balance

## API Keys Required

- `PAYSTACK_SECRET_KEY`: For charge authorization
- `PAYSTACK_PUBLIC_KEY`: For frontend initialization
- `SUPABASE_URL`: Database connection
- `SUPABASE_SERVICE_ROLE_KEY`: Admin operations

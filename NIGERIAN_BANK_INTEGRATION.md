# Nigerian Bank Integration System

## Overview
Complete Nigerian banking integration for AlaskaPay with bank account verification, linking, and inter-bank transfers using Paystack and NIBSS.


## Features

### 1. Nigerian Banks Database
- **Table**: `nigerian_banks`
- Pre-populated with 22+ Nigerian banks including:
  - Access Bank, GTBank, First Bank, UBA, Zenith Bank
  - Fidelity, Ecobank, Diamond, Sterling, Stanbic IBTC
  - Union Bank, Wema, Unity, Keystone, Polaris
  - Digital banks: Kuda, ALAT, Opay, PalmPay, Moniepoint
- Bank codes and NIBSS codes for all banks
- Active/inactive status management

### 2. Bank Account Verification
- **Edge Function**: `verify-bank-account`
- Uses Paystack Account Verification API
- Validates account number and bank code
- Returns verified account name
- Real-time verification in seconds

### 3. Bank Account Linking
- **Edge Function**: `link-bank-account`
- **Table**: `linked_bank_accounts`
- Link multiple bank accounts to user profile
- Set primary account
- Verified status tracking
- Last used timestamp

### 4. Inter-Bank Transfers
- **Edge Function**: `initiate-bank-transfer`
- **Table**: `bank_transfers`
- Transfer to any Nigerian bank account
- NIBSS integration via Paystack
- Transfer tracking and status
- Reference number generation
- Failure reason logging

## Admin Features

### Bank Management Dashboard
- **Location**: Admin Panel → Bank Management
- Add/edit/delete Nigerian banks
- Manage bank codes and NIBSS codes
- Enable/disable banks
- Configure transfer support
- Configure verification support

## User Features

### Bank Account Linking
- Select bank from dropdown
- Enter 10-digit account number
- Verify account (returns account name)
- Link verified account to profile
- Set as primary account
- View all linked accounts

### Bank Transfers
- Select destination bank
- Enter account number
- Verify recipient
- Enter amount and narration
- Initiate transfer
- Track transfer status

## Database Schema

### nigerian_banks
```sql
- id (UUID)
- bank_name (TEXT)
- bank_code (TEXT, UNIQUE)
- nibss_code (TEXT)
- is_active (BOOLEAN)
- supports_transfers (BOOLEAN)
- supports_verification (BOOLEAN)
```

### linked_bank_accounts
```sql
- id (UUID)
- user_id (UUID, FK)
- bank_id (UUID, FK)
- account_number (TEXT)
- account_name (TEXT)
- is_verified (BOOLEAN)
- is_primary (BOOLEAN)
- verification_date (TIMESTAMPTZ)
```

### bank_transfers
```sql
- id (UUID)
- user_id (UUID, FK)
- destination_bank_id (UUID, FK)
- destination_account_number (TEXT)
- destination_account_name (TEXT)
- amount (DECIMAL)
- reference_number (TEXT, UNIQUE)
- status (TEXT: pending/processing/completed/failed)
- nibss_session_id (TEXT)
```

## API Integration

### Paystack Account Verification
```javascript
GET https://api.paystack.co/bank/resolve
  ?account_number={number}&bank_code={code}
Authorization: Bearer {PAYSTACK_SECRET_KEY}
```

### Paystack Transfer
```javascript
POST https://api.paystack.co/transfer
{
  "source": "balance",
  "amount": 10000,
  "recipient": "0123456789",
  "reason": "Transfer",
  "reference": "TRF-123456"
}
```

## Setup Requirements

1. **Paystack Account**
   - Sign up at https://paystack.com
   - Get API keys from Settings → API Keys & Webhooks
   - Add secret key to Supabase secrets

2. **Environment Variable**
   ```
   PAYSTACK_SECRET_KEY=sk_live_xxxxx
   ```

3. **Webhook Setup** (Optional)
   - Configure webhook URL for transfer status updates
   - Handle events: transfer.success, transfer.failed

## Usage Examples

### Verify Bank Account
```typescript
const { data } = await supabase.functions.invoke('verify-bank-account', {
  body: { 
    accountNumber: '0123456789',
    bankCode: '058' // GTBank
  }
});
// Returns: { accountName: "John Doe" }
```

### Link Bank Account
```typescript
const { data } = await supabase.functions.invoke('link-bank-account', {
  body: {
    bankId: 'uuid-of-bank',
    accountNumber: '0123456789',
    accountName: 'John Doe',
    isPrimary: true
  }
});
```

### Initiate Transfer
```typescript
const { data } = await supabase.functions.invoke('initiate-bank-transfer', {
  body: {
    destinationBankId: 'uuid-of-bank',
    accountNumber: '9876543210',
    accountName: 'Jane Smith',
    amount: 5000,
    narration: 'Payment for services'
  }
});
```

## Security Features

- User authentication required for all operations
- Bank account ownership verification
- Transfer limits based on KYC tier
- Fraud detection integration
- Audit logging for all transfers
- Encrypted account information

## Next Steps

1. Add transfer limits based on user KYC level
2. Implement transfer fees calculation
3. Add scheduled/recurring transfers
4. Build transfer history dashboard
5. Add beneficiary management
6. Implement transfer reversals
7. Add bulk transfer support

# AlaskaPay Wallet Management System

## Overview
Comprehensive wallet management system with multi-currency support, instant top-ups, wallet-to-wallet transfers, and real-time balance tracking.

## Features

### 1. Wallet Accounts
- Multi-currency support (NGN, USD, EUR, etc.)
- Primary and secondary wallets
- Available, pending, and total balance tracking
- Low balance threshold alerts
- Wallet status management (active, frozen, closed)

### 2. Top-Up Methods
- **Card Payment**: Debit/Credit card via Flutterwave/Paystack
- **Bank Transfer**: Direct bank transfer with virtual account
- **USSD**: Mobile banking USSD codes
- Quick amount selection (₦1,000 - ₦50,000)
- Real-time balance updates

### 3. Wallet-to-Wallet Transfers
- Transfer to any AlaskaPay user by email
- Instant transfers with real-time updates
- Transaction descriptions
- Transfer history tracking
- Recipient auto-creation

### 4. Transaction Management
- Complete transaction history
- Filter by type (top-up, transfer, bill payment)
- Export to CSV
- Real-time status updates
- Transaction references for tracking

### 5. Real-Time Features
- Live balance updates via Supabase Realtime
- Instant transaction notifications
- Low balance alerts
- Automatic wallet creation on first transaction

## Database Schema

### wallet_accounts
```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- currency_code (VARCHAR, default 'NGN')
- balance (DECIMAL)
- available_balance (DECIMAL)
- pending_balance (DECIMAL)
- low_balance_threshold (DECIMAL)
- is_primary (BOOLEAN)
- status (VARCHAR: active, frozen, closed)
- created_at, updated_at
```

### wallet_transactions
```sql
- id (UUID, PK)
- wallet_id (UUID, FK)
- user_id (UUID, FK)
- transaction_type (VARCHAR: topup, withdrawal, transfer_in, transfer_out, etc.)
- amount (DECIMAL)
- currency_code (VARCHAR)
- balance_before, balance_after (DECIMAL)
- reference (VARCHAR, unique)
- description (TEXT)
- recipient_id, recipient_wallet_id (UUID, nullable)
- payment_method (VARCHAR: bank_transfer, card, ussd, wallet)
- payment_reference (VARCHAR)
- status (VARCHAR: pending, completed, failed, reversed)
- metadata (JSONB)
- created_at, completed_at
```

### wallet_alerts
```sql
- id (UUID, PK)
- wallet_id (UUID, FK)
- user_id (UUID, FK)
- alert_type (VARCHAR: low_balance, large_transaction, suspicious_activity)
- threshold_amount, current_balance (DECIMAL)
- transaction_id (UUID, nullable)
- message (TEXT)
- is_read (BOOLEAN)
- created_at
```

## Edge Functions

### wallet-topup
Process wallet top-up via various payment methods.

**Request:**
```json
{
  "amount": 10000,
  "currency": "NGN",
  "payment_method": "card",
  "payment_reference": "PAY-123",
  "metadata": {}
}
```

**Response:**
```json
{
  "success": true,
  "transaction": { ... },
  "wallet_balance": 10000
}
```

### wallet-transfer
Transfer funds between AlaskaPay users.

**Request:**
```json
{
  "recipient_email": "user@example.com",
  "amount": 5000,
  "currency": "NGN",
  "description": "Payment for services"
}
```

**Response:**
```json
{
  "success": true,
  "reference": "TRF-123",
  "new_balance": 5000
}
```

## UI Components

### WalletBalanceCard
- Displays available balance with show/hide toggle
- Gradient background design
- Quick action buttons (Top Up, Transfer)
- Real-time balance refresh
- Currency display

### TopUpModal
- Amount input with quick selection buttons
- Payment method selection (Card, Bank, USSD)
- Form validation
- Loading states

### TransferModal
- Recipient email input
- Amount and description fields
- Transfer confirmation
- Error handling

### WalletTransactionList
- Transaction history with icons
- Filter by transaction type
- Export to CSV functionality
- Status badges
- Formatted dates and amounts

### WalletDashboard
- Main wallet interface
- Balance card
- Quick actions grid
- Transaction list
- Integrated modals

## Integration

### In Dashboard
```tsx
import { WalletDashboard } from './WalletDashboard';

<Tabs>
  <TabsTrigger value="wallet">Wallet</TabsTrigger>
  <TabsContent value="wallet">
    <WalletDashboard />
  </TabsContent>
</Tabs>
```

### Real-Time Subscription
```typescript
const channel = supabase
  .channel('wallet-balance')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'wallet_accounts',
    filter: `user_id=eq.${user.id}`
  }, () => {
    fetchBalance();
  })
  .subscribe();
```

## Security Features
- Row Level Security (RLS) on all tables
- User can only access their own wallets and transactions
- Transaction references for audit trail
- Balance validation before transfers
- Payment method verification

## Future Enhancements
- Recurring top-ups
- Scheduled transfers
- Multi-currency conversion
- Wallet-to-bank withdrawals
- Transaction dispute resolution
- Spending analytics
- Budget management
- Savings goals

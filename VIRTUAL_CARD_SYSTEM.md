# Virtual Card Generation System

AlaskaPay's virtual card system allows users to create and manage virtual debit cards for secure online transactions.

## Features

### Card Generation
- Instant virtual card creation using Flutterwave API
- Support for Visa and Mastercard
- Customizable card designs (4 themes)
- Configurable spending limits (daily and monthly)
- Billing address management

### Card Management
- **Freeze/Unfreeze**: Temporarily disable cards
- **Spending Limits**: Set daily and monthly limits
- **Card Termination**: Permanently disable cards
- **Multiple Cards**: Create and manage multiple virtual cards

### Card Display
- Beautiful 3D flip animation
- Front: Card number, expiry date, cardholder name
- Back: CVV with copy-to-clipboard
- Show/hide sensitive details toggle
- Card design customization

## Database Schema

### virtual_cards Table
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- card_name: VARCHAR(100) - Custom name for the card
- card_type: VARCHAR(20) - visa or mastercard
- card_number: VARCHAR(19) - Full card number
- cvv: VARCHAR(4) - Card CVV
- expiry_month: VARCHAR(2)
- expiry_year: VARCHAR(4)
- card_design: VARCHAR(50) - Design theme
- status: VARCHAR(20) - active, frozen, blocked, expired
- spending_limit_daily: DECIMAL(15,2)
- spending_limit_monthly: DECIMAL(15,2)
- current_daily_spend: DECIMAL(15,2)
- current_monthly_spend: DECIMAL(15,2)
- provider: VARCHAR(20) - flutterwave or paystack
- provider_card_id: VARCHAR(100)
- billing_address: JSONB
```

### virtual_card_transactions Table
```sql
- id: UUID (primary key)
- card_id: UUID (foreign key)
- user_id: UUID (foreign key)
- transaction_ref: VARCHAR(100)
- amount: DECIMAL(15,2)
- currency: VARCHAR(3)
- merchant_name: VARCHAR(200)
- transaction_type: VARCHAR(20)
- status: VARCHAR(20)
- metadata: JSONB
```

## Edge Functions

### create-virtual-card
Creates a new virtual card using Flutterwave API.

**Request Body:**
```json
{
  "cardName": "Shopping Card",
  "cardType": "visa",
  "cardDesign": "gradient-blue",
  "spendingLimitDaily": 50000,
  "spendingLimitMonthly": 500000,
  "billingAddress": {
    "address": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "postalCode": "100001"
  }
}
```

### manage-virtual-card
Manages card operations (freeze, unfreeze, update limits, terminate).

**Request Body:**
```json
{
  "cardId": "uuid",
  "action": "freeze|unfreeze|update_limits|terminate",
  "spendingLimitDaily": 100000,
  "spendingLimitMonthly": 1000000
}
```

## UI Components

### VirtualCardDisplay
- 3D flip animation card display
- Show/hide sensitive details
- Copy card details to clipboard
- Responsive design

### VirtualCardManager
- List all user's virtual cards
- Create new cards
- Manage existing cards (freeze/unfreeze)
- View spending limits and usage
- Delete/terminate cards

### CreateVirtualCardModal
- Form to create new virtual cards
- Card type selection (Visa/Mastercard)
- Design theme picker
- Spending limit configuration
- Billing address input

## Card Designs

1. **Default Blue**: Blue gradient (from-blue-600 to-blue-800)
2. **Cyan Gradient**: Cyan to blue (from-cyan-500 to-blue-600)
3. **Purple Gradient**: Purple to pink (from-purple-600 to-pink-600)
4. **Black Gold**: Dark theme (from-gray-900 to-gray-700)

## Usage in Dashboard

The virtual card system is integrated into the main dashboard:

```tsx
<Tabs defaultValue="transactions">
  <TabsList>
    <TabsTrigger value="transactions">Transactions</TabsTrigger>
    <TabsTrigger value="cards">Virtual Cards</TabsTrigger>
    <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
  </TabsList>
  <TabsContent value="cards">
    <VirtualCardManager />
  </TabsContent>
</Tabs>
```

## Security Features

- Encrypted card details storage
- Row Level Security (RLS) policies
- User can only access their own cards
- Secure API communication with Flutterwave
- Spending limit enforcement
- Card freeze capability for suspicious activity

## Flutterwave Integration

The system uses Flutterwave's Virtual Card API:
- Create virtual cards
- Block/unblock cards
- Terminate cards
- Track card transactions

API Key: Uses `FLUTTERWAVE_SECRET_KEY` environment variable

## Future Enhancements

- Card transaction history view
- Real-time transaction notifications
- Card usage analytics
- Recurring payment management
- Multi-currency support
- Card-to-card transfers

# Multi-Currency Support System

## Overview
Alaska Pay now supports multiple currencies for bill payments and transactions, with real-time currency conversion and exchange rate management.

## Database Schema

### Currencies Table
Stores supported currencies:
- `code`: 3-letter currency code (USD, EUR, GBP, etc.)
- `name`: Full currency name
- `symbol`: Currency symbol ($, €, £, etc.)
- `decimal_places`: Number of decimal places (default: 2)
- `is_active`: Whether currency is currently available
- `is_default`: Default currency (USD)

### Exchange Rates Table
Stores conversion rates between currencies:
- `from_currency`: Source currency code
- `to_currency`: Target currency code
- `rate`: Exchange rate value
- `source`: Rate source (manual, API, etc.)
- `valid_from`: Rate validity start date
- `valid_until`: Rate validity end date (optional)

### Updated Bill Payments
- `currency`: Currency code for payment
- `exchange_rate`: Rate used for conversion
- `amount_usd`: Converted amount in USD

## Edge Functions

### get-exchange-rate
Gets current exchange rate between two currencies.

**Request:**
```json
{
  "from": "EUR",
  "to": "USD"
}
```

**Response:**
```json
{
  "rate": 1.09,
  "from": "EUR",
  "to": "USD"
}
```

### convert-currency
Converts an amount between currencies.

**Request:**
```json
{
  "amount": 100,
  "from": "EUR",
  "to": "USD"
}
```

**Response:**
```json
{
  "amount": 100,
  "convertedAmount": 109.00,
  "rate": 1.09,
  "from": "EUR",
  "to": "USD"
}
```

## Components

### CurrencySelector
Dropdown component for selecting currency.

**Usage:**
```jsx
<CurrencySelector 
  value={currency} 
  onChange={setCurrency} 
/>
```

### CurrencyDisplay
Formats and displays currency amounts.

**Usage:**
```jsx
<CurrencyDisplay 
  amount={100.50} 
  currency="EUR" 
  showCode={true}
/>
```

## User Features

### Bill Payment with Currency Selection
1. User selects currency from dropdown
2. Enters amount in selected currency
3. System shows real-time conversion to USD
4. Displays exchange rate used
5. Payment processed with currency info stored

### Payment History
- Shows original currency and amount
- Displays USD equivalent
- Shows exchange rate used

## Admin Features

### Currency Management
- View all supported currencies
- Enable/disable currencies
- Set default currency
- View currency symbols and codes

### Exchange Rate Management
- View current exchange rates
- Update rates manually
- Set rate validity periods
- Track rate history

## Supported Currencies

Default currencies included:
- USD (US Dollar) - Default
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- JPY (Japanese Yen)
- CNY (Chinese Yuan)
- INR (Indian Rupee)
- NGN (Nigerian Naira)
- KES (Kenyan Shilling)

## Integration

### In Payment Forms
```javascript
const [currency, setCurrency] = useState('USD');
const [amount, setAmount] = useState('');
const [convertedAmount, setConvertedAmount] = useState(0);

// Convert when amount or currency changes
useEffect(() => {
  if (amount && currency !== 'USD') {
    convertCurrency();
  }
}, [amount, currency]);

const convertCurrency = async () => {
  const { data } = await supabase.functions.invoke('convert-currency', {
    body: { amount: parseFloat(amount), from: currency, to: 'USD' }
  });
  setConvertedAmount(data.convertedAmount);
};
```

### In Payment Processing
```javascript
await supabase.functions.invoke('process-bill-payment', {
  body: {
    amount: parseFloat(amount),
    currency,
    exchangeRate,
    amountUsd: convertedAmount,
    // ... other fields
  }
});
```

## Best Practices

1. **Always store USD equivalent**: All payments store both original currency and USD amount
2. **Track exchange rates**: Store the rate used for each transaction
3. **Validate conversions**: Ensure converted amounts are accurate
4. **Update rates regularly**: Keep exchange rates current
5. **Handle rate changes**: Use rate valid from transaction time

## Future Enhancements

- Automatic rate updates from external APIs
- Multi-currency wallet balances
- Currency preference per user
- Historical rate charts
- Rate alerts for admins
- Bulk rate updates

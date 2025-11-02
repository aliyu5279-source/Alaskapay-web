# Payment Gateway Integration Guide

This guide covers the complete setup of Paystack and Flutterwave payment gateways for AlaskaPay.

## Features Implemented

✅ Paystack payment initialization
✅ Flutterwave payment initialization  
✅ Payment gateway selection UI
✅ Automatic wallet top-up flow
✅ Transaction tracking
✅ Webhook handling (manual setup required)

## Environment Variables

Add these to your `.env` file:

```env
# Paystack (already configured)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx

# Flutterwave
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxx
```

## Webhook Setup

### Paystack Webhook

1. Go to https://dashboard.paystack.co/#/settings/developer
2. Add webhook URL: `https://your-domain.com/api/webhooks/paystack`
3. Create edge function or API route:

```typescript
// Handle Paystack webhook
const crypto = require('crypto');

export async function POST(req: Request) {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    const event = req.body;
    
    if (event.event === 'charge.success') {
      const { reference, amount, metadata } = event.data;
      
      // Update transaction and credit wallet
      await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          amount: amount / 100 
        })
        .eq('reference', reference);
      
      // Credit user wallet
      await supabase.rpc('credit_wallet', {
        p_user_id: metadata.userId,
        p_amount: amount / 100
      });
    }
  }
  
  return new Response('OK', { status: 200 });
}
```

### Flutterwave Webhook

1. Go to https://dashboard.flutterwave.com/dashboard/settings/webhooks
2. Add webhook URL: `https://your-domain.com/api/webhooks/flutterwave`
3. Create handler:

```typescript
// Handle Flutterwave webhook
export async function POST(req: Request) {
  const signature = req.headers['verif-hash'];
  
  if (signature === process.env.FLUTTERWAVE_SECRET_HASH) {
    const event = req.body;
    
    if (event.event === 'charge.completed' && event.data.status === 'successful') {
      const { tx_ref, amount, meta } = event.data;
      
      // Update transaction
      await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          amount 
        })
        .eq('reference', tx_ref);
      
      // Credit wallet
      await supabase.rpc('credit_wallet', {
        p_user_id: meta.userId,
        p_amount: amount
      });
    }
  }
  
  return new Response('OK', { status: 200 });
}
```

## Payment Flow

1. **User initiates top-up**: Opens TopUpModal and enters amount
2. **Gateway selection**: User chooses Paystack or Flutterwave
3. **Payment initialization**: System creates payment link
4. **Redirect**: User redirected to payment page
5. **Payment completion**: User completes payment
6. **Webhook notification**: Gateway sends webhook to your server
7. **Wallet credit**: System automatically credits user wallet
8. **Confirmation**: User sees updated balance

## Testing

### Test Cards

**Paystack:**
- Success: 4084084084084081
- Decline: 5060666666666666666

**Flutterwave:**
- Success: 5531886652142950
- PIN: 3310
- OTP: 12345

## Database Functions

The following functions handle wallet operations:

```sql
-- Credit wallet function
CREATE OR REPLACE FUNCTION credit_wallet(
  p_user_id UUID,
  p_amount DECIMAL
) RETURNS void AS $$
BEGIN
  UPDATE wallets
  SET balance = balance + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Get wallet balance
CREATE OR REPLACE FUNCTION get_wallet_balance(
  p_user_id UUID
) RETURNS DECIMAL AS $$
DECLARE
  v_balance DECIMAL;
BEGIN
  SELECT balance INTO v_balance
  FROM wallets
  WHERE user_id = p_user_id;
  
  RETURN COALESCE(v_balance, 0);
END;
$$ LANGUAGE plpgsql;
```

## Security Considerations

1. **Always verify webhook signatures**
2. **Use HTTPS for all webhook endpoints**
3. **Store API keys securely in environment variables**
4. **Validate payment amounts match user requests**
5. **Implement idempotency to prevent double-crediting**
6. **Log all payment transactions for audit trail**

## Monitoring

Track these metrics:
- Payment success rate
- Average payment time
- Failed payment reasons
- Gateway uptime
- Transaction volumes

## Support

- Paystack: support@paystack.com
- Flutterwave: developers@flutterwavego.com

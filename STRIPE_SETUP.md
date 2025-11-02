# Stripe Integration Setup Guide

## 1. Get Your Stripe API Keys

### Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete email verification

### Get API Keys
1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`) - Keep this secure!

### Add Keys to Your Project
1. Copy `.env.example` to `.env`
2. Add your Stripe publishable key:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

## 2. Database Setup

Add these tables to your Supabase database:

```sql
-- Payment Methods Table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL,
  type TEXT DEFAULT 'card',
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Transactions Table
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  payment_method_id UUID REFERENCES payment_methods(id),
  stripe_payment_intent_id TEXT,
  description TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own payment methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods" ON payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods" ON payment_methods
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON payment_transactions
  FOR SELECT USING (auth.uid() = user_id);
```

## 3. Webhook Setup (For Production)

### Create Webhook Endpoint
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_method.attached`
   - `payment_method.detached`

### Webhook Handler Example (Backend)
```typescript
// api/webhooks/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update transaction status in database
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

## 4. Test Mode

The app includes a **Test Mode** toggle:
- **ON**: Uses test API keys (pk_test_*, sk_test_*)
- **OFF**: Uses live API keys (pk_live_*, sk_live_*)

### Test Cards
Use these cards in test mode:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Any future date for expiry, any 3-digit CVC.

## 5. Security Best Practices

✅ Never expose secret keys in frontend code
✅ Always use HTTPS in production
✅ Validate webhook signatures
✅ Enable Row Level Security in Supabase
✅ Store sensitive data encrypted
✅ Implement rate limiting on payment endpoints

## 6. Going Live

1. Complete Stripe account verification
2. Switch to live API keys
3. Test with real cards in small amounts
4. Set up production webhooks
5. Monitor Stripe Dashboard for issues

## Support

- Stripe Docs: https://stripe.com/docs
- Supabase Docs: https://supabase.com/docs
- Alaska Pay Support: support@alaskapay.com

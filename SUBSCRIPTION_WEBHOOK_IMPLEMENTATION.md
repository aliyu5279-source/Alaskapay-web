# Paystack Subscription Webhook Implementation

## Overview
Handle Paystack subscription events for automatic subscription management.

## Webhook Events

### subscription.create
Triggered when a subscription is created in Paystack
```json
{
  "event": "subscription.create",
  "data": {
    "customer": { "email": "user@example.com" },
    "plan": { "plan_code": "PLN_xxx" },
    "subscription_code": "SUB_xxx",
    "email_token": "xxx",
    "amount": 50000,
    "status": "active"
  }
}
```

### subscription.disable
Triggered when subscription is canceled
```json
{
  "event": "subscription.disable",
  "data": {
    "subscription_code": "SUB_xxx",
    "status": "cancelled"
  }
}
```

### invoice.create
Triggered when subscription invoice is generated
```json
{
  "event": "invoice.create",
  "data": {
    "subscription_code": "SUB_xxx",
    "amount": 50000,
    "period_start": "2025-01-01",
    "period_end": "2025-02-01"
  }
}
```

### invoice.payment_failed
Triggered when subscription payment fails
```json
{
  "event": "invoice.payment_failed",
  "data": {
    "subscription_code": "SUB_xxx",
    "amount": 50000,
    "attempt_count": 1
  }
}
```

## Implementation

Add to `supabase/functions/paystack-webhook/index.ts`:

```typescript
// Handle subscription events
if (event === 'subscription.create') {
  await handleSubscriptionCreate(data);
} else if (event === 'subscription.disable') {
  await handleSubscriptionDisable(data);
} else if (event === 'invoice.payment_failed') {
  await handleInvoicePaymentFailed(data);
}

async function handleSubscriptionCreate(data: any) {
  // Update subscription with Paystack code
  await supabase
    .from('subscriptions')
    .update({ 
      paystack_subscription_code: data.subscription_code,
      status: 'active'
    })
    .eq('user_id', data.customer.email);
}

async function handleSubscriptionDisable(data: any) {
  // Mark subscription as canceled
  await supabase
    .from('subscriptions')
    .update({ 
      status: 'canceled',
      canceled_at: new Date().toISOString()
    })
    .eq('paystack_subscription_code', data.subscription_code);
}

async function handleInvoicePaymentFailed(data: any) {
  // Create dunning record
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('paystack_subscription_code', data.subscription_code)
    .single();

  if (sub) {
    await supabase.from('dunning_management').insert({
      subscription_id: sub.id,
      status: 'pending',
      attempt_count: data.attempt_count || 0,
      next_retry_at: new Date(Date.now() + 3 * 86400000).toISOString()
    });
  }
}
```

## Setup

1. Configure webhook URL in Paystack dashboard:
   `https://your-project.supabase.co/functions/v1/paystack-webhook`

2. Select events:
   - subscription.create
   - subscription.disable
   - invoice.create
   - invoice.payment_failed

3. Test webhook with Paystack test mode

4. Monitor webhook delivery logs in Paystack dashboard

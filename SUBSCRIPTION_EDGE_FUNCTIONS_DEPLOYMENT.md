# Subscription Edge Functions Deployment Guide

## Overview
This guide covers deploying the subscription billing edge functions for Alaska Pay.

## Edge Functions Created

### 1. create-subscription
**Location**: `supabase/functions/create-subscription/index.ts`
**Purpose**: Create new subscriptions with trial handling and initial payment processing

**Features**:
- Trial period handling
- Multiple billing cycle support (daily, weekly, monthly, yearly)
- Initial payment processing for non-trial subscriptions
- Stripe and Paystack integration
- Automatic next billing date calculation

**Usage**:
```javascript
const { data, error } = await supabase.functions.invoke('create-subscription', {
  body: {
    userId: 'user-uuid',
    planId: 'plan-uuid',
    paymentMethodId: 'pm_xxx',
    trialDays: 14 // Optional override
  }
});
```

### 2. process-recurring-payment
**Location**: `supabase/functions/process-recurring-payment/index.ts`
**Purpose**: Process recurring subscription payments automatically

**Features**:
- Automated billing cycle processing
- Stripe and Paystack payment processing
- Invoice generation
- Dunning management for failed payments
- Subscription period updates

**Usage**:
```javascript
const { data, error } = await supabase.functions.invoke('process-recurring-payment', {
  body: { subscriptionId: 'sub-uuid' }
});
```

**Cron Schedule**: Set up to run daily at 2 AM UTC
```sql
SELECT cron.schedule(
  'process-recurring-payments',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/process-recurring-payment',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) AS request_id;
  $$
);
```

### 3. handle-subscription-upgrade
**Location**: `supabase/functions/handle-subscription-upgrade/index.ts`
**Purpose**: Handle subscription plan changes with proration

**Features**:
- Automatic proration calculation
- Upgrade immediate payment processing
- Downgrade credit application
- Proration invoice generation
- Seamless plan transition

**Proration Formula**:
```
Unused Credit = Current Plan Price × (Remaining Days / Total Days)
Proration Charge = New Plan Price - Unused Credit
```

**Usage**:
```javascript
const { data, error } = await supabase.functions.invoke('handle-subscription-upgrade', {
  body: {
    subscriptionId: 'sub-uuid',
    newPlanId: 'new-plan-uuid'
  }
});
```

### 4. process-dunning-retry
**Location**: `supabase/functions/process-dunning-retry/index.ts`
**Purpose**: Retry failed subscription payments with dunning management

**Features**:
- Automatic retry scheduling (Day 3, 7, 14, 21)
- Email notifications for failed attempts
- Automatic subscription cancellation after max attempts
- Dunning status tracking

**Retry Schedule**:
- Attempt 1: 3 days after failure
- Attempt 2: 7 days after failure
- Attempt 3: 14 days after failure
- Attempt 4: 21 days after failure
- After 4 attempts: Cancel subscription

**Usage**:
```javascript
const { data, error } = await supabase.functions.invoke('process-dunning-retry', {
  body: {}
});
```

**Cron Schedule**: Set up to run daily at 3 AM UTC
```sql
SELECT cron.schedule(
  'process-dunning-retries',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/process-dunning-retry',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) AS request_id;
  $$
);
```

## Deployment Instructions

### Step 1: Deploy Functions
```bash
# Deploy all subscription functions
supabase functions deploy create-subscription
supabase functions deploy process-recurring-payment
supabase functions deploy handle-subscription-upgrade
supabase functions deploy process-dunning-retry
```

### Step 2: Set Up Cron Jobs
Run the SQL commands above in your Supabase SQL Editor to schedule automated payment processing and dunning retries.

### Step 3: Configure Webhooks
Set up webhooks from Stripe/Paystack to handle real-time payment events:

**Stripe Webhook Events**:
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Paystack Webhook Events**:
- `charge.success`
- `subscription.create`
- `subscription.disable`

### Step 4: Test Functions
```bash
# Test create subscription
curl -X POST https://your-project.supabase.co/functions/v1/create-subscription \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","planId":"test-plan","trialDays":14}'

# Test recurring payment
curl -X POST https://your-project.supabase.co/functions/v1/process-recurring-payment \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"subscriptionId":"test-sub-id"}'
```

## Environment Variables Required
Ensure these secrets are set in Supabase:
- `STRIPE_SECRET_KEY` - For Stripe payments
- `PAYSTACK_SECRET_KEY` - For Paystack payments
- `SENDGRID_API_KEY` - For email notifications

## Monitoring
Monitor function execution in Supabase Dashboard:
1. Go to Edge Functions section
2. View logs for each function
3. Set up alerts for failures

## Error Handling
All functions include comprehensive error handling:
- Payment failures trigger dunning process
- Invalid subscriptions return clear error messages
- Failed retries are logged with details
- Email notifications sent for critical failures

## Security
- All functions use service role key for database access
- Payment processing uses secure API keys
- User authentication required for all operations
- Proration calculations validated server-side

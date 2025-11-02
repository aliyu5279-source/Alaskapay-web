# Subscription & Recurring Billing System

## Overview
Complete subscription management system with Paystack integration, automatic recurring charges, payment retry logic, usage-based billing, and customer portal.

## Features

### ✅ Subscription Plans
- Multiple plan tiers (Basic, Pro, Enterprise)
- Flexible billing cycles (daily, weekly, monthly, yearly)
- Usage limits per plan
- Trial period support
- Paystack plan code integration

### ✅ Automatic Recurring Charges
- Scheduled billing via cron jobs
- Paystack authorization code charging
- Invoice generation
- Payment verification
- Email notifications

### ✅ Payment Retry Logic (Dunning)
- Automatic retry on failed payments
- Exponential backoff (3, 7, 14 days)
- Maximum 4 retry attempts
- Subscription status updates (past_due → canceled)
- Customer notifications at each stage

### ✅ Subscription Management
- Pause/Resume functionality
- Upgrade/Downgrade with proration
- Immediate or end-of-period cancellation
- Trial period handling
- Real-time status updates

### ✅ Usage-Based Billing
- Track transactions, transfers, API calls
- Usage limits per plan
- Real-time usage monitoring
- Overage alerts
- Usage metrics dashboard

### ✅ Customer Portal
- View current subscription
- Change plans (upgrade/downgrade)
- Pause subscription with reason
- Resume subscription
- View invoices
- Usage metrics
- Payment method management

## Database Schema

### subscription_plans
- id, name, price, currency
- billing_cycle (daily/weekly/monthly/yearly)
- features (JSON array)
- usage_limits (JSON: transactions, transfers, api_calls)
- paystack_plan_code
- trial_days, active

### subscriptions
- id, user_id, plan_id
- status (active/paused/past_due/canceled/trialing)
- current_period_start, current_period_end
- trial_end, paused_at, resume_at, pause_reason
- paystack_subscription_code
- cancel_at_period_end, canceled_at

### subscription_invoices
- id, subscription_id, user_id
- amount, currency, status
- invoice_type (regular/proration)
- due_date, paid_at
- payment_gateway_id

### subscription_usage
- id, subscription_id
- metric (transactions/transfers/api_calls)
- quantity, timestamp

### dunning_management
- id, subscription_id
- status (pending/resolved/failed)
- attempt_count, max_attempts
- next_retry_at, resolved_at, failed_at

## Edge Functions

### create-subscription
Creates new subscription with Paystack integration
- Validates plan and user
- Creates Paystack subscription if plan code exists
- Handles trial periods
- Generates first invoice

### process-recurring-payment
Processes scheduled recurring charges
- Charges via Paystack authorization code
- Creates invoices
- Updates subscription periods
- Triggers dunning on failure

### process-dunning-retry
Retries failed payments with exponential backoff
- Attempts payment retry
- Updates attempt count
- Schedules next retry or cancels subscription
- Sends notifications

### handle-subscription-upgrade
Handles plan changes with proration
- Calculates proration amount
- Updates subscription plan
- Creates proration invoice
- Supports upgrade and downgrade

## Components

### SubscriptionPlans
- Displays available plans
- Subscribe/Upgrade buttons
- Feature comparison
- Current plan indicator

### SubscriptionPortal
- Current subscription details
- Plan management tabs
- Invoice history
- Pause/Resume controls

### UsageMetrics
- Real-time usage tracking
- Progress bars for limits
- Near-limit warnings
- Usage breakdown by metric

### PauseSubscriptionModal
- Pause reason input
- Resume date picker
- Maximum pause duration (90 days)
- Confirmation flow

### Admin: SubscriptionManagementTab
- All subscriptions list
- MRR (Monthly Recurring Revenue)
- Status breakdown
- Search and filters

## Usage Tracking Hook

```typescript
const { subscription, usage, trackUsage, pause, resume, upgrade } = useSubscription();

// Track usage
await trackUsage('transactions', 1);
await trackUsage('api_calls', 5);

// Manage subscription
await pause('Vacation', '2025-02-01');
await resume();
await upgrade(newPlanId);
```

## Cron Jobs Setup

### Daily Recurring Payment Check
```bash
0 0 * * * curl -X POST https://your-project.supabase.co/functions/v1/process-recurring-payment
```

### Dunning Retry Check (Every 6 hours)
```bash
0 */6 * * * curl -X POST https://your-project.supabase.co/functions/v1/process-dunning-retry
```

## Paystack Integration

### Setup
1. Create subscription plans in Paystack dashboard
2. Copy plan codes to subscription_plans.paystack_plan_code
3. Ensure authorization codes are saved on payment method creation
4. Configure webhook for subscription events

### Webhook Events
- `subscription.create` - New subscription
- `subscription.disable` - Subscription canceled
- `charge.success` - Successful recurring charge
- `charge.failed` - Failed recurring charge

## Testing

1. **Create Subscription**
   - Select plan
   - Add payment method
   - Verify subscription created
   - Check invoice generated

2. **Recurring Charge**
   - Wait for billing date or trigger manually
   - Verify charge processed
   - Check invoice created
   - Confirm period updated

3. **Failed Payment**
   - Use test card that fails
   - Verify dunning record created
   - Check retry scheduled
   - Test retry logic

4. **Pause/Resume**
   - Pause subscription
   - Verify status updated
   - Resume before date
   - Check auto-resume

5. **Upgrade/Downgrade**
   - Change to higher plan
   - Verify proration calculated
   - Check plan updated
   - Test downgrade

## Next Steps

1. Add email notifications for:
   - Subscription created
   - Payment successful
   - Payment failed
   - Retry attempts
   - Subscription canceled

2. Implement webhook handlers for Paystack subscription events

3. Add subscription analytics dashboard

4. Create customer lifecycle emails

5. Add referral credits for subscriptions

# Subscription Pause/Resume System

## Overview

Alaska Pay now supports subscription pause/resume functionality, allowing customers to temporarily suspend their subscriptions without canceling. This feature includes configurable pause duration limits, automatic resume scheduling, prorated billing adjustments, and admin override capabilities.

## Features

### Customer Features
- **Pause Subscription**: Temporarily suspend billing for 1 week to 3 months
- **Resume Subscription**: Manually resume before scheduled date
- **Automatic Resume**: Subscriptions automatically resume on scheduled date
- **Billing Extension**: Billing dates extended by pause duration
- **Pause History**: Track all pause/resume events

### Admin Features
- **Pause Settings Configuration**: Set limits per plan
- **Admin Override**: Force pause/resume any subscription
- **Pause Monitoring**: View all paused subscriptions
- **Pause Analytics**: Track pause patterns and reasons

## Database Schema

### New Tables

#### subscription_pause_history
Tracks all pause/resume events:
- `subscription_id`: Reference to subscription
- `paused_at`: When subscription was paused
- `resumed_at`: When subscription was resumed
- `pause_duration_days`: Planned pause duration
- `actual_duration_days`: Actual pause duration
- `pause_reason`: Customer-provided reason
- `paused_by`: 'customer' or 'admin'
- `resumed_by`: Who resumed the subscription

#### subscription_pause_settings
Configurable pause settings per plan:
- `plan_id`: Reference to subscription plan
- `max_pause_duration_days`: Maximum pause duration (default: 90)
- `max_pauses_per_year`: Maximum pauses per year (default: 2)
- `allow_customer_pause`: Allow customer-initiated pauses
- `require_reason`: Require reason for pausing
- `auto_resume_enabled`: Enable automatic resume
- `prorate_on_resume`: Prorate billing on resume

### Updated Tables

#### subscriptions
New fields added:
- `paused_at`: Timestamp when paused
- `pause_reason`: Reason for pausing
- `resume_at`: Scheduled resume date
- `pause_duration_days`: Pause duration in days
- `paused_by`: 'customer' or 'admin'
- `pause_count`: Total number of pauses
- `total_paused_days`: Cumulative paused days

## Service Methods

### subscriptionService.pauseSubscription()

```typescript
await subscriptionService.pauseSubscription({
  subscription_id: 'sub_123',
  pause_duration_days: 30,
  reason: 'Going on vacation',
  admin_override: false
});
```

**Validation:**
- Checks if subscription is already paused
- Validates pause duration against plan limits
- Checks pause count against yearly limit
- Validates customer pause permission
- Requires reason if configured

**Actions:**
- Updates subscription status to 'paused'
- Sets paused_at, resume_at, pause_reason
- Creates pause history record
- Logs audit trail

### subscriptionService.resumeSubscription()

```typescript
await subscriptionService.resumeSubscription({
  subscription_id: 'sub_123',
  immediate: true,
  admin_override: false
});
```

**Actions:**
- Calculates actual pause duration
- Extends billing period by pause duration
- Updates subscription status to 'active'
- Updates pause history with resume date
- Logs audit trail

### subscriptionService.autoResumeSubscriptions()

Cron job method to automatically resume subscriptions:

```typescript
await subscriptionService.autoResumeSubscriptions();
```

**Schedule:** Run daily at 00:00 UTC

**Actions:**
- Finds all subscriptions with resume_at <= now
- Resumes each subscription automatically
- Sends resume notification emails

## UI Components

### Customer Portal

#### PauseSubscriptionModal
Modal for pausing subscriptions:
- Duration selector (1 week to 3 months)
- Optional reason textarea
- Displays pause terms and conditions
- Shows scheduled resume date

#### SubscriptionPortal
Enhanced with pause/resume:
- "Pause" button for active subscriptions
- "Resume Now" button for paused subscriptions
- Displays pause information (dates, reason)
- Shows pause history

### Admin Panel

#### SubscriptionPauseSettingsTab
Configure pause settings per plan:
- Max pause duration (days)
- Max pauses per year
- Allow customer pause toggle
- Require reason toggle
- Auto resume toggle
- Prorate on resume toggle

#### SubscriptionManagementTab
Enhanced with pause management:
- "Paused Subscriptions" tab
- Table of all paused subscriptions
- Admin resume button
- Pause statistics in metrics

## Proration Logic

When a subscription is resumed:

1. **Calculate Actual Pause Duration**
   ```typescript
   const pausedAt = new Date(subscription.paused_at);
   const now = new Date();
   const actualDays = Math.floor((now - pausedAt) / (1000 * 60 * 60 * 24));
   ```

2. **Extend Billing Period**
   ```typescript
   const currentPeriodEnd = new Date(subscription.current_period_end);
   const newPeriodEnd = new Date(currentPeriodEnd);
   newPeriodEnd.setDate(newPeriodEnd.getDate() + actualDays);
   ```

3. **Update Subscription**
   - Set new `current_period_end`
   - Add to `total_paused_days`
   - Clear pause fields

## Automatic Resume Scheduling

### Cron Job Setup

Add to your cron scheduler:

```bash
# Run daily at midnight UTC
0 0 * * * curl -X POST https://your-domain.com/api/auto-resume-subscriptions
```

### Implementation

```typescript
// In your API route or scheduled function
export async function POST() {
  const result = await subscriptionService.autoResumeSubscriptions();
  return Response.json(result);
}
```

## Email Notifications

### Pause Confirmation
Sent when subscription is paused:
- Pause date
- Scheduled resume date
- Pause duration
- Billing impact

### Resume Reminder
Sent 3 days before scheduled resume:
- Upcoming resume date
- Option to extend pause
- Option to cancel subscription

### Resume Confirmation
Sent when subscription is resumed:
- Resume date
- Next billing date
- Updated billing amount

## Admin Override Capabilities

Admins can:
1. **Force Pause**: Pause any subscription regardless of limits
2. **Force Resume**: Resume any subscription immediately
3. **Extend Pause**: Extend pause duration beyond limits
4. **View All Pauses**: See complete pause history
5. **Configure Settings**: Set pause rules per plan

## Analytics & Reporting

### Pause Metrics
- Total paused subscriptions
- Average pause duration
- Pause reasons distribution
- Resume rate
- Churn after pause

### Admin Dashboard
- Paused subscriptions count
- Upcoming resumes
- Pause trends over time
- Most common pause reasons

## Best Practices

### For Customers
1. **Plan Ahead**: Pause before billing date to avoid charges
2. **Set Reminders**: Note your resume date
3. **Provide Feedback**: Share pause reasons to help improve service
4. **Consider Alternatives**: Check if downgrade is better than pause

### For Admins
1. **Set Reasonable Limits**: Balance flexibility with business needs
2. **Monitor Patterns**: Watch for abuse or churn signals
3. **Follow Up**: Contact customers who pause frequently
4. **Optimize Settings**: Adjust limits based on data

## Testing

### Test Pause Flow
```typescript
// 1. Pause subscription
const pauseResult = await subscriptionService.pauseSubscription({
  subscription_id: 'test_sub',
  pause_duration_days: 7,
  reason: 'Testing'
});

// 2. Verify pause
const { data: sub } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('id', 'test_sub')
  .single();

expect(sub.status).toBe('paused');

// 3. Resume subscription
const resumeResult = await subscriptionService.resumeSubscription({
  subscription_id: 'test_sub',
  immediate: true
});

// 4. Verify resume
const { data: resumed } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('id', 'test_sub')
  .single();

expect(resumed.status).toBe('active');
```

## Troubleshooting

### Subscription Won't Pause
- Check if already paused
- Verify pause limits not exceeded
- Check customer pause permission
- Verify plan has pause settings

### Automatic Resume Not Working
- Check cron job is running
- Verify resume_at date is correct
- Check subscription status is 'paused'
- Review error logs

### Billing Date Not Extended
- Verify prorate_on_resume is enabled
- Check actual pause duration calculation
- Review subscription period dates
- Check for manual overrides

## Security Considerations

1. **Authorization**: Verify user owns subscription or is admin
2. **Rate Limiting**: Prevent pause/resume abuse
3. **Audit Logging**: Track all pause/resume actions
4. **Validation**: Enforce pause limits and rules
5. **Data Privacy**: Protect pause reasons and history

## Future Enhancements

- [ ] Pause credits/refunds
- [ ] Partial pause (pause specific features)
- [ ] Scheduled pause (pause on future date)
- [ ] Pause reminders via SMS
- [ ] Pause analytics dashboard
- [ ] A/B testing pause messaging
- [ ] Integration with customer support
- [ ] Pause win-back campaigns

## Support

For issues or questions about subscription pause/resume:
- Check this documentation
- Review audit logs
- Contact Alaska Pay support
- Submit GitHub issue

---

**Last Updated**: October 10, 2025
**Version**: 1.0.0

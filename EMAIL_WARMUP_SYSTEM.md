# Email Domain Warmup System

## Overview
The Email Domain Warmup System automatically increases sending volume for new domains to build sender reputation and avoid spam filters.

## Features

### 1. Automated Warmup Schedules
- **Start Volume**: 100 emails/day
- **Increase Rate**: 50% every 3 days
- **Target Volume**: 10,000 emails/day (customizable)
- **Duration**: ~30 days to reach full volume

### 2. Automatic Throttling
The system monitors email performance and automatically throttles sending when:
- **Bounce Rate > 5%**: Reduce sending by 25%
- **Bounce Rate > 7%**: Reduce sending by 50%
- **Bounce Rate > 10%**: Pause warmup for 3 days
- **Complaint Rate > 0.3%**: Alert administrators
- **Complaint Rate > 0.5%**: Reduce sending by 25%
- **Complaint Rate > 1%**: Pause warmup

### 3. Progress Tracking
- Real-time dashboard showing current day and daily limit
- Historical charts of sending volume vs. limits
- Milestone notifications (Day 7, Day 14, Day 21, etc.)
- Bounce rate and complaint rate monitoring

### 4. Health Monitoring
- Domain reputation score (0-100)
- 7-day rolling bounce rate
- 7-day rolling complaint rate
- Throttling status and alerts

## Database Schema

### email_warmup_schedules
```sql
- id: UUID
- domain_id: UUID (references email_sending_domains)
- status: 'active' | 'paused' | 'completed' | 'failed'
- start_date: TIMESTAMP
- current_day: INTEGER (days since start)
- daily_limit: INTEGER (current sending limit)
- target_daily_limit: INTEGER (goal limit)
- increase_percentage: DECIMAL (default 50%)
- increase_interval_days: INTEGER (default 3)
- last_increase_date: TIMESTAMP
- completion_date: TIMESTAMP (when target reached)
```

### email_warmup_daily_stats
```sql
- id: UUID
- schedule_id: UUID
- date: DATE
- emails_sent: INTEGER
- emails_delivered: INTEGER
- emails_bounced: INTEGER
- emails_complained: INTEGER
- bounce_rate: DECIMAL (auto-calculated)
- complaint_rate: DECIMAL (auto-calculated)
- daily_limit: INTEGER
- limit_reached: BOOLEAN
- throttled: BOOLEAN
```

### email_warmup_milestones
```sql
- id: UUID
- schedule_id: UUID
- milestone_type: 'day_reached' | 'volume_reached' | 'completion' | 'throttled' | 'resumed'
- milestone_value: INTEGER
- description: TEXT
- achieved_at: TIMESTAMP
- notified: BOOLEAN
```

### email_warmup_throttle_rules
```sql
- id: UUID
- name: TEXT
- bounce_rate_threshold: DECIMAL
- complaint_rate_threshold: DECIMAL
- action: 'pause' | 'reduce_50' | 'reduce_25' | 'alert_only'
- cooldown_days: INTEGER
- is_active: BOOLEAN
```

## Usage

### Creating a Warmup Schedule

```typescript
import { emailWarmupService } from '@/lib/emailWarmupService';

// Create warmup schedule for new domain
const schedule = await emailWarmupService.createWarmupSchedule(domainId, {
  daily_limit: 100,           // Start at 100/day
  target_daily_limit: 10000,  // Target 10k/day
  increase_percentage: 50,    // Increase by 50%
  increase_interval_days: 3   // Every 3 days
});
```

### Checking Send Permission

```typescript
// Before sending email, check if allowed
const { allowed, reason, remainingToday } = await emailWarmupService.canSendEmail(domainId);

if (!allowed) {
  console.log(`Cannot send: ${reason}`);
  return;
}

console.log(`Can send. ${remainingToday} emails remaining today`);
```

### Recording Email Sends

```typescript
// After sending email, record the result
await emailWarmupService.recordEmailSent(
  domainId,
  delivered: true,
  bounced: false,
  complained: false
);
```

### Getting Warmup Progress

```typescript
const progress = await emailWarmupService.getWarmupProgress(domainId);

console.log(`Day ${progress.schedule.current_day}`);
console.log(`Daily Limit: ${progress.schedule.daily_limit}`);
console.log(`Recent Stats:`, progress.stats);
console.log(`Milestones:`, progress.milestones);
```

## Warmup Schedule Example

| Day | Daily Limit | Cumulative Total |
|-----|-------------|------------------|
| 1-3 | 100 | 300 |
| 4-6 | 150 | 750 |
| 7-9 | 225 | 1,425 |
| 10-12 | 338 | 2,439 |
| 13-15 | 507 | 3,960 |
| 16-18 | 761 | 6,243 |
| 19-21 | 1,142 | 9,669 |
| 22-24 | 1,713 | 14,808 |
| 25-27 | 2,570 | 22,518 |
| 28-30 | 3,855 | 34,083 |

## Best Practices

### 1. Domain Preparation
- Verify SPF, DKIM, and DMARC records before starting warmup
- Use a dedicated IP address for new domains
- Start with engaged subscribers only

### 2. Content Quality
- Send valuable, relevant content during warmup
- Avoid promotional content in first 2 weeks
- Use personalization and segmentation

### 3. List Hygiene
- Remove bounced addresses immediately
- Suppress complainers permanently
- Verify email addresses before adding to warmup

### 4. Monitoring
- Check dashboard daily during warmup
- Respond to throttling alerts immediately
- Investigate any sudden changes in metrics

### 5. Gradual Expansion
- Don't rush the warmup process
- If throttled, wait full cooldown period
- Consider extending warmup if metrics are borderline

## Troubleshooting

### High Bounce Rate
**Symptoms**: Bounce rate > 5%
**Causes**:
- Invalid email addresses
- Typos in email addresses
- Old/stale email lists
- Purchased email lists

**Solutions**:
1. Pause warmup immediately
2. Remove all bounced addresses
3. Implement email verification
4. Review list acquisition practices
5. Resume warmup after 3-day cooldown

### High Complaint Rate
**Symptoms**: Complaint rate > 0.3%
**Causes**:
- Sending to non-opted-in users
- Unclear unsubscribe process
- Irrelevant content
- Too frequent sending

**Solutions**:
1. Review opt-in process
2. Make unsubscribe prominent
3. Segment audience better
4. Reduce sending frequency
5. Improve content relevance

### Warmup Stalled
**Symptoms**: No progress for several days
**Causes**:
- Throttling due to poor metrics
- Technical issues with sending
- Domain reputation problems

**Solutions**:
1. Check throttle rules and alerts
2. Verify DNS records still valid
3. Review recent sending patterns
4. Check domain blacklist status
5. Contact support if needed

## Integration with Email Sending

### SendGrid Integration

```typescript
import { emailWarmupService } from '@/lib/emailWarmupService';
import sgMail from '@sendgrid/mail';

async function sendEmail(to: string, subject: string, html: string, domainId: string) {
  // Check warmup limit
  const { allowed, reason } = await emailWarmupService.canSendEmail(domainId);
  
  if (!allowed) {
    throw new Error(`Warmup limit: ${reason}`);
  }

  // Send email
  try {
    await sgMail.send({ to, subject, html });
    
    // Record successful send
    await emailWarmupService.recordEmailSent(domainId, true, false, false);
  } catch (error) {
    // Record bounce
    await emailWarmupService.recordEmailSent(domainId, false, true, false);
    throw error;
  }
}
```

## Cron Jobs (To Be Implemented)

### Daily Warmup Progression
Run daily at midnight to:
1. Increment current_day for active schedules
2. Check if it's time to increase daily_limit
3. Apply increase_percentage if interval reached
4. Create milestone records
5. Check for completion (daily_limit >= target)

### Throttling Check
Run every hour to:
1. Calculate bounce/complaint rates for last 24 hours
2. Apply throttle rules if thresholds exceeded
3. Create throttle milestone records
4. Send admin notifications

### Milestone Notifications
Run every 15 minutes to:
1. Find unnotified milestones
2. Send email/push notifications to admins
3. Mark milestones as notified

## Admin Dashboard

Access the warmup dashboard:
1. Navigate to Admin Panel
2. Click "Email Domains" in sidebar
3. Select a domain
4. Click "Warmup" tab

Features:
- Current daily limit and progress
- Days since warmup started
- Next increase countdown
- Sending volume chart
- Recent milestones
- Pause/Resume controls
- Schedule configuration

## API Reference

See `src/lib/emailWarmupService.ts` for complete API documentation.

## Support

For issues or questions:
- Check troubleshooting section above
- Review domain health metrics
- Contact support with domain ID and error details

# Admin Digest Analytics Dashboard

## Overview

The Digest Analytics Dashboard provides comprehensive insights into email digest performance, notification trends, and admin engagement with the digest email system.

## Features

### Performance Metrics
- **Total Digests Sent**: Count of all digest emails delivered
- **Total Notifications**: Aggregate count of notifications included in digests
- **Open Rate**: Percentage of digests opened by recipients
- **Average Notifications per Digest**: Mean notification count per digest

### Visualization Charts

#### 1. Delivery Trends (Line Chart)
- Shows digest sends and notification counts over time
- Helps identify patterns and peak activity periods
- X-axis: Date
- Y-axis: Count (digests sent, notifications included)

#### 2. Notifications by Severity (Pie Chart)
- Visual breakdown of notification severity distribution
- Colors: Critical (red), Warning (orange), Info (blue)
- Helps prioritize attention to critical issues

#### 3. Top Notification Types (Bar Chart)
- Displays the 5 most common notification types
- Identifies which system events generate the most alerts
- Useful for understanding system activity patterns

#### 4. Recent Digest Sends (Table)
- Lists the 10 most recent digest emails
- Columns: Date, Schedule Type, Notification Count, Status
- Status badges show "Opened" or "Sent"

## Accessing the Dashboard

1. Log in as an admin user
2. Navigate to Admin Dashboard
3. Click "Digest Analytics" in the sidebar (📈 icon)

## Time Range Filters

Select different time ranges to analyze digest performance:
- **7 Days**: Recent short-term trends
- **30 Days**: Monthly performance overview (default)
- **90 Days**: Quarterly trends and patterns

## Understanding the Metrics

### Open Rate
- Calculated as: (Digests Opened / Total Digests Sent) × 100
- Higher open rates indicate engaged admins
- Low open rates may suggest:
  - Too frequent digest emails
  - Irrelevant notification content
  - Email deliverability issues

### Average Notifications per Digest
- Indicates digest density
- Very high averages may suggest:
  - Digest frequency too low
  - High system activity
  - Need for better notification filtering

### Severity Distribution
- **High Critical %**: Requires immediate attention to system issues
- **High Info %**: System is stable, mostly informational updates
- **Balanced Distribution**: Normal operation with mixed event types

## Data Collection

### Automatic Tracking
The system automatically records:
- Digest send timestamp
- Notification count and breakdown
- SendGrid message ID (for delivery tracking)
- Delivery status (sent, delivered, opened, clicked)

### Database Table
Data is stored in the `digest_sends` table:
```sql
- admin_id: Recipient admin user
- schedule_type: hourly/daily/weekly
- notification_count: Total notifications in digest
- notifications_by_severity: JSON breakdown by severity
- notifications_by_type: JSON breakdown by type
- email_sent_at: Send timestamp
- sendgrid_message_id: Tracking ID
- delivery_status: Current status
- opened_at: When email was opened (if tracked)
```


## SendGrid Integration

### Automated Webhook Tracking

The system includes an automated webhook handler that receives delivery events from SendGrid and updates the `digest_sends` table in real-time.

**Setup**: See [SENDGRID_WEBHOOK_SETUP.md](./SENDGRID_WEBHOOK_SETUP.md) for complete configuration instructions.

**Tracked Events**:
- ✅ **Delivered**: Email successfully delivered to inbox
- 📧 **Opened**: Recipient opened the email
- 🔗 **Clicked**: Recipient clicked a link in the email
- ❌ **Bounced**: Email bounced (hard or soft)
- 🚫 **Dropped**: SendGrid dropped the email
- ⏸️ **Deferred**: Delivery temporarily delayed
- 🚨 **Spam Report**: Marked as spam by recipient
- 📤 **Unsubscribe**: Recipient unsubscribed

### Webhook Handler

The `sendgrid-webhook-handler` edge function automatically:
1. Receives POST requests from SendGrid Event Webhook
2. Verifies request signature for security
3. Updates `digest_sends` table with:
   - `delivery_status`: delivered, failed, pending
   - `delivered_at`: Timestamp when delivered
   - `opened_at`: Timestamp when opened
   - `clicked_at`: Timestamp when link clicked

**Webhook URL**:
```
https://psafbcbhbidnbzfsccsu.supabase.co/functions/v1/sendgrid-webhook-handler
```

### Email Tracking Configuration

Open and click tracking is automatically enabled in all digest emails:
```typescript
tracking_settings: {
  click_tracking: { enable: true },
  open_tracking: { enable: true }
}
```


## Best Practices

### Monitoring
1. **Check Weekly**: Review analytics at least weekly
2. **Track Trends**: Look for unusual spikes or drops
3. **Adjust Frequency**: If open rates drop, consider changing digest schedule
4. **Review Types**: Identify and address high-frequency notification types

### Optimization
1. **Low Open Rates**: 
   - Survey admins about digest usefulness
   - Adjust content or frequency
   - Improve email subject lines

2. **High Notification Counts**:
   - Consider more frequent digests
   - Implement notification filtering
   - Review severity thresholds

3. **Severity Imbalance**:
   - Too many critical: Investigate system issues
   - Too many info: Adjust notification severity levels

## API Usage

### Fetch Analytics Data
```javascript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.functions.invoke('get-digest-analytics', {
  body: { 
    adminId: user.id,
    timeRange: '30d' // '7d', '30d', or '90d'
  }
});

// Response structure:
{
  summary: {
    totalSends: 45,
    totalNotifications: 230,
    openRate: "73.3",
    clickRate: "12.5",
    avgNotificationsPerDigest: "5.1"
  },
  bySeverity: {
    critical: 15,
    warning: 85,
    info: 130
  },
  topTypes: [
    { type: "user_signup", count: 50 },
    { type: "large_transaction", count: 35 },
    ...
  ],
  trendData: [
    { date: "2025-10-01", sends: 3, notifications: 15, opened: 2 },
    ...
  ],
  recentSends: [...]
}
```

## Troubleshooting

### No Data Showing
- Verify digest emails are being sent (check `digest_sends` table)
- Ensure admin has received at least one digest
- Check time range filter

### Incorrect Open Rates
- Verify SendGrid open tracking is enabled
- Check that `sendgrid_message_id` is being recorded
- Implement webhook to update `opened_at` field

### Missing Notification Types
- Verify notification types are being recorded in `notifications_by_type`
- Check that notifications are being created before digest sends

## Related Documentation
- [Admin Digest Emails](./ADMIN_DIGEST_EMAILS.md)
- [Automated Digest Scheduling](./AUTOMATED_DIGEST_SCHEDULING.md)
- [Admin Notification System](./ADMIN_NOTIFICATION_SYSTEM.md)
- [SendGrid Webhook Setup](./SENDGRID_WEBHOOK_SETUP.md)

# Bounce Rate Monitoring Cron Job

## Overview
Alaska Pay includes an automated daily cron job that monitors email bounce rates and sends alerts to super admins when the bounce rate exceeds 5%.

## Features

### Automated Daily Checks
- Runs daily to calculate overall bounce rate
- Compares against 5% threshold
- Identifies flagged email addresses
- Sends detailed alerts to all super admins

### Alert System
- Email alerts with bounce statistics
- List of top flagged email addresses
- Direct links to admin dashboard
- Alert history tracking in database

### Admin Dashboard Integration
- View all bounce rate alerts
- See pending vs acknowledged alerts
- Acknowledge alerts with notes
- Track who acknowledged each alert

## Setup Instructions

### 1. Configure Supabase Cron Job

Add this to your Supabase project's cron jobs:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily bounce rate check at 9 AM UTC
SELECT cron.schedule(
  'daily-bounce-rate-check',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-bounce-rates-cron',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_ANON_KEY'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

Replace:
- `YOUR_PROJECT_REF` with your Supabase project reference
- `YOUR_ANON_KEY` with your Supabase anon key

### 2. Alternative: External Cron Service

If using an external service (like cron-job.org or GitHub Actions):

**Endpoint:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-bounce-rates-cron`

**Method:** POST

**Headers:**
```
Authorization: Bearer YOUR_ANON_KEY
Content-Type: application/json
```

**Schedule:** Daily at your preferred time

## How It Works

### 1. Daily Check Process
```
1. Cron job triggers check-bounce-rates-cron function
2. Function calculates overall bounce rate from digest_sends
3. Compares bounce rate against 5% threshold
4. If exceeded:
   - Retrieves list of flagged email addresses
   - Gets all super admin emails
   - Sends alert email to each super admin
   - Logs alert in bounce_alerts table
```

### 2. Alert Email Contents
- Current bounce rate percentage
- Total bounces and total sends
- Number of flagged email addresses
- Top 10 flagged addresses with details
- Direct link to admin dashboard

### 3. Admin Response Flow
```
1. Admin receives email alert
2. Logs into admin dashboard
3. Views Bounce Management tab
4. Reviews alert history
5. Acknowledges alert with notes
6. Takes action on flagged emails
```

## Database Schema

### bounce_alerts Table
```sql
- id: UUID (primary key)
- alert_type: TEXT (default 'high_bounce_rate')
- bounce_rate: DECIMAL
- total_bounces: INTEGER
- total_sends: INTEGER
- flagged_count: INTEGER
- sent_at: TIMESTAMPTZ
- acknowledged_at: TIMESTAMPTZ (nullable)
- acknowledged_by: UUID (references auth.users)
- notes: TEXT (nullable)
```

## Admin Dashboard Usage

### Viewing Alerts
1. Navigate to Admin Dashboard
2. Click "Bounce Management" in sidebar
3. Scroll to "Alert History" section
4. Click "Show Alerts" button

### Acknowledging Alerts
1. Find unacknowledged alert (red "Pending" badge)
2. Click "Acknowledge" button
3. Add notes about actions taken
4. Click "Acknowledge" to confirm

### Alert Information Displayed
- Date and time of alert
- Bounce rate percentage
- Number of bounces vs total sends
- Count of flagged email addresses
- Acknowledgment status
- Who acknowledged and when

## Monitoring and Maintenance

### Check Cron Job Status
```sql
-- View scheduled cron jobs
SELECT * FROM cron.job WHERE jobname = 'daily-bounce-rate-check';

-- View cron job execution history
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'daily-bounce-rate-check')
ORDER BY start_time DESC
LIMIT 10;
```

### Manual Trigger
You can manually trigger the check:
```bash
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/check-bounce-rates-cron \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

### View Recent Alerts
```sql
SELECT * FROM bounce_alerts 
ORDER BY sent_at DESC 
LIMIT 10;
```

## Troubleshooting

### No Alerts Received
1. Check if bounce rate actually exceeds 5%
2. Verify super admin emails in profiles table
3. Check SendGrid API key is configured
4. Review edge function logs in Supabase

### Cron Job Not Running
1. Verify pg_cron extension is enabled
2. Check cron job schedule syntax
3. Review cron.job_run_details for errors
4. Ensure edge function URL is correct

### Alert Email Not Sending
1. Verify SENDGRID_API_KEY environment variable
2. Check SendGrid account status
3. Review send-bounce-alert function logs
4. Verify sender email is verified in SendGrid

## Best Practices

1. **Regular Monitoring**: Check alert history weekly
2. **Prompt Response**: Acknowledge alerts within 24 hours
3. **Document Actions**: Always add notes when acknowledging
4. **Email Verification**: Verify flagged emails before suspending
5. **Threshold Review**: Adjust 5% threshold if needed based on your use case

## Related Documentation
- [Email Bounce Management](./BOUNCE_MANAGEMENT.md)
- [SendGrid Webhook Setup](./SENDGRID_WEBHOOK_SETUP.md)
- [Admin Digest Emails](./ADMIN_DIGEST_EMAILS.md)

# Automated Admin Digest Email Scheduling

This document explains how automated scheduling works for admin digest emails using Supabase's pg_cron extension.

## Overview

The Alaska Pay admin notification system automatically sends digest emails at regular intervals based on admin preferences. This is accomplished using PostgreSQL's `pg_cron` extension, which runs scheduled jobs directly in the database.

## Scheduled Jobs

Three cron jobs are configured to run automatically:

### 1. Hourly Digest
- **Job Name**: `send-hourly-admin-digest`
- **Schedule**: `0 * * * *` (top of every hour)
- **Runs**: Every hour at :00 minutes
- **Sends to**: Admins with `digest_schedule = 'hourly'`

### 2. Daily Digest
- **Job Name**: `send-daily-admin-digest`
- **Schedule**: `0 8 * * *` (8:00 AM UTC daily)
- **Runs**: Once per day at 8:00 AM UTC
- **Sends to**: Admins with `digest_schedule = 'daily'`

### 3. Weekly Digest
- **Job Name**: `send-weekly-admin-digest`
- **Schedule**: `0 9 * * 1` (9:00 AM UTC every Monday)
- **Runs**: Once per week on Monday at 9:00 AM UTC
- **Sends to**: Admins with `digest_schedule = 'weekly'`

## How It Works

1. **pg_cron Extension**: Runs scheduled tasks directly in PostgreSQL
2. **HTTP POST**: Each job makes an HTTP POST request to the `send-admin-digest` edge function
3. **Schedule Parameter**: Passes the schedule type (hourly/daily/weekly) in the request body
4. **Edge Function**: Aggregates notifications and sends emails to matching admins

## Cron Schedule Format

The cron schedule uses standard cron syntax:
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, where 0 and 7 are Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

## Managing Scheduled Jobs

### View All Digest Jobs
```sql
SELECT * FROM admin_scheduled_jobs;
```

### View All Cron Jobs
```sql
SELECT * FROM cron.job;
```

### Disable a Job
```sql
SELECT cron.unschedule('send-hourly-admin-digest');
```

### Re-enable a Job
```sql
SELECT cron.schedule(
  'send-hourly-admin-digest',
  '0 * * * *',
  $$ [SQL command here] $$
);
```

### View Job Run History
```sql
SELECT * FROM cron.job_run_details
WHERE jobid IN (SELECT jobid FROM cron.job WHERE jobname LIKE '%admin-digest%')
ORDER BY start_time DESC
LIMIT 20;
```

## Customizing Schedule Times

To change when digests are sent, update the cron schedule:

### Change Daily Digest to 6:00 PM UTC
```sql
-- First unschedule the existing job
SELECT cron.unschedule('send-daily-admin-digest');

-- Then reschedule with new time
SELECT cron.schedule(
  'send-daily-admin-digest',
  '0 18 * * *',  -- 6:00 PM UTC
  $$ [same SQL command] $$
);
```

### Change Weekly Digest to Friday
```sql
SELECT cron.unschedule('send-weekly-admin-digest');
SELECT cron.schedule(
  'send-weekly-admin-digest',
  '0 9 * * 5',  -- 9:00 AM UTC on Friday
  $$ [same SQL command] $$
);
```

## Timezone Considerations

- All cron schedules run in **UTC timezone**
- Admins can set their preferred time in the UI, but actual sends happen at fixed UTC times
- Consider your admin team's timezone when setting schedule times

### Example Timezone Conversions
- 8:00 AM UTC = 12:00 AM PST (midnight)
- 8:00 AM UTC = 3:00 AM EST
- 8:00 AM UTC = 4:00 PM CST (China)

**Recommendation**: Set daily digests to run at 8:00 AM UTC (early morning US time) or 16:00 UTC (8:00 AM PST).

## Monitoring

### Check if Jobs are Running
```sql
SELECT 
  jobname,
  last_run_status,
  last_run_start_time,
  last_run_end_time
FROM cron.job_run_details jrd
JOIN cron.job j ON j.jobid = jrd.jobid
WHERE j.jobname LIKE '%admin-digest%'
ORDER BY last_run_start_time DESC;
```

### Check for Failed Runs
```sql
SELECT * FROM cron.job_run_details
WHERE status = 'failed'
  AND jobid IN (SELECT jobid FROM cron.job WHERE jobname LIKE '%admin-digest%')
ORDER BY start_time DESC;
```

## Troubleshooting

### Jobs Not Running
1. Check if pg_cron extension is enabled:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_cron';
   ```

2. Verify jobs are scheduled:
   ```sql
   SELECT * FROM cron.job WHERE jobname LIKE '%admin-digest%';
   ```

3. Check job run history for errors:
   ```sql
   SELECT * FROM cron.job_run_details
   WHERE jobid IN (SELECT jobid FROM cron.job WHERE jobname LIKE '%admin-digest%')
   ORDER BY start_time DESC LIMIT 10;
   ```

### Emails Not Sending
1. Check edge function logs in Supabase dashboard
2. Verify SendGrid API key is configured
3. Check admin_digest_preferences table for correct settings
4. Verify admins have email addresses in profiles table

### Duplicate Emails
- Ensure only one instance of each cron job is scheduled
- Check for duplicate job names in cron.job table

## Security Notes

- The cron jobs use the anon API key to call edge functions
- Edge functions validate admin status before sending emails
- RLS policies protect admin_digest_preferences table
- Only admins can view and modify their digest preferences

## Best Practices

1. **Monitor Regularly**: Check job run history weekly
2. **Test Changes**: Test schedule changes in development first
3. **Timezone Awareness**: Always consider UTC when setting schedules
4. **Resource Usage**: Hourly digests increase database/email load
5. **User Preferences**: Respect admin preferences for digest frequency

## Manual Testing

To manually trigger a digest email (for testing):

```typescript
// In browser console or API client
const { data, error } = await supabase.functions.invoke('send-admin-digest', {
  body: { schedule: 'daily' }
});
```

Or using curl:
```bash
curl -X POST https://psafbcbhbidnbzfsccsu.supabase.co/functions/v1/send-admin-digest \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"schedule": "daily"}'
```

## Future Enhancements

Potential improvements to the scheduling system:

1. **Per-Admin Custom Times**: Allow each admin to set their own preferred time
2. **Smart Scheduling**: Send digests only if there are new notifications
3. **Digest Previews**: Allow admins to preview digest format before enabling
4. **Pause/Resume**: Temporary pause digest emails (e.g., during vacation)
5. **Digest Analytics**: Track open rates and engagement with digest emails

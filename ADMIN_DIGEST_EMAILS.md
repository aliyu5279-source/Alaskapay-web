# Admin Email Digest System

## Overview
The admin email digest system allows administrators to receive batched email summaries of notifications instead of individual emails for each event. This reduces email fatigue while keeping admins informed.

## Features
- **Flexible Scheduling**: Choose hourly, daily, or weekly digest frequency
- **Time Configuration**: Set specific times for daily/weekly digests (UTC)
- **Smart Batching**: Automatically aggregates notifications by severity
- **Preference Integration**: Works seamlessly with existing notification preferences

## Database Table

### admin_digest_preferences
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- enabled: BOOLEAN (default: false)
- schedule: TEXT ('hourly', 'daily', 'weekly')
- hour_of_day: INTEGER (0-23, UTC time)
- day_of_week: INTEGER (0-6, Sunday=0)
- last_sent_at: TIMESTAMPTZ
```

## Edge Function

### send-admin-digest
Aggregates and sends batched notification emails to admins based on their digest preferences.

**Invocation**:
```javascript
await supabase.functions.invoke('send-admin-digest', {
  body: { schedule: 'daily' } // or 'hourly', 'weekly'
});
```

## UI Components

### DigestPreferences Component
Located in `src/components/DigestPreferences.tsx`, provides:
- Toggle to enable/disable digest emails
- Dropdown to select frequency (hourly/daily/weekly)
- Time picker for daily/weekly digests
- Day of week selector for weekly digests

Automatically displayed in NotificationPreferences for admin users.

## How It Works

1. **Admin enables digest**: Sets schedule preference in UI
2. **Notifications created**: System continues to create admin_notifications as normal
3. **Digest scheduled**: Cron job or manual trigger calls send-admin-digest edge function
4. **Aggregation**: Function queries notifications since last digest
5. **Email sent**: Batched summary email sent via SendGrid
6. **Immediate emails skipped**: create-admin-notification skips immediate emails if digest enabled
## Automated Scheduling

### pg_cron (Implemented)
The system uses Supabase's built-in pg_cron extension for automated scheduling. Three cron jobs are configured:

**Hourly Digest**
- Runs every hour at :00 minutes
- Schedule: `0 * * * *`
- Automatically calls send-admin-digest with `schedule: 'hourly'`

**Daily Digest**
- Runs at 8:00 AM UTC every day
- Schedule: `0 8 * * *`
- Automatically calls send-admin-digest with `schedule: 'daily'`

**Weekly Digest**
- Runs at 9:00 AM UTC every Monday
- Schedule: `0 9 * * 1`
- Automatically calls send-admin-digest with `schedule: 'weekly'`

### Manual Triggering (For Testing)
You can manually trigger a digest for testing:

```bash
curl -X POST https://psafbcbhbidnbzfsccsu.supabase.co/functions/v1/send-admin-digest \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{"schedule":"daily"}'
```

**Note**: See AUTOMATED_DIGEST_SCHEDULING.md for detailed information on managing cron jobs, monitoring, and troubleshooting.


## Email Format
Digest emails include:
- Summary statistics (count by severity)
- All critical notifications (full details)
- Top 5 warning notifications
- Top 3 info notifications
- Professional HTML formatting with color-coded severity

## Best Practices
1. Enable digests for non-urgent notifications
2. Keep immediate emails for critical alerts if needed
3. Choose digest frequency based on your monitoring needs
4. Review digest preferences regularly
5. Test with manual function invocation before scheduling

## Configuration

Admins can configure digest preferences in:
**Dashboard → Settings → Notifications → Email Digest Schedule**

Changes take effect on the next scheduled digest run.

# Scheduled Batch History Exports

Automatically export batch history data at regular intervals and email reports to administrators.

## Features

- **Automated Scheduling**: Daily, weekly, or monthly export schedules
- **Email Delivery**: Automatic email delivery with attachments via SendGrid
- **Multiple Formats**: Support for CSV, JSON, or both formats
- **Configurable Retention**: Automatic cleanup of old export history
- **Manual Triggers**: Ability to run exports on-demand
- **Export History**: Track all export executions with status and metadata

## Database Schema

### scheduled_batch_exports
Stores scheduled export job configurations:
- `id`: UUID primary key
- `name`: Export job name
- `frequency`: 'daily', 'weekly', or 'monthly'
- `export_format`: 'csv', 'json', or 'both'
- `include_analytics`: Include productivity analytics
- `recipient_emails`: Array of email addresses
- `filters`: JSONB filters (date range, field type, operation count)
- `last_run_at`: Last execution timestamp
- `next_run_at`: Next scheduled execution
- `is_active`: Enable/disable the schedule
- `retention_days`: Days to keep export history (default: 30)

### batch_export_history
Tracks export execution history:
- `scheduled_export_id`: Reference to scheduled export
- `export_format`: Format used for this export
- `file_size`: Size of exported file
- `batch_count`: Number of batches included
- `date_range_start/end`: Data range covered
- `status`: 'success', 'failed', or 'pending'
- `error_message`: Error details if failed
- `sent_to`: Email addresses that received the export

## Edge Function

### execute-scheduled-exports
Cron job that runs scheduled exports:

```typescript
// Invoke manually or via cron
const { data, error } = await supabase.functions.invoke('execute-scheduled-exports');
```

**Process:**
1. Queries all active exports due for execution
2. Calculates date range based on frequency
3. Generates export files (CSV/JSON)
4. Sends emails with attachments via SendGrid
5. Records export history
6. Updates next run time automatically
7. Cleans up old export history based on retention policy

## UI Components

### ScheduledExportsManager
Admin interface for managing scheduled exports:

**Features:**
- Create new scheduled exports
- Configure frequency, format, and recipients
- Toggle active/inactive status
- Manual "Run Now" trigger
- Delete scheduled exports
- View next/last run times

**Location:** Report Library view in Custom Report Builder

## Usage

### Creating a Scheduled Export

1. Navigate to Report Library
2. Scroll to "Scheduled Exports" section
3. Click "New Schedule"
4. Configure:
   - Name (e.g., "Weekly Admin Report")
   - Frequency (daily/weekly/monthly)
   - Format (CSV/JSON/both)
   - Recipient emails (comma-separated)
   - Retention days (default: 30)
5. Click "Create"

### Email Format

Recipients receive an email with:
- Subject: "Scheduled Batch History Export - [Name]"
- Date range covered
- Attached export file(s)
- Sent from: noreply@yourdomain.com

### Export File Contents

**CSV Format:**
```csv
Timestamp,Field,Operation Count,Duration (ms),Preview
2024-01-15T10:30:00Z,title,5,1500,Updated report title
2024-01-15T10:31:00Z,description,3,800,Added description
```

**JSON Format:**
```json
{
  "dateRange": {
    "start": "2024-01-15T00:00:00Z",
    "end": "2024-01-16T00:00:00Z"
  },
  "batches": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "field": "title",
      "operationCount": 5,
      "duration": 1500,
      "preview": "Updated report title"
    }
  ],
  "analytics": {
    "totalBatches": 42,
    "totalOperations": 156,
    "avgBatchSize": 3.7,
    "typingSpeed": 45.2
  }
}
```

## Automation Setup

### Cron Job Configuration

Set up a cron job to run the edge function regularly:

```bash
# Run every hour
0 * * * * curl -X POST https://[project-ref].supabase.co/functions/v1/execute-scheduled-exports \
  -H "Authorization: Bearer [anon-key]"
```

Or use Supabase Cron (if available):
```sql
SELECT cron.schedule(
  'execute-scheduled-exports',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url:='https://[project-ref].supabase.co/functions/v1/execute-scheduled-exports',
    headers:='{"Authorization": "Bearer [service-role-key]"}'::jsonb
  );
  $$
);
```

## Automatic Cleanup

Old export history is automatically cleaned up based on `retention_days`:
- Runs during each scheduled export execution
- Deletes history records older than retention period
- Prevents database bloat
- Configurable per export schedule

## Manual Execution

Trigger an export immediately:

1. Find the scheduled export in the list
2. Click the "Play" button
3. Export runs immediately regardless of schedule
4. Next scheduled run time remains unchanged

## Monitoring

### Export History
View execution history for each scheduled export:
- Execution timestamp
- Status (success/failed)
- Batch count
- Date range covered
- Recipients
- Error messages (if failed)

### Troubleshooting

**No emails received:**
1. Check SendGrid API key is configured
2. Verify recipient email addresses are correct
3. Check SendGrid dashboard for delivery status
4. Review edge function logs for errors

**Export failures:**
1. Check edge function logs in Supabase dashboard
2. Verify database connectivity
3. Ensure sufficient data exists for the date range
4. Check SendGrid attachment size limits (< 30MB)

**Schedule not running:**
1. Verify `is_active` is true
2. Check `next_run_at` timestamp
3. Ensure cron job is configured correctly
4. Review edge function invocation logs

## Best Practices

1. **Email Recipients**: Use distribution lists for team notifications
2. **Frequency**: Match frequency to team needs (weekly is typical)
3. **Retention**: Balance storage costs with audit requirements
4. **Format**: Use CSV for spreadsheet analysis, JSON for programmatic processing
5. **Testing**: Use "Run Now" to test before relying on schedule
6. **Monitoring**: Regularly review export history for failures

## Security

- Row Level Security (RLS) enforced on all tables
- Only authenticated users can manage their own exports
- Service role key required for cron execution
- Email addresses validated before sending
- Export data filtered by user permissions

## Future Enhancements

- Custom date range filters
- Selective field exports
- Compressed attachments for large exports
- Webhook notifications
- Export to cloud storage (S3, GCS)
- Custom email templates
- Export scheduling UI calendar view

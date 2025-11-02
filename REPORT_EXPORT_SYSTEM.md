# Report Export and Scheduling System

## Overview
Comprehensive report generation and automated delivery system for analytics data with multiple templates and formats.

## Features

### 1. Report Templates
- **Executive Summary**: High-level KPIs for executives
- **Detailed Metrics**: Comprehensive data analysis
- **Campaign Performance**: Email campaign insights

### 2. Export Formats
- **PDF**: Professional reports with charts and tables
- **Excel/CSV**: Raw data for further analysis

### 3. Scheduled Reports
- **Daily**: Sent every morning at 9 AM
- **Weekly**: Sent every Monday at 9 AM
- **Monthly**: Sent on 1st of each month at 9 AM

## Database Schema

### scheduled_reports
```sql
- id: UUID (primary key)
- admin_id: UUID (references auth.users)
- report_name: TEXT
- report_type: TEXT (executive_summary, detailed_metrics, campaign_performance)
- frequency: TEXT (daily, weekly, monthly)
- recipients: TEXT[] (email addresses)
- filters: JSONB (applied filters)
- is_active: BOOLEAN
- last_sent_at: TIMESTAMPTZ
- next_send_at: TIMESTAMPTZ
```

### report_exports
```sql
- id: UUID (primary key)
- admin_id: UUID (references auth.users)
- report_type: TEXT
- format: TEXT (pdf, excel)
- file_url: TEXT
- filters: JSONB
- scheduled_report_id: UUID (optional)
- status: TEXT (generating, completed, failed)
- error_message: TEXT
```

## Edge Functions

### generate-pdf-report
Generates HTML-based PDF reports with charts and tables.

**Request:**
```json
{
  "reportType": "executive_summary",
  "filters": { "datePreset": "30d" },
  "data": {
    "totalUsers": 1500,
    "totalRevenue": 45000,
    "emailsSent": 12000
  }
}
```

**Response:**
```json
{
  "html": "<!DOCTYPE html>...",
  "reportType": "executive_summary",
  "generatedAt": "2025-10-07T19:00:00Z"
}
```

### generate-excel-report
Generates CSV data for Excel export.

**Request:**
```json
{
  "reportType": "detailed_metrics",
  "filters": {},
  "data": {
    "rows": [
      { "date": "2025-10-01", "users": 100, "revenue": 5000 }
    ]
  }
}
```

**Response:**
```json
{
  "csvData": "Date,Users,Revenue\n2025-10-01,100,5000",
  "filename": "detailed_metrics_2025-10-07.csv"
}
```

### schedule-report
Manages scheduled report configurations.

**Create Schedule:**
```json
{
  "action": "create",
  "scheduleData": {
    "report_name": "Weekly Executive Summary",
    "report_type": "executive_summary",
    "frequency": "weekly",
    "recipients": ["ceo@company.com", "cfo@company.com"],
    "filters": { "datePreset": "7d" }
  }
}
```

**Update Schedule:**
```json
{
  "action": "update",
  "scheduleId": "uuid",
  "scheduleData": { "is_active": false }
}
```

**Delete Schedule:**
```json
{
  "action": "delete",
  "scheduleId": "uuid"
}
```

## UI Components

### ReportExportModal
Modal for one-time report generation and export.

**Features:**
- Template selection
- Format selection (PDF/Excel)
- Instant download
- Applied filter preview

### ScheduledReportsModal
Modal for managing automated report schedules.

**Features:**
- Create new schedules
- View existing schedules
- Edit schedule settings
- Delete schedules
- Recipient management

## Usage

### Export a Report
```typescript
import { ReportExportModal } from '@/components/admin/ReportExportModal';

<ReportExportModal
  open={showModal}
  onClose={() => setShowModal(false)}
  filters={currentFilters}
  data={analyticsData}
/>
```

### Schedule Reports
```typescript
import { ScheduledReportsModal } from '@/components/admin/ScheduledReportsModal';

<ScheduledReportsModal
  open={showModal}
  onClose={() => setShowModal(false)}
/>
```

## Automation

### Cron Job Setup
To enable automated report sending, set up a cron job:

```bash
# Run every hour to check for pending reports
0 * * * * curl -X POST https://your-project.supabase.co/functions/v1/send-scheduled-reports
```

### Send Scheduled Reports Function
Create this edge function to process pending reports:

```typescript
// Check for reports where next_send_at <= now
// Generate report using filters
// Send via email using SendGrid
// Update last_sent_at and next_send_at
```

## Report Templates

### Executive Summary
- Total Users (with % change)
- Total Revenue (with % change)
- Emails Sent (with % change)
- Key Insights section
- Trend indicators

### Detailed Metrics
- Daily breakdown table
- User growth metrics
- Revenue by payment type
- Email engagement rates
- Conversion funnels

### Campaign Performance
- Campaign list with stats
- Open rates and click rates
- Revenue attribution
- A/B test results
- Segment performance

## Best Practices

1. **Schedule Timing**: Set reports for off-peak hours
2. **Recipients**: Keep recipient lists under 10 people
3. **Filters**: Save common filter combinations
4. **Frequency**: Don't over-email stakeholders
5. **Templates**: Use appropriate template for audience

## Future Enhancements

- Custom report builder
- Chart customization
- White-label branding
- Multi-language support
- Report sharing links
- Slack/Teams integration

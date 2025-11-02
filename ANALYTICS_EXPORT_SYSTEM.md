# Analytics Export and Scheduled Reports System

## Overview
Comprehensive system for exporting template analytics data and scheduling automated email reports.

## Features

### 1. Data Export
- **Multiple Formats**: CSV and JSON export options
- **Data Types**:
  - Usage Trends: Template usage over time
  - Popular Templates: Most used templates
  - Performance Metrics: Success/failure rates
  - Category Distribution: Template types breakdown
- **Date Range Selection**: Custom date ranges for exports
- **Instant Download**: Client-side file generation

### 2. Scheduled Reports
- **Automated Delivery**: Email reports on schedule
- **Flexible Frequency**: Daily, weekly, or monthly
- **Multiple Data Types**: Select which analytics to include
- **Multiple Recipients**: Send to multiple email addresses
- **Format Options**: CSV, JSON, or both formats

## Components

### AnalyticsExportModal
Modal for exporting analytics data:
```typescript
<AnalyticsExportModal 
  open={showExportModal} 
  onOpenChange={setShowExportModal} 
/>
```

**Features**:
- Data type selector
- Format selector (CSV/JSON)
- Date range picker
- Export button with loading state

### ScheduledAnalyticsReports
Manage scheduled reports:
```typescript
<ScheduledAnalyticsReports />
```

**Features**:
- Create new scheduled reports
- Edit existing schedules
- Delete reports
- View report details
- Multiple data type selection
- Recipient management

## Edge Functions

### export-analytics-data
Export analytics data in specified format:
```typescript
const { data, error } = await supabase.functions.invoke('export-analytics-data', {
  body: {
    format: 'csv', // or 'json'
    dataType: 'usage-trends',
    startDate: '2025-01-01',
    endDate: '2025-01-31'
  }
});
```

### schedule-analytics-report
Manage scheduled reports:
```typescript
// Create report
await supabase.functions.invoke('schedule-analytics-report', {
  body: {
    action: 'create',
    reportData: {
      name: 'Weekly Analytics Report',
      description: 'Weekly summary of template usage',
      data_types: ['usage-trends', 'popular-templates'],
      export_format: 'csv',
      frequency: 'weekly',
      recipients: ['admin@example.com'],
      start_date: '2025-01-01'
    }
  }
});

// Update report
await supabase.functions.invoke('schedule-analytics-report', {
  body: {
    action: 'update',
    reportId: 'uuid',
    reportData: { is_active: false }
  }
});

// Delete report
await supabase.functions.invoke('schedule-analytics-report', {
  body: {
    action: 'delete',
    reportId: 'uuid'
  }
});
```

## Database Schema

### scheduled_analytics_reports
```sql
CREATE TABLE scheduled_analytics_reports (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  data_types TEXT[] NOT NULL,
  export_format TEXT CHECK (export_format IN ('csv', 'json', 'both')),
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  recipients TEXT[] NOT NULL,
  start_date DATE NOT NULL,
  end_date_offset INTEGER DEFAULT 0,
  last_sent_at TIMESTAMPTZ,
  next_scheduled_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Usage Guide

### Exporting Data Manually

1. Click "Export Data" button in analytics dashboard
2. Select data type (usage trends, popular templates, etc.)
3. Choose export format (CSV or JSON)
4. Select date range
5. Click "Export Data" to download

### Scheduling Automated Reports

1. Navigate to "Scheduled Reports" tab
2. Click "Schedule Report"
3. Fill in report details:
   - Name and description
   - Select data types to include
   - Choose export format
   - Set frequency (daily/weekly/monthly)
   - Add recipient email addresses
4. Click "Schedule Report"

### Managing Scheduled Reports

- **Edit**: Click edit icon to modify report settings
- **Delete**: Click trash icon to remove report
- **View Details**: See frequency, recipients, and data types
- **Active Status**: Toggle reports on/off

## Export Formats

### CSV Format
- Headers in first row
- Comma-separated values
- Quoted strings with commas
- Compatible with Excel, Google Sheets

### JSON Format
- Pretty-printed with 2-space indentation
- Array of objects
- Nested structures preserved
- Easy to parse programmatically

## Automation

### Cron Job Setup
To execute scheduled reports automatically, set up a cron job:

```bash
# Run every hour to check for due reports
0 * * * * curl -X POST https://your-project.supabase.co/functions/v1/execute-scheduled-reports
```

### Email Delivery
Reports are sent via SendGrid to specified recipients with:
- Professional email template
- Attached data files
- Report metadata (date range, data types)
- Direct links to dashboard

## Best Practices

1. **Date Ranges**: Use appropriate ranges for data types
2. **Recipients**: Keep recipient lists updated
3. **Frequency**: Match frequency to data update patterns
4. **Format**: Use CSV for spreadsheets, JSON for APIs
5. **Cleanup**: Delete unused scheduled reports

## Troubleshooting

### Export Not Working
- Check date range is valid
- Verify data exists for selected range
- Ensure browser allows downloads

### Scheduled Reports Not Sending
- Verify SendGrid API key is configured
- Check recipient email addresses
- Confirm report is active
- Review cron job execution logs

### Missing Data
- Ensure analytics data is being collected
- Check date range includes data
- Verify table permissions

## Future Enhancements

- PDF export format
- Excel (.xlsx) format
- Custom report templates
- Report preview before scheduling
- Delivery confirmation tracking
- Report history and audit logs
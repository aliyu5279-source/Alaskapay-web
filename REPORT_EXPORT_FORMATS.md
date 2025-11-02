# Report Export Formats - PDF & Excel

This system provides automated PDF and Excel report generation with custom branding, charts, and tables.

## Features

### PDF Export
- Custom branded headers with company logo and colors
- Professional formatting with sections and metrics
- Data tables with styled headers and rows
- Date range and report metadata
- Generated via `generate-pdf-report` edge function

### Excel Export
- Multiple worksheets (Summary + Data sheets)
- Formatted headers and data tables
- Key metrics summary sheet
- Report metadata (date range, generation time)
- Generated via `generate-excel-report` edge function

### Format Options
1. **PDF Only** - Single PDF attachment
2. **Excel Only** - Single Excel attachment
3. **Both** - Both PDF and Excel attached to email

## Edge Functions

### generate-pdf-report
Converts report data into formatted PDF documents.

**Input:**
```json
{
  "reportData": {
    "metrics": { "Total Users": 1250, "Revenue": "$45,230" },
    "tables": [
      {
        "title": "Top Users",
        "headers": ["Name", "Email", "Value"],
        "rows": [["John", "john@example.com", "$500"]]
      }
    ]
  },
  "templateName": "Executive Summary",
  "dateRange": { "start": "2024-01-01", "end": "2024-01-31" },
  "branding": {
    "companyName": "My Company",
    "primaryColor": "#0066cc"
  }
}
```

### generate-excel-report
Converts report data into Excel spreadsheets.

**Input:** Same as PDF generation

**Output:** Excel file with multiple sheets

## Scheduled Report Integration

Reports can be scheduled with format selection:

```typescript
const scheduleData = {
  report_name: 'Weekly Analytics',
  report_type: 'executive_summary',
  frequency: 'weekly',
  format: 'both', // 'pdf', 'excel', or 'both'
  recipients: ['admin@example.com', 'manager@example.com']
};
```

## Email Delivery

Reports are automatically attached to emails via SendGrid:

- PDF files: `application/pdf`
- Excel files: `application/vnd.ms-excel`
- Base64 encoded attachments
- Multiple recipients supported

## Database Schema

```sql
ALTER TABLE scheduled_reports 
ADD COLUMN format TEXT DEFAULT 'pdf' 
CHECK (format IN ('pdf', 'excel', 'both'));
```

## Usage in Admin Dashboard

1. Navigate to Analytics Dashboard
2. Click "Scheduled Reports"
3. Create new schedule
4. Select export format (PDF/Excel/Both)
5. Configure recipients and frequency
6. Reports automatically generated and emailed

## Customization

### Branding
Customize PDF appearance:
- Company name in header
- Primary color for metrics and titles
- Custom logo (future enhancement)

### Report Data
Fetch data from your database:
```typescript
const reportData = {
  metrics: await fetchMetrics(),
  tables: await fetchTables()
};
```

## Future Enhancements
- Chart generation in PDFs
- Advanced Excel formatting
- Custom templates
- Logo uploads
- Interactive PDFs

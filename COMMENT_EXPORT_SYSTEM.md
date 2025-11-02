# Comment Export System

## Overview
The Comment Export System allows admins to export all comments and feedback from custom reports into formatted HTML/PDF documents with advanced filtering options.

## Features

### 1. Export Functionality
- **Export Button**: Located in the Custom Report Builder toolbar
- **Enabled State**: Only available when a report is saved (has a report ID)
- **Format**: Generates formatted HTML document (can be printed as PDF)

### 2. Filtering Options

#### Status Filter
- **All Comments**: Export all comments regardless of status
- **Resolved Only**: Export only resolved comments
- **Unresolved Only**: Export only unresolved comments

#### Date Range Filters
- **Start Date**: Filter comments from a specific date onwards
- **End Date**: Filter comments up to a specific date
- **Date Picker**: Calendar interface for easy date selection

### 3. Export Content

The exported document includes:
- **Report Metadata**:
  - Report name
  - Report ID
  - Generation timestamp
  - Total comment count
  - Applied filters

- **Comment Details**:
  - Section identification
  - User information (name/email)
  - Comment timestamp
  - Comment content
  - Resolution status
  - Resolution timestamp (if resolved)

### 4. Document Styling

- **Visual Indicators**:
  - Blue border for unresolved comments
  - Green border for resolved comments
  - Status badges (Resolved/Unresolved)
  - Section labels

- **Professional Layout**:
  - Clean typography
  - Organized sections
  - Print-friendly design
  - Responsive formatting

## Usage

### Exporting Comments

1. **Open Report Builder**:
   ```typescript
   // Navigate to Custom Reports tab in Admin Dashboard
   ```

2. **Save Your Report**:
   - Ensure the report is saved to enable export functionality
   - The report must have a valid ID

3. **Click Export Comments**:
   - Button located in the top toolbar
   - Opens the export modal

4. **Configure Filters**:
   ```typescript
   // Select status filter
   setResolvedFilter('resolved' | 'unresolved' | 'all');
   
   // Set date range
   setStartDate(new Date('2024-01-01'));
   setEndDate(new Date('2024-12-31'));
   ```

5. **Generate Export**:
   - Click "Export to PDF" button
   - HTML file downloads automatically
   - Open in browser and print to PDF if needed

### Example Export

```html
<!DOCTYPE html>
<html>
<head>
  <title>Q4 Revenue Report - Comments Summary</title>
</head>
<body>
  <h1>Q4 Revenue Report</h1>
  <h2>Comments Summary</h2>
  
  <div class="meta">
    <p><strong>Generated:</strong> 10/7/2025, 7:53:00 PM</p>
    <p><strong>Total Comments:</strong> 15</p>
    <p><strong>Filters Applied:</strong> Unresolved, From: Jan 1, 2024</p>
  </div>

  <div class="comment">
    <div class="section">📍 Section: revenue-chart-q4</div>
    <div class="comment-header">
      <div>
        <div class="user">John Smith</div>
        <div class="timestamp">Oct 5, 2025, 2:30 PM</div>
      </div>
      <span class="status unresolved">○ Unresolved</span>
    </div>
    <div class="content">
      The revenue spike in October needs clarification.
      Can we add a breakdown by product category?
    </div>
  </div>
</body>
</html>
```

## Component Integration

### CommentExportModal

```typescript
import { CommentExportModal } from '@/components/admin/CommentExportModal';

function CustomReportBuilder() {
  const [showCommentExport, setShowCommentExport] = useState(false);
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [name, setName] = useState('');

  return (
    <>
      <Button 
        onClick={() => setShowCommentExport(true)} 
        disabled={!currentReportId}
      >
        <FileDown className="w-4 h-4 mr-2" />
        Export Comments
      </Button>

      {showCommentExport && currentReportId && (
        <CommentExportModal
          open={showCommentExport}
          onOpenChange={setShowCommentExport}
          reportId={currentReportId}
          reportName={name || 'Untitled Report'}
        />
      )}
    </>
  );
}
```

## Database Queries

### Fetching Comments with Filters

```typescript
// Build query with filters
let query = supabase
  .from('report_comments')
  .select('*, user:profiles(full_name, email)')
  .eq('report_id', reportId)
  .order('created_at', { ascending: true });

// Apply status filter
if (resolvedFilter !== 'all') {
  query = query.eq('resolved', resolvedFilter === 'resolved');
}

// Apply date range filters
if (startDate) {
  query = query.gte('created_at', startDate.toISOString());
}
if (endDate) {
  query = query.lte('created_at', endDate.toISOString());
}

const { data: comments, error } = await query;
```

## Styling and Formatting

### CSS Classes

```css
.comment {
  border-left: 4px solid #3b82f6;
  padding: 20px;
  margin: 20px 0;
  background: #ffffff;
}

.comment.resolved {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.status.resolved {
  background: #d1fae5;
  color: #065f46;
}

.status.unresolved {
  background: #fee2e2;
  color: #991b1b;
}
```

## Best Practices

1. **Regular Exports**: Export comments regularly for documentation
2. **Filter Appropriately**: Use filters to focus on specific feedback
3. **Archive Reports**: Save exported documents for historical reference
4. **Team Review**: Share exports with team members for collaborative review
5. **Print to PDF**: Use browser print function for permanent PDF copies

## Use Cases

### 1. Team Meetings
Export unresolved comments before meetings to discuss outstanding issues.

### 2. Report Audits
Export all comments to review feedback history and track improvements.

### 3. Stakeholder Updates
Export resolved comments to show completed action items.

### 4. Compliance Documentation
Export comments with date ranges for audit trails and compliance records.

### 5. Performance Reviews
Export comments to evaluate team responsiveness and issue resolution.

## Future Enhancements

- PDF generation server-side with advanced formatting
- Bulk export for multiple reports
- Email delivery of exports
- Scheduled automatic exports
- Comment analytics in exports
- Custom export templates
- Export to Excel/CSV formats
- Integration with document management systems

## Troubleshooting

### Export Button Disabled
- Ensure report is saved first
- Check that report has a valid ID

### No Comments in Export
- Verify filters are not too restrictive
- Check date range settings
- Confirm comments exist for the report

### Formatting Issues
- Use modern browser for best results
- Check print settings when converting to PDF
- Ensure JavaScript is enabled

## Related Documentation

- [Report Collaboration System](./REPORT_COLLABORATION.md)
- [Custom Report Builder](./CUSTOM_REPORT_BUILDER.md)
- [Comment Thread System](./REPORT_COLLABORATION.md#comment-system)

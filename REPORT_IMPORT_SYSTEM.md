# Report Import System

## Overview
The custom report builder now supports importing reports from exported JSON files with comprehensive validation, conflict resolution, and import history tracking.

## Features

### 1. JSON File Import
- **Single File Import**: Import one report at a time
- **Batch Import**: Import multiple reports from multiple JSON files simultaneously
- **Drag & Drop**: Easy file selection interface

### 2. Validation
The system validates all imported reports for:
- Required fields (name, sections)
- Valid JSON structure
- Data integrity

### 3. Conflict Resolution
When importing reports with names that already exist, choose from:
- **Skip**: Skip conflicting reports
- **Rename**: Add "(Imported)" suffix to conflicting names
- **Overwrite**: Replace existing reports with imported versions

### 4. Preview Before Import
- View all reports to be imported
- See validation errors before proceeding
- Review conflict warnings
- Confirm import settings

### 5. Import History Tracking
Tracks all import operations with:
- Date and time of import
- User who performed the import
- File names imported
- Success/failure counts
- Conflict resolution details

## Usage

### Importing Reports

1. **Navigate to Report Library**
   - Go to Admin Dashboard → Custom Reports
   - Click "Import" button in the toolbar

2. **Select Files**
   - Click to browse or drag files
   - Select one or more JSON files
   - System validates files automatically

3. **Review Preview**
   - Check list of reports to import
   - Review any validation errors
   - Note any naming conflicts

4. **Resolve Conflicts** (if any)
   - Choose conflict resolution strategy:
     - Skip conflicting reports
     - Rename with suffix
     - Overwrite existing

5. **Complete Import**
   - Click "Import Reports"
   - View success/failure summary
   - Reports appear in library

### Viewing Import History

Import history is displayed below the report library showing:
- Import date/time
- File name(s)
- User email
- Total reports in file
- Successful imports
- Failed imports
- Conflicts resolved

## JSON Format

Reports should be exported in this format:

```json
{
  "name": "Monthly Revenue Report",
  "description": "Comprehensive monthly revenue analysis",
  "sections": [
    {
      "id": "section-1",
      "type": "chart",
      "title": "Revenue Chart",
      "config": {}
    }
  ],
  "branding": {
    "primary_color": "#3b82f6",
    "secondary_color": "#8b5cf6",
    "logo_url": ""
  }
}
```

Or as an array for multiple reports:

```json
[
  { "name": "Report 1", "sections": [...] },
  { "name": "Report 2", "sections": [...] }
]
```

## Database Schema

### import_history Table
```sql
- id: UUID (primary key)
- imported_by: UUID (references auth.users)
- import_date: TIMESTAMP
- file_name: TEXT
- reports_count: INTEGER
- successful_imports: INTEGER
- failed_imports: INTEGER
- conflicts_resolved: INTEGER
- import_details: JSONB
```

## Edge Function

**Function**: `import-reports`

Handles server-side import processing:
- Validates report structure
- Checks for naming conflicts
- Applies conflict resolution
- Inserts reports into database
- Returns detailed results

## Best Practices

1. **Backup Before Overwrite**: Always backup existing reports before using overwrite mode
2. **Review Validation Errors**: Fix any validation errors in source files before importing
3. **Use Descriptive Names**: Ensure imported reports have unique, descriptive names
4. **Check Import History**: Review import history to track changes and troubleshoot issues
5. **Test with Small Batches**: Test import process with a few reports before bulk importing

## Troubleshooting

### Import Fails
- Check JSON syntax is valid
- Ensure required fields (name, sections) are present
- Verify file is not corrupted

### Conflicts Not Resolving
- Ensure conflict resolution option is selected
- Check that existing reports are accessible
- Verify permissions to modify reports

### Missing Import History
- Confirm user is authenticated
- Check database connection
- Verify RLS policies are configured

## Security

- Import history tracks all operations for audit purposes
- Only authenticated users can import reports
- RLS policies protect import history data
- Validation prevents malicious data injection

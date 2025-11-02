# Batch History Export System

## Overview
The batch history export system allows administrators to export and analyze operation batching data from the collaborative report editor. This provides insights into editing patterns, productivity metrics, and peak activity times.

## Features

### 1. Export Formats
- **CSV Export**: Comma-separated values for spreadsheet analysis
- **JSON Export**: Structured data for programmatic processing
- **Analytics Report**: Human-readable text report with insights

### 2. Filtering Options
- **Date Range**: Filter batches by start and end date
- **Field Type**: Filter by specific report fields (title, description, etc.)
- **Operation Count**: Filter by minimum and maximum operations per batch

### 3. Analytics Metrics
- **Total Batches**: Number of completed batches
- **Total Operations**: Sum of all operations across batches
- **Average Batch Size**: Mean operations per batch
- **Operations Per Minute**: Typing/editing speed metric
- **Peak Activity Time**: Hour with most operations
- **Field Type Distribution**: Breakdown of edits by field

## Usage

### Exporting Data

1. Open the Custom Report Builder
2. Click "Batch History" to view the batch history panel
3. Configure filters in the "Export Batch History" section:
   - Set date range (optional)
   - Select field type (optional)
   - Set operation count range (optional)
4. Click the desired export button:
   - **CSV**: Download spreadsheet-compatible file
   - **JSON**: Download structured data file
   - **Report**: Download analytics text report

### CSV Format
```csv
Timestamp,Duration (ms),Operations,Field Type,Preview
2025-10-08T22:30:15.000Z,1500,12,title,"Updated report title"
```

### JSON Format
```json
[
  {
    "id": "batch-123",
    "timestamp": 1728425415000,
    "duration": 1500,
    "operationCount": 12,
    "preview": "Updated report title",
    "fieldType": "title"
  }
]
```

### Analytics Report Format
```
BATCH HISTORY ANALYTICS REPORT
Generated: 2025-10-08T22:30:00.000Z

SUMMARY STATISTICS
==================
Total Batches: 45
Total Operations: 523
Average Batch Size: 11.6 operations
Operations Per Minute: 34.9
Peak Activity Time: 14:00 (87 ops)

FIELD TYPE DISTRIBUTION
=======================
title: 12 batches
description: 18 batches
sections: 15 batches
```

## Integration

### Component Structure
```
BatchHistoryPanel
├── BatchHistoryStats (statistics display)
├── BatchHistoryExport (export controls)
└── Timeline & Chart (visualization)
```

### Utility Functions
Located in `src/lib/batchHistoryExport.ts`:
- `generateCSV()`: Creates CSV string from batch data
- `generateJSON()`: Creates formatted JSON string
- `calculateProductivityMetrics()`: Computes analytics metrics
- `generateAnalyticsReport()`: Creates text report

## Use Cases

### 1. Performance Analysis
Export batch history to analyze editing patterns and identify bottlenecks in the collaborative editing workflow.

### 2. User Behavior Insights
Track peak activity times and field type preferences to optimize the editor interface and features.

### 3. Productivity Metrics
Calculate typing speed and batch efficiency to measure editor performance and user productivity.

### 4. Data-Driven Improvements
Use exported data to make informed decisions about batch delay settings, undo/redo granularity, and UI optimizations.

## Technical Details

### Filter Implementation
Filters are applied client-side before export:
```typescript
const filterBatches = () => {
  return batches.filter(b => {
    if (startDate && b.timestamp < new Date(startDate).getTime()) return false;
    if (endDate && b.timestamp > new Date(endDate).getTime()) return false;
    if (fieldType !== 'all' && b.fieldType !== fieldType) return false;
    if (minOps && b.operationCount < parseInt(minOps)) return false;
    if (maxOps && b.operationCount > parseInt(maxOps)) return false;
    return true;
  });
};
```

### Download Mechanism
Files are downloaded using Blob URLs:
```typescript
const blob = new Blob([content], { type });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
a.click();
URL.revokeObjectURL(url);
```

## Related Documentation
- [Operation Batching](./OPERATION_BATCHING.md)
- [Batching Visual Indicator](./BATCHING_VISUAL_INDICATOR.md)
- [Bulk Report Operations](./BULK_REPORT_OPERATIONS.md)

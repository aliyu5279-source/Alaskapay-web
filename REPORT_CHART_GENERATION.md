# Report Chart Generation System

## Overview
The report system now includes comprehensive chart generation capabilities for both PDF and Excel exports. Charts are automatically embedded in reports with customizable types, colors, and data series.

## Features

### Chart Types
- **Bar Charts**: Column-based visualizations for comparing values
- **Line Charts**: Trend analysis over time or sequences
- **Pie Charts**: Proportional distribution displays

### Chart Configuration
Charts are configured in the Custom Report Builder with the following options:

```typescript
{
  id: string;
  type: 'bar' | 'line' | 'pie';
  title: string;
  dataSource: string;  // e.g., 'chartData.userGrowth'
  colors: string[];    // Array of hex colors
  series: string[];    // Data field names to plot
}
```

## Usage

### 1. Configure Charts in Report Builder

1. Open Custom Report Builder
2. Click the "Charts" button in the toolbar
3. Click "Add Chart" to create a new chart
4. Configure:
   - **Chart Title**: Display name for the chart
   - **Chart Type**: Select bar, line, or pie
   - **Data Source**: Path to data in report (e.g., `chartData.userGrowth`)
   - **Colors**: Add/edit color palette for chart elements
   - **Data Series**: Specify which fields to plot

### 2. Chart Configuration Panel

The ChartConfigPanel component provides:
- Visual chart type selection with icons
- Color picker for each series
- Dynamic series field management
- Data source path configuration
- Remove/reorder charts

### 3. PDF Export with Charts

Charts in PDF reports are rendered as SVG images:
- High-quality vector graphics
- Embedded directly in PDF HTML
- Responsive sizing
- Custom branding colors applied

**PDF Chart Features:**
- Bar charts with labeled axes
- Line charts with smooth curves
- Pie charts with proportional slices
- Auto-scaling based on data ranges

### 4. Excel Export with Charts

Excel exports include native Excel chart objects:
- Charts embedded in dedicated sheet
- Chart data in separate data sheets
- Excel-native chart types
- Editable in Excel after export

**Excel Chart Features:**
- ColumnClustered (bar charts)
- Line charts
- Pie charts
- Linked to data sheets for editing

## Data Structure

### Chart Data Format

Data should be structured as arrays of objects:

```javascript
// For bar and line charts
chartData.userGrowth = [
  { label: 'Day 1', users: 500, sessions: 1000 },
  { label: 'Day 2', users: 600, sessions: 1200 },
  // ...
];

// For pie charts
chartData.revenueBySource = [
  { label: 'Direct', value: 5000 },
  { label: 'Organic', value: 3000 },
  { label: 'Referral', value: 2000 }
];
```

## Edge Functions

### generate-pdf-report
Generates PDF with embedded SVG charts:
- Accepts `chartConfig` parameter
- Renders charts using SVG
- Embeds as base64 data URIs
- Maintains aspect ratios

### generate-excel-report
Generates Excel with native charts:
- Creates chart sheets
- Generates data sheets
- Links charts to data
- Applies chart styling

### schedule-report
Passes chart configurations to generators:
- Retrieves `chart_config` from templates
- Sends to both PDF and Excel generators
- Includes charts in scheduled deliveries

## Database Schema

### custom_report_templates
```sql
chart_config JSONB DEFAULT '[]'::jsonb
```

Stores array of chart configurations:
```json
[
  {
    "id": "chart-1",
    "type": "bar",
    "title": "User Growth",
    "dataSource": "chartData.userGrowth",
    "colors": ["#3b82f6", "#8b5cf6"],
    "series": ["users", "sessions"]
  }
]
```

## API Integration

### Generating Reports with Charts

```javascript
// PDF with charts
const pdfResponse = await fetch('/functions/v1/generate-pdf-report', {
  method: 'POST',
  body: JSON.stringify({
    reportData: { /* data */ },
    templateName: 'Monthly Report',
    dateRange: { start: '2024-01-01', end: '2024-01-31' },
    branding: { /* branding */ },
    chartConfig: [
      {
        type: 'bar',
        title: 'User Growth',
        dataSource: 'chartData.userGrowth',
        colors: ['#3b82f6'],
        series: ['users']
      }
    ]
  })
});

// Excel with charts
const excelResponse = await fetch('/functions/v1/generate-excel-report', {
  method: 'POST',
  body: JSON.stringify({
    // Same parameters as PDF
  })
});
```

## Chart Rendering Details

### SVG Generation (PDF)
- Dynamic SVG creation based on data
- Automatic scaling and positioning
- Color application from config
- Text labels and axes

### Excel Chart XML
- Native Excel chart format
- ChartObjects with series data
- Color and style attributes
- Data range references

## Best Practices

1. **Data Source Paths**: Use dot notation for nested data
2. **Color Selection**: Provide contrasting colors for multiple series
3. **Series Names**: Use descriptive field names
4. **Chart Titles**: Clear, concise descriptions
5. **Data Quality**: Ensure data arrays are properly formatted

## Example: Complete Chart Configuration

```javascript
const chartConfig = [
  {
    id: 'chart-1',
    type: 'line',
    title: 'User Activity Trends',
    dataSource: 'chartData.userGrowth',
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    series: ['users', 'sessions', 'pageviews']
  },
  {
    id: 'chart-2',
    type: 'pie',
    title: 'Traffic Sources',
    dataSource: 'chartData.trafficSources',
    colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
    series: ['value']
  }
];
```

## Troubleshooting

**Charts not appearing:**
- Verify data source path is correct
- Check data format matches expected structure
- Ensure series names exist in data objects

**Colors not applied:**
- Provide valid hex color codes
- Include enough colors for all series
- Check branding color conflicts

**Excel charts not editable:**
- Verify chart data sheets are created
- Check chart-to-data linking
- Ensure Excel format is valid

## Future Enhancements
- Area charts
- Scatter plots
- Stacked bar charts
- Custom axis labels
- Interactive chart legends
- Chart templates

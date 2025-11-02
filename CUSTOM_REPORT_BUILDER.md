# Custom Report Builder

## Overview
The Custom Report Builder allows administrators to create personalized analytics reports with drag-and-drop functionality, custom branding, and flexible section configuration.

## Features

### 1. Drag-and-Drop Interface
- Reorder report sections by dragging
- Visual feedback during drag operations
- Intuitive section management

### 2. Section Types
- **Metric Cards**: Display single KPIs with trends
- **Line Charts**: Time series visualization
- **Bar Charts**: Comparison data
- **Pie Charts**: Distribution analysis
- **Data Tables**: Detailed records
- **User Stats**: User-specific metrics
- **Email Stats**: Email engagement data
- **Revenue Stats**: Financial metrics

### 3. Section Configuration
Each section can be configured with:
- Custom title
- Date range (7d, 30d, 90d, YTD, 1y)
- Specific metrics to display
- Comparison with previous period
- Trend line visibility
- Conditional formatting rules

### 4. Custom Branding
- Upload custom logo
- Set primary brand color
- Set secondary brand color
- Apply branding across all report sections

### 5. Report Templates
- Save custom report configurations
- Load and reuse templates
- Share templates with team members
- Track template usage statistics

### 6. Preview & Export
- Live preview before generation
- Export to PDF format
- Export to Excel format
- Email reports directly

## Usage

### Creating a Custom Report

1. **Navigate to Custom Report Builder**
   ```typescript
   // Access from Admin Dashboard
   <CustomReportBuilder />
   ```

2. **Add Report Details**
   - Enter report name
   - Add description
   - Configure branding (optional)

3. **Add Sections**
   - Click "Add Section" button
   - Select section type from palette
   - Configure section settings

4. **Reorder Sections**
   - Drag sections using the grip handle
   - Drop in desired position

5. **Configure Each Section**
   - Click settings icon on section
   - Select date range
   - Choose metrics to display
   - Enable comparison/trends

6. **Preview Report**
   - Click "Preview" button
   - Review layout and data
   - Make adjustments as needed

7. **Save Template**
   - Click "Save" button
   - Template is stored for reuse

### Section Configuration Options

```typescript
{
  id: 'section-123',
  type: 'line-chart',
  title: 'User Growth',
  config: {
    dateRange: '30d',
    metric: 'users',
    showComparison: true,
    showTrend: true,
    rowsPerPage: 10 // for tables
  }
}
```

### Branding Configuration

```typescript
{
  logo_url: 'https://example.com/logo.png',
  primary_color: '#3b82f6',
  secondary_color: '#8b5cf6'
}
```

## Database Schema

### custom_report_templates Table
```sql
- id: UUID (primary key)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
- created_by: UUID (references auth.users)
- name: TEXT
- description: TEXT
- template_type: TEXT
- is_default: BOOLEAN
- branding: JSONB
- sections: JSONB
- filters: JSONB
- share_with: TEXT[]
- is_public: BOOLEAN
- usage_count: INTEGER
- last_used_at: TIMESTAMPTZ
```

## API Endpoints

### Save Template
```typescript
const { data } = await supabase.functions.invoke('manage-custom-reports', {
  body: {
    action: 'save',
    template: {
      name: 'Q4 Executive Report',
      description: 'Quarterly metrics',
      branding: { ... },
      sections: [ ... ]
    }
  }
});
```

### Load Template
```typescript
const { data } = await supabase.functions.invoke('manage-custom-reports', {
  body: {
    action: 'load',
    templateId: 'template-uuid'
  }
});
```

### Generate Report
```typescript
const { data } = await supabase.functions.invoke('generate-custom-report', {
  body: {
    templateId: 'template-uuid',
    format: 'pdf',
    filters: { ... }
  }
});
```

## Best Practices

1. **Organize Sections Logically**
   - Start with high-level metrics
   - Follow with detailed charts
   - End with data tables

2. **Use Consistent Branding**
   - Apply company colors
   - Include logo on all reports
   - Maintain visual consistency

3. **Configure Date Ranges Appropriately**
   - Match section date ranges to analysis needs
   - Use comparison periods for context
   - Consider seasonal variations

4. **Optimize for Stakeholders**
   - Executive reports: High-level metrics
   - Detailed reports: Comprehensive data
   - Campaign reports: Specific metrics

5. **Test Before Sharing**
   - Preview reports before sending
   - Verify data accuracy
   - Check formatting on different devices

## Components

- `CustomReportBuilder`: Main builder interface
- `SectionPalette`: Section type selector
- `ReportSection`: Individual section component
- `SectionConfig`: Section configuration panel
- `BrandingConfig`: Branding settings
- `ReportPreview`: Preview modal

## Future Enhancements

- Real-time collaboration
- Version control for templates
- Advanced conditional formatting
- Custom chart types
- Automated insights generation
- AI-powered recommendations

# Export Template System

A comprehensive template system for scheduled batch history exports with reusable configurations, template sharing, and quick-apply functionality.

## Features

### Template Management
- **Create Templates**: Save export configurations as reusable templates
- **Template Categories**: Organize templates by type (daily reports, weekly summaries, monthly analytics, custom)
- **Clone Templates**: Duplicate existing templates for quick customization
- **Template Versioning**: Track template usage and last used dates

### Template Sharing
- **Public Templates**: Make templates available to all users
- **User Sharing**: Share templates with specific users
- **Permission Control**: Grant view-only or edit access
- **Share Management**: View and revoke template shares

### Quick Apply
- **One-Click Apply**: Create scheduled exports from templates instantly
- **Schedule Customization**: Adjust frequency and timing when applying
- **Preview Before Apply**: Review template configuration before creating schedule
- **Usage Tracking**: Monitor template popularity and effectiveness

## Database Schema

### export_templates
```sql
- id: UUID (primary key)
- name: VARCHAR(255) - Template name
- description: TEXT - Template description
- category: VARCHAR(50) - Template category
- export_format: VARCHAR(10) - CSV, JSON, or both
- filters: JSONB - Filter configuration
- include_analytics: BOOLEAN - Include analytics in export
- email_recipients: TEXT[] - Email delivery list
- email_subject: VARCHAR(255) - Email subject line
- email_body: TEXT - Email body content
- created_by: UUID - Template creator
- is_public: BOOLEAN - Public visibility
- usage_count: INTEGER - Times template used
- last_used_at: TIMESTAMPTZ - Last usage timestamp
```

### template_shares
```sql
- id: UUID (primary key)
- template_id: UUID - Reference to template
- shared_with: UUID - User receiving access
- can_edit: BOOLEAN - Edit permission
- shared_by: UUID - User who shared
```

## API Functions

### manage-export-templates
Edge function handling all template operations:

**Actions:**
- `list`: Get all accessible templates
- `create`: Create new template
- `update`: Modify existing template
- `delete`: Remove template
- `clone`: Duplicate template
- `apply`: Create scheduled export from template
- `share`: Share template with user
- `unshare`: Remove template share

## UI Components

### ExportTemplateLibrary
Main template browsing interface with:
- Category tabs (All, Daily Reports, Weekly Summaries, Monthly Analytics, Custom)
- Template cards with metadata
- Quick action buttons (Preview, Apply, Clone, Share, Delete)
- Usage statistics display

### TemplatePreviewModal
Detailed template configuration viewer showing:
- Export format and analytics settings
- Applied filters
- Email delivery configuration
- Usage statistics

### ApplyTemplateModal
Template application interface with:
- Schedule name customization
- Frequency selection (daily, weekly, monthly)
- Execution time picker
- Enable/disable toggle
- Template configuration summary

### ShareTemplateModal
Template sharing management with:
- Public/private toggle
- User email search
- Edit permission control
- Active shares list
- Share revocation

### CreateTemplateModal
Template creation interface with:
- Name and description fields
- Category selection
- Export format options
- Analytics toggle
- Email configuration
- Public visibility toggle

## Usage Examples

### Creating a Template
```typescript
const { data, error } = await supabase.functions.invoke('manage-export-templates', {
  body: {
    action: 'create',
    templateData: {
      name: 'Daily Activity Report',
      description: 'Daily summary of batch editing activity',
      category: 'daily_reports',
      export_format: 'csv',
      include_analytics: true,
      filters: {
        dateRange: { from: 'today', to: 'today' }
      },
      email_recipients: ['admin@example.com'],
      email_subject: 'Daily Activity Report',
      is_public: false
    }
  }
});
```

### Applying a Template
```typescript
const { data, error } = await supabase.functions.invoke('manage-export-templates', {
  body: {
    action: 'apply',
    templateId: 'template-uuid',
    scheduleData: {
      name: 'Daily Report Schedule',
      frequency: 'daily',
      schedule_time: '09:00',
      enabled: true
    }
  }
});
```

### Sharing a Template
```typescript
const { data, error } = await supabase.functions.invoke('manage-export-templates', {
  body: {
    action: 'share',
    templateId: 'template-uuid',
    templateData: {
      sharedWith: 'user-uuid',
      canEdit: true
    }
  }
});
```

## Integration

### BatchHistoryExport Component
Includes "Save as Template" button to create templates from current export settings.

### ReportLibrary Component
Features dedicated "Export Templates" tab for browsing and managing templates.

### ScheduledExportsManager
Allows applying templates when creating new scheduled exports.

## Best Practices

1. **Template Naming**: Use descriptive names indicating purpose and frequency
2. **Categories**: Choose appropriate category for easy discovery
3. **Descriptions**: Provide clear descriptions of template purpose
4. **Email Configuration**: Set up email templates for consistent delivery
5. **Public Templates**: Share commonly used configurations as public templates
6. **Regular Review**: Monitor usage statistics to identify popular templates

## Security

- Row Level Security (RLS) enforces access control
- Users can only edit their own templates or shared templates with edit permission
- Public templates are read-only for non-owners
- Template shares require explicit user IDs

## Future Enhancements

- Template import/export for backup
- Template scheduling recommendations based on usage patterns
- Template performance analytics
- Template marketplace for sharing across organizations
- Template version history and rollback

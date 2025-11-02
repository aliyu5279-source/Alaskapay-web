# Email Template Management System

## Overview
Complete email template management system with visual editor, version history, preview, and testing capabilities.

## Database Tables

### email_templates
Stores reusable email templates with HTML/CSS styling and variable placeholders.

### email_template_versions
Tracks version history for templates with automatic versioning on updates.

## Edge Functions

### manage-email-templates
- **Actions**: create, update, list, get, delete
- **Features**: Automatic version creation on updates
- **Usage**: Main CRUD operations for templates

### get-template-versions
- **Purpose**: Retrieve version history for a template
- **Returns**: List of all versions with content

### test-email-template
- **Purpose**: Send test emails with sample data
- **Features**: Variable replacement, SendGrid integration
- **Usage**: Test templates before deployment

## Admin UI Components

### TemplateManagementTab
Main interface for managing templates with list view and actions.

### TemplateEditor
Visual editor for creating/editing templates with:
- Name, description, category, status
- Subject line with variable support
- HTML content editor
- Plain text content (optional)
- Variable management (add/remove)

### TemplatePreview
Live preview with sample data:
- Input sample values for variables
- Real-time rendering of subject and content
- Side-by-side view of data and preview

### TemplateVersionHistory
View and compare template versions:
- Chronological list of all versions
- View full content of any version
- Track changes over time

### TemplateTestModal
Send test emails before deployment:
- Enter test email address
- Provide sample data for variables
- Send via SendGrid with [TEST] prefix

## Template Variables

Use `{{variable_name}}` syntax in templates:
- Subject: "Welcome {{user_name}}!"
- Content: "<h1>Hello {{user_name}}</h1>"

Variables are automatically replaced when sending emails.

## Template Categories
- general: General purpose emails
- transactional: Transaction receipts, confirmations
- marketing: Promotional emails
- notification: System notifications, alerts

## Template Status
- draft: Work in progress, not ready for use
- active: Ready for production use
- archived: Deprecated, kept for history

## Integration Example

```typescript
// Get template and send email
const { data: template } = await supabase
  .from('email_templates')
  .select('*')
  .eq('name', 'welcome_email')
  .single();

// Replace variables
let html = template.html_content;
html = html.replace(/{{user_name}}/g, userData.name);
html = html.replace(/{{user_email}}/g, userData.email);

// Send via SendGrid
await sendEmail({
  to: userData.email,
  subject: template.subject.replace(/{{user_name}}/g, userData.name),
  html: html
});
```

## Best Practices

1. **Version Control**: Every update creates a new version automatically
2. **Testing**: Always test templates before marking as active
3. **Variables**: Document all variables in template description
4. **Plain Text**: Provide plain text version for email clients that don't support HTML
5. **Responsive Design**: Use responsive HTML/CSS for mobile compatibility
6. **Preview**: Use preview feature with realistic sample data

## Access Control

Templates are managed through the Admin Dashboard:
- Navigate to "Email Templates" in admin sidebar
- Requires authenticated user access
- All actions are logged for audit trail

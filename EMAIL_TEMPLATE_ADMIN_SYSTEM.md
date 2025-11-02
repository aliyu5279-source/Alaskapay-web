# Email Template Admin System

Complete admin dashboard for managing email templates with visual editor, A/B testing, versioning, and rollback capabilities.

## Features

### 1. Visual Template Editor
- **WYSIWYG Editor**: Create templates without writing code
- **Drag-and-Drop Elements**: Insert headings, paragraphs, buttons, images, dividers
- **Variable Insertion**: Click to insert dynamic variables
- **Live Preview**: See changes in real-time
- **Code Editor**: Switch to HTML mode for advanced editing

### 2. Template Library
- **Pre-built Templates**: Welcome emails, password resets, receipts
- **One-Click Import**: Use templates as starting points
- **Customizable**: Edit any template to match your brand
- **Categories**: Transactional, marketing, notification templates

### 3. Template Management
- **CRUD Operations**: Create, read, update, delete templates
- **Status Management**: Draft, active, archived states
- **Template Categories**: Organize by type
- **Search & Filter**: Find templates quickly
- **Duplicate Templates**: Clone existing templates

### 4. A/B Testing
- **Create Tests**: Compare two template variations
- **Traffic Split**: Control percentage split (50/50, 70/30, etc.)
- **Goal Metrics**: Track open rate, click rate, conversion rate
- **Test Controls**: Start, pause, complete tests
- **Results Dashboard**: View performance metrics
- **Statistical Significance**: Determine winning variant

### 5. Version Control
- **Automatic Versioning**: Every save creates a new version
- **Version History**: View all previous versions
- **Rollback**: Restore any previous version
- **Change Tracking**: See what changed between versions
- **Version Comparison**: Compare two versions side-by-side

### 6. Template Preview
- **Live Preview**: See how emails will look
- **Variable Testing**: Enter test values for variables
- **Subject Line Preview**: Preview with variables
- **Responsive Preview**: Desktop and mobile views
- **Send Test Email**: Send preview to your inbox

## Database Schema

```sql
-- Email Templates Table
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables TEXT[],
  category TEXT DEFAULT 'general',
  status TEXT DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  parent_template_id UUID REFERENCES email_templates(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template Version History
CREATE TABLE email_template_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES email_templates(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B Tests
CREATE TABLE email_ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  template_a_id UUID REFERENCES email_templates(id),
  template_b_id UUID REFERENCES email_templates(id),
  traffic_split INTEGER DEFAULT 50,
  goal_metric TEXT DEFAULT 'open_rate',
  status TEXT DEFAULT 'draft',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  winner_template_id UUID REFERENCES email_templates(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B Test Results
CREATE TABLE email_ab_test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES email_ab_tests(id) ON DELETE CASCADE,
  template_id UUID REFERENCES email_templates(id),
  variant TEXT, -- 'A' or 'B'
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  converted_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_templates_status ON email_templates(status);
CREATE INDEX idx_templates_category ON email_templates(category);
CREATE INDEX idx_template_versions_template ON email_template_versions(template_id);
CREATE INDEX idx_ab_tests_status ON email_ab_tests(status);
```

## Components

### TemplateManagementTab
Main interface for managing templates with list view and actions.

### VisualTemplateEditor
WYSIWYG editor with element insertion and variable management.

### TemplateLibrary
Pre-built template collection for quick starts.

### TemplatePreviewModal
Preview templates with variable substitution testing.

### TemplateVersionHistory
View and rollback to previous template versions.

### ABTestingTab
Create and manage A/B tests with results tracking.

## Usage

### Creating a Template

1. Navigate to Admin Dashboard → Email Templates
2. Click "New Template"
3. Choose from template library or start from scratch
4. Use visual editor to design email
5. Add variables for dynamic content
6. Preview and test
7. Save as draft or activate

### Running A/B Tests

1. Go to A/B Testing tab
2. Click "Create A/B Test"
3. Select two template variants
4. Set traffic split and goal metric
5. Start test
6. Monitor results
7. Complete test and select winner

### Rolling Back Changes

1. Open template editor
2. Click "History" button
3. View all versions
4. Click "Rollback" on desired version
5. Confirm rollback

## API Endpoints

### Edge Function: manage-email-templates

```typescript
// List all templates
POST /functions/v1/manage-email-templates
{ action: 'list' }

// Get template
POST /functions/v1/manage-email-templates
{ action: 'get', templateId: 'uuid' }

// Create template
POST /functions/v1/manage-email-templates
{ action: 'create', template: { name, subject, html_content, ... } }

// Update template
POST /functions/v1/manage-email-templates
{ action: 'update', template: { id, name, subject, ... } }

// Delete template
POST /functions/v1/manage-email-templates
{ action: 'delete', template: { id } }
```

## Best Practices

1. **Always test templates** before activating
2. **Use variables** for personalization
3. **Create versions** before major changes
4. **Run A/B tests** to optimize performance
5. **Monitor metrics** regularly
6. **Keep templates simple** and focused
7. **Test across email clients** (Gmail, Outlook, etc.)
8. **Include plain text version** for accessibility
9. **Use responsive design** for mobile devices
10. **Follow email best practices** (CAN-SPAM, GDPR)

## Integration

Templates integrate with:
- Transactional email service
- Email campaign scheduler
- Automation rules
- User segmentation
- Analytics tracking

## Security

- Row-level security on all tables
- Admin-only access to template management
- Version history for audit trail
- Secure variable substitution
- XSS protection in preview

## Next Steps

1. Add more pre-built templates
2. Implement template marketplace
3. Add collaborative editing
4. Create template approval workflow
5. Add more A/B test metrics
6. Implement multivariate testing

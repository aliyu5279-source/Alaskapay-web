# Alaska Pay - Email Template Analytics & A/B Testing

## Overview
Comprehensive analytics system to track email template performance with open rates, click rates, conversion metrics, and A/B testing capabilities.

## Features Implemented

### 1. Database Tables
- `email_sends` - Tracks all email sends with template info, opens, clicks, conversions
- `email_clicks` - Individual click tracking with URL, user agent, IP
- `ab_tests` - A/B test campaign management

### 2. Edge Functions
- `track-email-send` - Record email sends with template ID
- `track-email-open` - Track opens via 1x1 pixel
- `track-email-click` - Track clicks and redirect to target URL
- `get-template-analytics` - Calculate performance metrics per template
- `manage-ab-tests` - Create, list, update, and view A/B test results

### 3. Admin UI Components
- **TemplateAnalyticsTab** - Dashboard with charts showing:
  - Total sent, avg open rate, avg click rate, total revenue
  - Bar chart comparing template performance
  - Detailed table with all metrics per template
- **ABTestingTab** - A/B testing interface with:
  - Create new A/B tests
  - Start/pause/complete tests
  - View results comparing variants
  - Traffic split configuration

### 4. Tracking Implementation
To track emails, add to your email HTML:
```html
<!-- Open tracking pixel -->
<img src="https://[project].supabase.co/functions/v1/track-email-open?id={emailSendId}" width="1" height="1" />

<!-- Click tracking -->
<a href="https://[project].supabase.co/functions/v1/track-email-click?id={emailSendId}&url={targetUrl}">Click Here</a>
```

### 5. Metrics Tracked
- **Send Metrics**: Total emails sent per template
- **Open Rate**: % of emails opened
- **Click Rate**: % of emails clicked
- **Click Count**: Total clicks per email
- **Conversion Rate**: % of emails that converted
- **Revenue**: Total and average revenue per email

## Usage

### View Analytics
1. Navigate to Admin Dashboard
2. Click "Template Analytics" in sidebar
3. View performance comparison charts
4. Export data for reporting

### Create A/B Test
1. Go to "A/B Testing" tab
2. Click "Create A/B Test"
3. Select two template variants
4. Choose goal metric (open/click/conversion rate)
5. Start test and monitor results

### Integration with Email Sending
When sending emails, call `track-email-send`:
```typescript
const { data } = await supabase.functions.invoke('track-email-send', {
  body: {
    templateId: 'template-uuid',
    templateVersion: 1,
    recipientEmail: 'user@example.com',
    userId: 'user-uuid',
    subject: 'Email Subject',
    abTestVariant: 'A' // or 'B' for A/B tests
  }
});
```

## Benefits
- Data-driven email optimization
- Identify best-performing templates
- A/B test subject lines, content, CTAs
- Track ROI from email campaigns
- Improve engagement over time

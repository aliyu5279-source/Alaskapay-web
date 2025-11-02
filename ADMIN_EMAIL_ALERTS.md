# Admin Email Alert System

## Overview
Alaska Pay's admin email alert system automatically sends email notifications to all admin users when critical events occur in the system. This provides real-time awareness of important system events requiring administrative attention.

## Features

### Automatic Email Notifications
- **Critical Alerts**: Sent immediately when critical events occur
- **Broadcast to All Admins**: Emails sent to all users with admin role
- **Preference-Based**: Respects individual admin email preferences
- **Professional Templates**: Branded email templates with actionable links

### Email Preferences for Admins
Admins can control which email alerts they receive:
- **Critical Admin Alerts**: Immediate notifications for critical system events (enabled by default)
- **Warning Admin Alerts**: Notifications for warning-level events (enabled by default)
- **Info Admin Alerts**: Informational notifications (disabled by default)

## Database Schema

### notification_preferences Table
```sql
ALTER TABLE notification_preferences 
ADD COLUMN admin_critical_alerts BOOLEAN DEFAULT true,
ADD COLUMN admin_warning_alerts BOOLEAN DEFAULT true,
ADD COLUMN admin_info_alerts BOOLEAN DEFAULT false;
```

## Email Template

### Critical Admin Alert Email
- **Subject**: 🚨 Critical Admin Alert - Alaska Pay
- **Content**: 
  - Event title and description
  - Event type and resource information
  - Timestamp
  - Direct link to admin dashboard
- **Styling**: Professional red-themed alert design

## Integration

### create-admin-notification Edge Function
When a critical notification is created:
1. Notification is inserted into `admin_notifications` table
2. System fetches all admin users from `profiles` table
3. For each admin, checks their email preferences
4. Sends email via `send-security-alert` function if preferences allow
5. Real-time notification appears in admin notification bell

### Usage Example
```typescript
// Create critical admin notification (automatically sends emails)
await supabase.functions.invoke('create-admin-notification', {
  body: {
    notification_type: 'user_suspended',
    severity: 'critical',  // Triggers email alerts
    title: 'User Account Suspended',
    message: 'User account has been suspended by admin',
    resource_type: 'user',
    resource_id: userId,
    metadata: { reason: 'Suspicious activity' }
  }
});
```

## Managing Email Preferences

### For Admins
1. Navigate to Profile → Notification Preferences
2. Scroll to "Admin Email Alerts" section (visible only to admins)
3. Toggle preferences for each alert level
4. Click "Save Preferences"

### Preference Levels
- **Critical**: High-priority events requiring immediate attention
- **Warning**: Important events that should be reviewed soon
- **Info**: Informational events for awareness only

## Email Delivery

### SendGrid Integration
- Uses existing SendGrid API configuration
- Sends from: noreply@alaskapay.com
- Professional HTML email templates
- Includes direct links to admin dashboard

### Delivery Logic
```typescript
// Only send emails for critical notifications
if (severity === 'critical') {
  // Fetch all admins
  const admins = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('role', 'admin');

  // Send to each admin based on preferences
  for (const admin of admins) {
    const prefs = await getPreferences(admin.id);
    if (prefs.admin_critical_alerts !== false) {
      await sendEmail(admin.id, 'admin_critical_notification', metadata);
    }
  }
}
```

## Best Practices

### When to Use Critical Severity
- User account suspensions
- Large transaction overrides
- System security breaches
- Service outages
- Failed login attempt thresholds exceeded
- Unauthorized access attempts

### When to Use Warning Severity
- Service configuration changes
- Role permission modifications
- Unusual activity patterns
- Resource threshold warnings

### When to Use Info Severity
- Routine administrative actions
- System maintenance notifications
- Usage statistics summaries

## Testing

### Test Email Delivery
```typescript
// Create test critical notification
await supabase.functions.invoke('create-admin-notification', {
  body: {
    notification_type: 'test_alert',
    severity: 'critical',
    title: 'Test Critical Alert',
    message: 'This is a test of the admin email alert system',
    resource_type: 'system',
    metadata: { test: true }
  }
});
```

## Troubleshooting

### Emails Not Received
1. Check admin email preferences in notification_preferences table
2. Verify SendGrid API key is configured
3. Check SendGrid dashboard for delivery status
4. Verify admin user has valid email address in profiles table

### Duplicate Emails
- Each admin receives one email per critical notification
- Check that admin role is not duplicated in profiles table

## Security Considerations

- Email preferences stored securely in database
- Only users with admin role can see admin alert preferences
- Email content includes minimal sensitive information
- Links require authentication to access admin dashboard
- All email sending happens server-side via edge functions

## Future Enhancements

- [ ] Email digest option (batch notifications)
- [ ] Custom email frequency settings
- [ ] SMS alerts for critical events
- [ ] Slack/Teams integration
- [ ] Email templates for warning and info levels
- [ ] Admin notification dashboard with email history

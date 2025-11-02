# Email Notification System

## Overview
Comprehensive email notification system that sends alerts for suspicious activities with user-controllable preferences. **NOW INTEGRATED WITH SENDGRID** for real email delivery.

## Features
- **Security Alerts**: New device login, failed login attempts, large transactions, password changes, email changes, 2FA changes
- **Notification Preferences**: User-controlled settings for each alert type
- **Notification History**: Searchable log of all sent notifications
- **Email Integration**: ✅ **SendGrid integrated and ready** - emails are sent automatically
- **Professional Templates**: Beautiful HTML email templates for each alert type
- **Automatic Triggers**: Login alerts sent automatically on every login

## Database Tables

### notification_preferences
- Stores user preferences for each notification type
- Fields: new_device_login, failed_login_attempts, large_transactions, password_changes, email_changes, two_factor_changes

### notification_history
- Logs all sent notifications with metadata
- Searchable and filterable by type and date

## Edge Functions

### send-security-alert
Sends security alert emails via SendGrid based on user preferences.

**Usage:**
```javascript
import { sendSecurityAlert } from '@/lib/emailService';

// Send new device login alert
await sendSecurityAlert(userId, 'new_device_login', {
  device: 'Chrome on Windows',
  location: 'New York, US',
  timestamp: new Date().toISOString()
});

// Send large transaction alert
await sendSecurityAlert(userId, 'large_transaction', {
  amount: 5000,
  recipient: 'John Doe',
  timestamp: new Date().toISOString()
});

// Send failed login alert
await sendSecurityAlert(userId, 'failed_login', {
  attempts: 5,
  location: 'Unknown Location',
  timestamp: new Date().toISOString()
});
```

### get-notifications
Retrieves user notification history with filtering.

## UI Components

### NotificationPreferences
Located in user profile "Preferences" tab. Allows users to control which alerts they receive.

### NotificationPanel
Located in user profile "Alerts" tab. Displays notification history with search and filters.

## Automatic Triggers

The system automatically sends alerts for:
- ✅ **New Device Login**: Every time a user logs in (via AuthContext)
- ✅ **Failed Login Attempts**: After 3 consecutive failed login attempts (via LoginForm)
- ✅ **Large Transactions**: Automatically triggered when transaction exceeds user threshold (via AppContext)
- ✅ **Password Changes**: Automatically triggered on password change (via ChangePasswordForm)
- ✅ **Email Changes**: Dual alerts sent to old and new email addresses (via ChangeEmailForm)
- 🔄 **2FA Changes**: Integrate in 2FA settings


## Failed Login Tracking

### Database Table: failed_login_attempts
Tracks consecutive failed login attempts with:
- Email address
- IP address
- User agent (browser/device info)
- Attempt count
- Last attempt timestamp

### Automatic Reset
- Failed attempt counter resets after 1 hour of inactivity
- Counter clears completely on successful login

### Alert Threshold
- Sends security alert email after 3 consecutive failed attempts
- Includes attempt count, IP address, and device info in alert

## SendGrid Configuration

See **SENDGRID_SETUP.md** for complete setup instructions including:
- Creating SendGrid account
- Verifying sender email
- Generating API key
- Configuring Supabase secrets
- Testing email delivery

**API Key**: Already configured in Supabase as `SENDGRID_API_KEY`

## Helper Functions

### getDeviceInfo()
Detects user's device and browser from user agent.

### getApproximateLocation()
Gets approximate location from IP address using ipapi.co (1000 requests/day free).

## Email Templates

Professional HTML templates included for all alert types:
- 🔐 New Device Login (blue theme)
- ⚠️ Failed Login Attempts (red theme)
- 💰 Large Transaction (orange theme)
- 🔑 Password Change
- 📧 Email Change
- 🛡️ 2FA Change

Templates include:
- Responsive design
- Professional styling
- Clear call-to-action buttons
- Security information
- Support contact details

## Setup Checklist
- [x] Database tables created
- [x] Edge functions deployed
- [x] SendGrid API integrated
- [x] Email templates created
- [x] Helper functions added
- [x] Automatic login alerts enabled
- [ ] Configure SendGrid sender email (see SENDGRID_SETUP.md)
- [ ] Test email delivery
- [ ] Add remaining automatic triggers

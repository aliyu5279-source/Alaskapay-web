# Email Change Security Alerts

## Overview
Alaska Pay automatically sends security alert emails when users change their email address. The system sends alerts to **both the old and new email addresses** and requires email verification before the change takes effect.

## Features

### Dual Email Alerts
1. **Old Email Alert** - Security notification sent to current email
   - Notifies user of email change request
   - Includes device, IP, location, and timestamp
   - Warning if change was unauthorized
   
2. **New Email Verification** - Confirmation link sent to new email
   - Verification link must be clicked
   - Link expires in 24 hours
   - Email change only takes effect after verification

### Security Information Captured
- Device type and platform
- IP address
- Geographic location
- Timestamp of change request
- Old and new email addresses

## Implementation

### Database Schema
No additional tables needed - uses existing Supabase Auth system.

### Edge Functions

#### 1. send-security-alert
Handles sending security alerts to old email address.

**Alert Types:**
- `email_change_old` - Alert to current email
- `email_change_new` - Verification to new email

#### 2. verify-email-change
Verifies the confirmation token and updates user email.

**Token Format:** Base64 encoded `userId:newEmail:timestamp`

**Expiry:** 24 hours

### Frontend Component

**ChangeEmailForm** (`src/components/ChangeEmailForm.tsx`)
- Email input field
- Password confirmation required
- IP address detection
- Device information capture
- Dual email sending
- Success/error feedback

## User Flow

1. User enters new email and confirms password
2. System captures device info and IP address
3. Security alert sent to **old email** address
4. Verification link sent to **new email** address
5. User clicks verification link in new email
6. System verifies token and updates email
7. Email change complete

## Email Templates

### Old Email Alert
```
Subject: ⚠️ Email Change Request - Verification Required

A request was made to change your Alaska Pay email address.

Current Email: user@example.com
New Email: newuser@example.com
Device: Desktop Computer - Windows
IP Address: 192.168.1.1
Location: Nigeria
Time: Oct 5, 2025, 8:00 AM

⚠️ If you didn't request this change, secure your account immediately.
```

### New Email Verification
```
Subject: ✉️ Verify Your New Email Address

Please verify this email to complete your Alaska Pay email change.

Previous Email: user@example.com
New Email: newuser@example.com

[Verify Email Address Button]

Link expires in 24 hours.
```

## Integration

### In UserProfile Component
```typescript
import { ChangeEmailForm } from '@/components/ChangeEmailForm';

<TabsContent value="security">
  <ChangePasswordForm />
  <ChangeEmailForm />
  <TwoFactorSettings />
</TabsContent>
```

### Triggering Alerts
```typescript
// Send alert to old email
await supabase.functions.invoke('send-security-alert', {
  body: {
    userId: user.id,
    alertType: 'email_change_old',
    metadata: {
      oldEmail: user.email,
      newEmail: newEmail,
      device: deviceInfo,
      ipAddress: ipAddress,
      location: 'Nigeria',
      timestamp: new Date().toISOString()
    }
  }
});
```

## Testing

### Test Email Change Flow

1. **Login** to Alaska Pay
2. **Navigate** to Profile → Security tab
3. **Enter** new email address
4. **Confirm** password
5. **Check** old email inbox for security alert
6. **Check** new email inbox for verification link
7. **Click** verification link
8. **Verify** email is updated in profile

### Test Security Scenarios

1. **Unauthorized Change**
   - Old email receives alert
   - User can secure account before change takes effect

2. **Token Expiry**
   - Wait 24+ hours after request
   - Verification link should show expired error

3. **Invalid Password**
   - Enter wrong password
   - Should show error, no emails sent

## Security Benefits

1. **Dual Verification** - Both emails must be accessible
2. **Time-Limited** - 24-hour expiry prevents stale links
3. **Password Required** - Confirms user identity
4. **Audit Trail** - Device and IP logged
5. **Immediate Alert** - Old email notified instantly
6. **Reversible** - Change doesn't take effect until verified

## Configuration

### Notification Preferences
Users can enable/disable email change alerts in:
**Profile → Preferences → Email Changes**

### Edge Function URLs
- **send-security-alert**: `https://[project].supabase.co/functions/v1/send-security-alert`
- **verify-email-change**: `https://[project].supabase.co/functions/v1/verify-email-change`

## Troubleshooting

### Emails Not Received
- Check spam/junk folders
- Verify SendGrid API key configured
- Check notification preferences enabled

### Verification Link Expired
- Request new email change
- New verification link will be sent

### Email Not Updating
- Ensure verification link clicked
- Check browser console for errors
- Verify edge function deployed

## Future Enhancements

- [ ] Email change cooldown period (prevent frequent changes)
- [ ] SMS verification option
- [ ] Email change history log
- [ ] Admin approval for email changes
- [ ] Backup email address requirement

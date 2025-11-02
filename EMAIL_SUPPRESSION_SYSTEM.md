# Email Suppression List System

## Overview
The Email Suppression List system automatically prevents emails from being sent to problematic or invalid email addresses. It integrates with the bounce tracking system and provides manual management capabilities.

## Features

### 1. Automatic Suppression
- **Hard Bounces**: Automatically adds emails to suppression list on hard bounce
- **Webhook Integration**: SendGrid webhook handler auto-flags problematic addresses
- **Bounce Tracking**: Integrates with email_bounce_tracking table

### 2. Manual Management
- Add single or bulk email addresses
- Remove addresses from suppression list
- Set suppression type (permanent/temporary)
- Add notes and reasons for suppression
- Set expiration dates for temporary suppressions

### 3. Suppression Reasons
- `bounced` - Email bounced (hard bounce)
- `suspended` - Manually suspended by admin
- `manual` - Manually added by admin
- `spam_complaint` - User reported as spam
- `unsubscribe` - User unsubscribed
- `invalid` - Invalid email address

### 4. Suppression Types
- **Permanent**: Email will never receive emails again
- **Temporary**: Email suppressed until expiration date

## Database Tables

### email_suppression_list
```sql
- id: UUID (primary key)
- email: TEXT (unique, indexed)
- reason: TEXT (bounced, suspended, manual, spam_complaint, unsubscribe, invalid)
- suppression_type: TEXT (permanent, temporary)
- added_at: TIMESTAMPTZ
- added_by: UUID (references auth.users)
- expires_at: TIMESTAMPTZ (nullable, for temporary suppressions)
- notes: TEXT (nullable)
- bounce_count: INTEGER
- last_bounce_at: TIMESTAMPTZ
- metadata: JSONB
```

### email_suppression_history
```sql
- id: UUID (primary key)
- email: TEXT
- action: TEXT (added, removed, updated, expired)
- reason: TEXT
- performed_by: UUID (references auth.users)
- performed_at: TIMESTAMPTZ
- notes: TEXT
- metadata: JSONB
```

## Edge Functions

### check-email-suppression
Check if email address(es) are suppressed before sending.

**Request:**
```json
{
  "email": "user@example.com"
}
// OR for bulk check
{
  "emails": ["user1@example.com", "user2@example.com"]
}
```

**Response:**
```json
{
  "suppressed": true,
  "details": {
    "reason": "bounced",
    "type": "permanent",
    "addedAt": "2025-01-01T00:00:00Z",
    "notes": "Hard bounce - mailbox does not exist"
  }
}
```

### manage-suppression-list
Manage the suppression list (add, remove, list, export).

**Add Email(s):**
```json
{
  "action": "add",
  "email": "user@example.com",
  // OR
  "emails": ["user1@example.com", "user2@example.com"],
  "reason": "manual",
  "suppressionType": "permanent",
  "expiresAt": null,
  "notes": "User requested removal"
}
```

**Remove Email:**
```json
{
  "action": "remove",
  "email": "user@example.com",
  "notes": "Email verified as valid"
}
```

**List All:**
```json
{
  "action": "list"
}
```

**Export:**
```json
{
  "action": "export"
}
```

## Integration with Email Sending

### Before Sending Any Email
Always check the suppression list before sending:

```typescript
// Check if email is suppressed
const { data } = await supabase.functions.invoke('check-email-suppression', {
  body: { email: recipientEmail }
});

if (data.suppressed) {
  console.log(`Email ${recipientEmail} is suppressed: ${data.details.reason}`);
  return; // Don't send email
}

// Proceed with sending email
await sendEmail(recipientEmail, subject, body);
```

### Bulk Email Check
```typescript
const recipients = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

const { data } = await supabase.functions.invoke('check-email-suppression', {
  body: { emails: recipients }
});

// Filter out suppressed emails
const validRecipients = recipients.filter(
  email => !data.suppressedEmails[email]
);

// Send to valid recipients only
await sendBulkEmail(validRecipients, subject, body);
```

## Admin UI

### Suppression List Tab
Located at: Admin Dashboard → Suppression List (🚫)

**Features:**
- View all suppressed emails
- Add single or bulk emails
- Remove emails from suppression
- Export suppression list as CSV
- Filter by reason and type
- View suppression history

**Adding Emails:**
1. Click "Add Email" button
2. Enter single email or paste multiple (one per line)
3. Select reason (manual, bounced, spam_complaint, etc.)
4. Choose type (permanent or temporary)
5. If temporary, set expiration date
6. Add optional notes
7. Click "Add to List"

**Removing Emails:**
1. Find email in table
2. Click trash icon
3. Confirm removal

**Exporting:**
1. Click "Export" button
2. CSV file downloads with all suppression data

## Automatic Cleanup

### Expired Temporary Suppressions
The system automatically removes expired temporary suppressions:

```sql
-- Run periodically (can be triggered by cron or on query)
SELECT cleanup_expired_suppressions();
```

This function:
1. Logs expired suppressions to history
2. Deletes expired entries from suppression list

## Webhook Integration

The SendGrid webhook handler (`sendgrid-webhook-handler`) automatically:
1. Tracks all bounces and deliveries
2. Adds hard bounces to suppression list
3. Updates bounce tracking statistics
4. Logs suppression actions to history

## Best Practices

### 1. Check Before Every Send
Always check suppression list before sending any email:
```typescript
const isSuppressed = await checkEmailSuppression(email);
if (isSuppressed) return;
```

### 2. Use Temporary Suppressions Wisely
- Use for soft bounces that may resolve
- Set reasonable expiration dates (7-30 days)
- Monitor for repeated soft bounces

### 3. Document Suppressions
- Always add notes when manually suppressing
- Include reason for suppression
- Document resolution steps

### 4. Regular Audits
- Review suppression list monthly
- Remove verified valid emails
- Check for patterns in suppressions

### 5. Monitor Bounce Rates
- Keep overall bounce rate below 5%
- Investigate spikes in suppressions
- Review flagged emails regularly

## Monitoring

### Key Metrics
1. **Total Suppressed**: Count of all suppressed emails
2. **Suppression Rate**: Percentage of total recipients suppressed
3. **Permanent vs Temporary**: Ratio of suppression types
4. **Suppression Reasons**: Breakdown by reason

### Alerts
- Alert when suppression list grows rapidly
- Notify when bounce rate exceeds threshold
- Track manual suppressions by admins

## Troubleshooting

### Email Not Sending
1. Check if email is on suppression list
2. Review suppression reason and notes
3. Verify email validity
4. Remove from suppression if valid

### False Positives
1. Review bounce reason in tracking
2. Verify email address is correct
3. Check with recipient
4. Remove from suppression and mark as verified

### High Suppression Rate
1. Review email content for spam triggers
2. Check sender reputation
3. Verify email list quality
4. Review bounce reasons

## API Reference

### Check Suppression
```typescript
const { data } = await supabase.functions.invoke('check-email-suppression', {
  body: { email: 'user@example.com' }
});
```

### Add to Suppression
```typescript
const { data } = await supabase.functions.invoke('manage-suppression-list', {
  body: {
    action: 'add',
    email: 'user@example.com',
    reason: 'manual',
    suppressionType: 'permanent',
    notes: 'User requested'
  }
});
```

### Remove from Suppression
```typescript
const { data } = await supabase.functions.invoke('manage-suppression-list', {
  body: {
    action: 'remove',
    email: 'user@example.com'
  }
});
```

### Export List
```typescript
const { data } = await supabase.functions.invoke('manage-suppression-list', {
  body: { action: 'export' }
});
```

## Security

- RLS policies restrict access to authenticated admins
- All actions logged to suppression history
- Audit trail maintained for compliance
- Service role key required for edge functions

## Compliance

The suppression list helps maintain compliance with:
- CAN-SPAM Act
- GDPR email requirements
- Email service provider policies
- Industry best practices

## Future Enhancements

1. **Auto-verification**: Periodically verify suppressed emails
2. **Smart Suppression**: ML-based suppression predictions
3. **Bulk Import**: Import suppression lists from CSV
4. **Integration**: Sync with email service provider suppression lists
5. **Analytics**: Advanced suppression analytics and insights

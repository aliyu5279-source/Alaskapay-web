# SendGrid Webhook Handler Setup

This guide explains how to set up the SendGrid webhook handler to automatically track email delivery, opens, and clicks for admin digest emails.

## Overview

The `sendgrid-webhook-handler` edge function receives delivery events from SendGrid and updates the `digest_sends` table with real-time tracking data.

## Tracked Events

| Event Type | Action | Updates |
|------------|--------|---------|
| `delivered` | Email successfully delivered | `delivery_status = 'delivered'`, `delivered_at` timestamp |
| `open` | Email opened by recipient | `opened_at` timestamp |
| `click` | Link clicked in email | `clicked_at` timestamp |
| `bounce` | Email bounced | `delivery_status = 'failed'` |
| `dropped` | Email dropped by SendGrid | `delivery_status = 'failed'` |
| `deferred` | Delivery temporarily delayed | `delivery_status = 'pending'` |
| `spamreport` | Marked as spam | `delivery_status = 'failed'` |
| `unsubscribe` | Recipient unsubscribed | `delivery_status = 'failed'` |

## Setup Instructions

### 1. Get Your Webhook URL

Your webhook endpoint URL is:
```
https://psafbcbhbidnbzfsccsu.supabase.co/functions/v1/sendgrid-webhook-handler
```

### 2. Configure SendGrid Webhook

1. Log in to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Navigate to **Settings** → **Mail Settings** → **Event Webhook**
3. Click **Create new webhook**
4. Configure the webhook:
   - **Webhook Name**: Alaska Pay Digest Tracking
   - **HTTP POST URL**: Your webhook URL (from step 1)
   - **Security**: Enable "Signature Verification"
   - **Actions to track**: Select all events:
     - ✅ Delivered
     - ✅ Opened
     - ✅ Clicked
     - ✅ Bounced
     - ✅ Dropped
     - ✅ Spam Reports
     - ✅ Unsubscribes
     - ✅ Deferred
5. Click **Save**

### 3. Enable Event Tracking in Emails

The `send-admin-digest` function already includes tracking settings:
```typescript
tracking_settings: {
  click_tracking: { enable: true },
  open_tracking: { enable: true }
}
```

## Security

### Signature Verification

The webhook handler verifies all incoming requests using HMAC-SHA256 signature verification:

1. SendGrid sends signature in `x-twilio-email-event-webhook-signature` header
2. Timestamp sent in `x-twilio-email-event-webhook-timestamp` header
3. Handler computes expected signature: `HMAC-SHA256(timestamp + body, verification_key)`
4. Request rejected if signatures don't match

### Environment Variable

The verification key is stored securely:
```bash
SENDGRID_WEBHOOK_VERIFICATION_KEY=your_verification_key_here
```

## Testing the Webhook

### 1. Send a Test Digest

```typescript
const { data, error } = await supabase.functions.invoke('send-admin-digest', {
  body: { schedule: 'test' }
});
```

### 2. Check SendGrid Event Webhook

In SendGrid Dashboard:
1. Go to **Settings** → **Mail Settings** → **Event Webhook**
2. Click on your webhook
3. View **Recent Events** to see delivery status

### 3. Verify Database Updates

```sql
SELECT 
  id,
  admin_email,
  delivery_status,
  delivered_at,
  opened_at,
  clicked_at,
  created_at
FROM digest_sends
ORDER BY created_at DESC
LIMIT 10;
```

## Monitoring

### View Webhook Logs

Check edge function logs:
```bash
supabase functions logs sendgrid-webhook-handler
```

### Common Log Messages

- ✅ `Processed X events successfully`
- ⚠️ `Invalid webhook signature` - Check verification key
- ❌ `SENDGRID_WEBHOOK_VERIFICATION_KEY not configured` - Add secret
- ℹ️ `Updated digest_sends for message_id: xxx`

## Troubleshooting

### Events Not Being Received

1. **Check webhook URL**: Ensure it's correct in SendGrid
2. **Verify webhook is active**: Check status in SendGrid dashboard
3. **Check CORS headers**: Webhook includes proper CORS configuration
4. **Review edge function logs**: Look for errors

### Signature Verification Failing

1. **Verify secret is set**:
   ```bash
   supabase secrets list
   ```
2. **Check secret value matches SendGrid**: Copy from SendGrid webhook settings
3. **Ensure headers are present**: `x-twilio-email-event-webhook-signature` and timestamp

### Database Not Updating

1. **Check message ID format**: Should match `sendgrid_message_id` in `digest_sends`
2. **Verify table permissions**: Service role key should have update access
3. **Check for matching records**:
   ```sql
   SELECT * FROM digest_sends WHERE sendgrid_message_id = 'your_message_id';
   ```

## Analytics Integration

The webhook data powers the Digest Analytics Dashboard:

- **Open Rate**: `(COUNT(opened_at) / COUNT(*)) * 100`
- **Click Rate**: `(COUNT(clicked_at) / COUNT(*)) * 100`
- **Delivery Rate**: `(COUNT(delivery_status = 'delivered') / COUNT(*)) * 100`
- **Bounce Rate**: `(COUNT(delivery_status = 'failed') / COUNT(*)) * 100`

## Best Practices

### 1. Monitor Bounce Rates

High bounce rates indicate:
- Invalid email addresses
- Domain reputation issues
- Need to clean email list

### 2. Track Open Rates

Low open rates suggest:
- Poor subject lines
- Wrong send times
- Emails marked as spam

### 3. Analyze Click Patterns

- Which notification types get most clicks?
- What time of day has best engagement?
- Are admins taking action on alerts?

### 4. Set Up Alerts

Create monitoring for:
- Bounce rate > 5%
- Open rate < 20%
- Webhook failures

## API Reference

### Webhook Endpoint

**POST** `/functions/v1/sendgrid-webhook-handler`

**Headers**:
- `x-twilio-email-event-webhook-signature`: HMAC-SHA256 signature
- `x-twilio-email-event-webhook-timestamp`: Unix timestamp
- `Content-Type`: application/json

**Request Body**:
```json
[
  {
    "email": "admin@example.com",
    "timestamp": 1633024800,
    "event": "delivered",
    "sg_message_id": "abc123.filter0001.12345.67890"
  }
]
```

**Response**:
```json
{
  "success": true,
  "processed": 1,
  "results": [
    {
      "messageId": "abc123",
      "event": "delivered",
      "success": true
    }
  ]
}
```

## Related Documentation

- [ADMIN_DIGEST_EMAILS.md](./ADMIN_DIGEST_EMAILS.md) - Digest email system
- [DIGEST_ANALYTICS.md](./DIGEST_ANALYTICS.md) - Analytics dashboard
- [SENDGRID_SETUP.md](./SENDGRID_SETUP.md) - SendGrid configuration
- [SendGrid Event Webhook Docs](https://docs.sendgrid.com/for-developers/tracking-events/event)

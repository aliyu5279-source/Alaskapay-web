# Complete Email Integration System

## Overview
Alaska Pay now has a comprehensive email integration system supporting both SendGrid and AWS SES for transactional emails, delivery tracking, and bounce handling.

## Features
✅ Password reset emails
✅ Payment confirmations
✅ Transaction receipts
✅ Welcome emails
✅ Verification success notifications
✅ Delivery tracking
✅ Bounce handling
✅ Open and click tracking
✅ Email analytics

## Setup Options

### Option 1: SendGrid (Recommended for Quick Start)

#### 1. Create SendGrid Account
- Sign up at [sendgrid.com](https://sendgrid.com)
- Free tier: 100 emails/day
- Paid plans start at $19.95/month

#### 2. Get API Key
```bash
# Settings > API Keys > Create API Key
# Name: Alaska Pay Transactional
# Permissions: Full Access to Mail Send
```

#### 3. Verify Domain
```bash
# Settings > Sender Authentication > Authenticate Your Domain
# Add DNS records provided by SendGrid
```

#### 4. Configure Supabase
```bash
supabase secrets set SENDGRID_API_KEY=your_api_key_here
supabase secrets set FROM_EMAIL=noreply@yourdomain.com
```

#### 5. Setup Webhook
```bash
# Settings > Mail Settings > Event Webhook
# HTTP Post URL: https://your-project.supabase.co/functions/v1/email-webhook-handler
# Select events: Delivered, Opened, Clicked, Bounced, Dropped
```

### Option 2: AWS SES

#### 1. Setup AWS SES
```bash
# AWS Console > SES > Verified Identities
# Verify your domain or email address
```

#### 2. Get SMTP Credentials
```bash
# SES > SMTP Settings > Create SMTP Credentials
# Note: Username and Password
```

#### 3. Move Out of Sandbox
```bash
# Request production access
# AWS Console > SES > Account Dashboard > Request Production Access
```

#### 4. Configure Environment
```bash
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY=your_access_key
AWS_SES_SECRET_KEY=your_secret_key
FROM_EMAIL=noreply@yourdomain.com
```

## Database Setup

Run this SQL in Supabase SQL Editor:

```sql
-- Email delivery tracking
CREATE TABLE IF NOT EXISTS email_delivery_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id UUID UNIQUE NOT NULL,
  recipient TEXT NOT NULL,
  email_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  last_event TEXT,
  last_event_at TIMESTAMP,
  bounce_reason TEXT,
  drop_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email bounces
CREATE TABLE IF NOT EXISTS email_bounces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  bounce_type TEXT,
  reason TEXT,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_tracking_recipient ON email_delivery_tracking(recipient);
CREATE INDEX idx_email_tracking_status ON email_delivery_tracking(status);
CREATE INDEX idx_email_bounces_email ON email_bounces(email);
```

## Usage Examples

### Send Password Reset Email
```typescript
import { sendTransactionalEmail } from '@/lib/transactionalEmailService';

await sendTransactionalEmail(
  'user@example.com',
  'password_reset',
  {
    resetLink: 'https://alaskapay.com/reset-password?token=abc123'
  }
);
```

### Send Payment Confirmation
```typescript
await sendTransactionalEmail(
  'user@example.com',
  'payment_confirmation',
  {
    amount: 50000,
    recipient: 'John Doe',
    reference: 'TXN123456',
    date: new Date().toISOString(),
    receiptLink: 'https://alaskapay.com/receipts/123'
  }
);
```

### Send Transaction Receipt
```typescript
await sendTransactionalEmail(
  'user@example.com',
  'receipt',
  {
    receiptNumber: 'RCP-2024-001',
    amount: 50000,
    fee: 100,
    from: 'John Doe',
    to: 'Jane Smith',
    reference: 'TXN123456',
    date: new Date().toISOString(),
    downloadLink: 'https://alaskapay.com/receipts/123/download'
  }
);
```

### Check Delivery Status
```typescript
import { getEmailDeliveryStatus } from '@/lib/transactionalEmailService';

const status = await getEmailDeliveryStatus(trackingId);
console.log(status.status); // sent, delivered, bounced, dropped
console.log(status.opened_at); // When email was opened
console.log(status.clicked_at); // When links were clicked
```

### Check for Bounced Emails
```typescript
import { checkEmailBounced } from '@/lib/transactionalEmailService';

const isBounced = await checkEmailBounced('user@example.com');
if (isBounced) {
  console.log('Email has bounced previously');
}
```

## Email Templates

All templates include:
- Professional HTML design
- Mobile responsive layout
- Clear call-to-action buttons
- Branding consistency
- Footer with support info

### Available Templates:
1. **Password Reset** - Secure link with 1-hour expiry
2. **Payment Confirmation** - Transaction details with receipt link
3. **Receipt** - Detailed transaction breakdown with PDF download
4. **Welcome** - Onboarding email with getting started steps
5. **Verification Success** - Account verification confirmation with new limits

## Delivery Tracking

Track email lifecycle:
- ✉️ **Sent** - Email dispatched to provider
- 📬 **Delivered** - Email reached inbox
- 👀 **Opened** - Recipient opened email
- 🔗 **Clicked** - Recipient clicked links
- ⚠️ **Bounced** - Email bounced (hard/soft)
- 🚫 **Dropped** - Email dropped by provider

## Bounce Handling

Automatic bounce management:
- Hard bounces logged permanently
- Soft bounces tracked for retry
- Automatic suppression list
- Bounce reason tracking
- Email validation before send

## Best Practices

### 1. Domain Authentication
- Always authenticate your sending domain
- Setup SPF, DKIM, and DMARC records
- Use subdomain for transactional emails (e.g., mail.yourdomain.com)

### 2. Email Content
- Keep subject lines under 50 characters
- Use clear, actionable CTAs
- Include unsubscribe link (if required)
- Test on multiple email clients
- Avoid spam trigger words

### 3. Deliverability
- Warm up new domains gradually
- Monitor bounce rates (keep under 5%)
- Clean bounce list regularly
- Use double opt-in for marketing emails
- Monitor sender reputation

### 4. Security
- Use HTTPS for all links
- Include security disclaimers
- Add contact information
- Implement rate limiting
- Validate recipient emails

## Monitoring

### SendGrid Dashboard
- Email activity feed
- Delivery statistics
- Bounce reports
- Engagement metrics
- API usage

### AWS SES Console
- Sending statistics
- Reputation dashboard
- Bounce and complaint rates
- Suppression list
- Configuration sets

### Supabase Queries
```sql
-- Delivery rate
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM email_delivery_tracking
WHERE sent_at > NOW() - INTERVAL '7 days'
GROUP BY status;

-- Open rate
SELECT 
  COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as open_rate
FROM email_delivery_tracking
WHERE sent_at > NOW() - INTERVAL '7 days';

-- Bounce analysis
SELECT 
  bounce_type,
  reason,
  COUNT(*) as count
FROM email_bounces
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY bounce_type, reason
ORDER BY count DESC;
```

## Troubleshooting

### Emails Not Sending
1. Verify API key is correct
2. Check domain authentication
3. Review edge function logs
4. Confirm FROM_EMAIL is verified
5. Check rate limits

### High Bounce Rate
1. Validate email addresses before sending
2. Remove hard bounces from list
3. Check domain reputation
4. Review email content for spam triggers
5. Verify DNS records

### Low Open Rate
1. Improve subject lines
2. Send at optimal times
3. Segment your audience
4. Personalize content
5. Check spam folder placement

## Production Checklist
- [ ] Domain authenticated
- [ ] DNS records configured
- [ ] API keys secured in Supabase
- [ ] Webhook endpoint configured
- [ ] Email templates tested
- [ ] Bounce handling active
- [ ] Monitoring dashboard setup
- [ ] Rate limits configured
- [ ] Backup email provider ready
- [ ] Support email configured

## Support
- SendGrid Docs: https://docs.sendgrid.com
- AWS SES Docs: https://docs.aws.amazon.com/ses
- Alaska Pay Support: support@alaskapay.com

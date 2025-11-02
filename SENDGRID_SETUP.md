# SendGrid Email Domain Authentication Setup

Complete guide to authenticate alaskapay.ng with SendGrid for transactional emails.

## Quick Setup (15 Minutes)

### Step 1: Get SendGrid DNS Records

1. Login to [SendGrid Dashboard](https://app.sendgrid.com)
2. Navigate to **Settings** → **Sender Authentication**
3. Click **Authenticate Your Domain**
4. Select **DNS Host**: Your registrar (e.g., Cloudflare, GoDaddy)
5. Enter domain: `alaskapay.ng`
6. Advanced Settings:
   - ✅ Use automated security
   - ✅ Brand links with your domain
   - Subdomain: `mail` (optional)
7. Click **Next**

### Step 2: Add DNS Records

SendGrid will provide these records (add to your DNS):

```
# CNAME Records (3 total)
Type: CNAME
Name: em1234.alaskapay.ng
Value: u12345678.wl.sendgrid.net
TTL: 3600

Type: CNAME
Name: s1._domainkey.alaskapay.ng
Value: s1.domainkey.u12345678.wl.sendgrid.net
TTL: 3600

Type: CNAME
Name: s2._domainkey.alaskapay.ng
Value: s2.domainkey.u12345678.wl.sendgrid.net
TTL: 3600
```

### Step 3: Add Email Authentication Records

```
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:sendgrid.net ~all
TTL: 3600

# DMARC Record
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@alaskapay.ng
TTL: 3600
```

### Step 4: Verify Domain

1. Wait 5-10 minutes for DNS propagation
2. Return to SendGrid dashboard
3. Click **Verify** button
4. Status should change to "Verified" ✅

## Email Configuration

### Update Environment Variables

```bash
# .env file
VITE_SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
VITE_SENDGRID_FROM_EMAIL=noreply@alaskapay.ng
VITE_SENDGRID_FROM_NAME=AlaskaPay
VITE_SENDGRID_REPLY_TO=support@alaskapay.ng
```

### Configure Email Addresses

```
Transactional: noreply@alaskapay.ng
Support: support@alaskapay.ng
Security: security@alaskapay.ng
Billing: billing@alaskapay.ng
Marketing: hello@alaskapay.ng
DMARC Reports: dmarc-reports@alaskapay.ng
```

## Testing Email Delivery

### Test 1: Send Test Email

```typescript
import { emailService } from '@/lib/emailService';

await emailService.sendTransactional({
  to: 'your-email@example.com',
  subject: 'Test Email from AlaskaPay',
  html: '<h1>Test successful!</h1>',
  from: 'noreply@alaskapay.ng'
});
```

### Test 2: Check Email Headers

Send test email and check headers for:
- ✅ SPF: PASS
- ✅ DKIM: PASS
- ✅ DMARC: PASS

### Test 3: Spam Score

Use [Mail Tester](https://www.mail-tester.com):
1. Send email to provided address
2. Check score (should be 10/10)
3. Review any issues

## DNS Verification Commands

```bash
# Check SPF record
nslookup -type=txt alaskapay.ng

# Check DKIM records
nslookup -type=cname s1._domainkey.alaskapay.ng
nslookup -type=cname s2._domainkey.alaskapay.ng

# Check DMARC record
nslookup -type=txt _dmarc.alaskapay.ng

# Test email authentication
dig alaskapay.ng TXT +short
```

## SendGrid Dashboard Setup

### 1. API Key Creation

```
Settings → API Keys → Create API Key
Name: AlaskaPay Production
Permissions: Full Access (or Mail Send only)
Copy and save key securely
```

### 2. Sender Identity

```
Settings → Sender Authentication → Single Sender Verification
Email: noreply@alaskapay.ng
Name: AlaskaPay
Reply To: support@alaskapay.ng
```

### 3. IP Warmup (Optional)

For high volume:
```
Settings → IP Management → Warmup Schedule
Start: 100 emails/day
Increase: 2x daily for 2 weeks
```

### 4. Suppression Management

```
Settings → Suppressions
- Bounces: Auto-suppress
- Spam Reports: Auto-suppress
- Unsubscribes: Honor all
```

## Email Templates

### Welcome Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to AlaskaPay</title>
</head>
<body>
  <h1>Welcome to AlaskaPay!</h1>
  <p>Your account is ready.</p>
  <a href="https://alaskapay.ng/login">Login Now</a>
</body>
</html>
```

### Transaction Receipt Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Transaction Receipt</title>
</head>
<body>
  <h1>Payment Successful</h1>
  <p>Amount: ₦{{amount}}</p>
  <p>Reference: {{reference}}</p>
</body>
</html>
```

## Monitoring & Analytics

### SendGrid Statistics

Track in dashboard:
- Delivery rate (should be >95%)
- Open rate
- Click rate
- Bounce rate (should be <5%)
- Spam reports (should be <0.1%)

### Set Up Alerts

```
Settings → Alerts
- Bounce rate > 5%
- Spam rate > 0.1%
- Daily send limit reached
```

## Troubleshooting

### Domain Not Verifying

**Issue**: Verification fails after adding DNS records

**Solutions**:
1. Wait 24-48 hours for full DNS propagation
2. Check DNS records exactly match SendGrid values
3. Remove any duplicate TXT records
4. Try alternative verification method
5. Contact SendGrid support

### Emails Going to Spam

**Issue**: Emails landing in spam folder

**Solutions**:
1. Verify SPF, DKIM, DMARC all pass
2. Warm up IP address gradually
3. Avoid spam trigger words
4. Include unsubscribe link
5. Maintain clean email list
6. Monitor sender reputation

### High Bounce Rate

**Issue**: Many emails bouncing

**Solutions**:
1. Validate email addresses before sending
2. Remove hard bounces immediately
3. Use double opt-in
4. Clean email list regularly
5. Check for typos in addresses

## Best Practices

### Email Deliverability

✅ Always use authenticated domain
✅ Include unsubscribe link
✅ Maintain clean email list
✅ Monitor bounce/spam rates
✅ Use double opt-in for marketing
✅ Warm up new IPs gradually
✅ Send consistent volume
✅ Avoid spam trigger words

### Security

✅ Rotate API keys quarterly
✅ Use environment variables
✅ Never commit keys to git
✅ Restrict API key permissions
✅ Monitor for unauthorized use
✅ Enable 2FA on SendGrid account

### Compliance

✅ Include physical address
✅ Honor unsubscribe requests
✅ Comply with CAN-SPAM Act
✅ Follow GDPR guidelines
✅ Keep email records
✅ Provide privacy policy link

## Support

**SendGrid Support**: https://support.sendgrid.com
**Email Issues**: email-support@alaskapay.ng
**Documentation**: https://docs.sendgrid.com

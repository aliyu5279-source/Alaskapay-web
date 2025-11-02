# Email Domain Authentication System

Complete guide for configuring SPF, DKIM, and DMARC records for custom email sending domains in Alaska Pay.

## Overview

The Email Domain Authentication system allows you to send transactional emails from your own custom domain (e.g., `mail.yourdomain.com`) with proper authentication to improve deliverability and reputation.

## Features

- ✅ **SPF (Sender Policy Framework)** - Authorize mail servers
- ✅ **DKIM (DomainKeys Identified Mail)** - Cryptographic email authentication
- ✅ **DMARC (Domain-based Message Authentication)** - Email authentication policy
- ✅ **Automated DNS Validation** - Verify records are correctly configured
- ✅ **Deliverability Testing** - Test email authentication before going live
- ✅ **Domain Reputation Monitoring** - Track bounce rates and complaint rates
- ✅ **Multiple Domain Support** - Configure multiple sending domains

## Quick Start

### 1. Add Your Email Domain

1. Navigate to **Admin Panel** → **Email Domain Auth**
2. Click **Add Domain**
3. Enter your subdomain (e.g., `mail.yourdomain.com`)
4. Select DMARC policy (start with "quarantine")
5. Click **Add Domain**

### 2. Configure DNS Records

After adding your domain, you'll receive three DNS records to add:

#### SPF Record
```
Type: TXT
Host: mail.yourdomain.com
Value: v=spf1 include:_spf.alaskapay.com include:sendgrid.net ~all
TTL: 3600
```

#### DKIM Record
```
Type: TXT
Host: alaskapay._domainkey.mail.yourdomain.com
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4...
TTL: 3600
```

#### DMARC Record
```
Type: TXT
Host: _dmarc.mail.yourdomain.com
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
TTL: 3600
```

### 3. Validate DNS Records

1. Wait 5-10 minutes for DNS propagation
2. Click **Validate DNS** in the domain details
3. Verify all three records show as "verified"

### 4. Test Email Deliverability

1. Go to **Deliverability Test** tab
2. Enter a test email address
3. Click **Send Test Email**
4. Check the test email for authentication results

## DNS Configuration by Registrar

### GoDaddy

1. Log in to GoDaddy
2. Go to **My Products** → **DNS**
3. Click **Add** under Records
4. Select **TXT** as type
5. Enter Host and Value from Alaska Pay
6. Set TTL to 3600 seconds
7. Click **Save**

### Namecheap

1. Log in to Namecheap
2. Go to **Domain List** → Select domain
3. Click **Advanced DNS**
4. Click **Add New Record**
5. Choose **TXT Record**
6. Enter Host and Value
7. Click **Save All Changes**

### Cloudflare

1. Log in to Cloudflare
2. Select your domain
3. Go to **DNS** tab
4. Click **Add record**
5. Select **TXT** type
6. Enter Name and Content
7. Set Proxy status to **DNS only**
8. Click **Save**

### Google Domains

1. Log in to Google Domains
2. Select your domain
3. Go to **DNS** section
4. Scroll to **Custom resource records**
5. Enter Name, select **TXT**, and add Value
6. Click **Add**

### AWS Route 53

1. Log in to AWS Console
2. Go to **Route 53** → **Hosted zones**
3. Select your domain
4. Click **Create record**
5. Enter Record name
6. Select **TXT** as Record type
7. Enter Value
8. Click **Create records**

## Understanding the Records

### SPF (Sender Policy Framework)

SPF specifies which mail servers are authorized to send email on behalf of your domain.

**Components:**
- `v=spf1` - SPF version
- `include:_spf.alaskapay.com` - Alaska Pay mail servers
- `include:sendgrid.net` - SendGrid servers (if using)
- `~all` - Soft fail for unauthorized servers

### DKIM (DomainKeys Identified Mail)

DKIM adds a digital signature to emails, proving they haven't been tampered with.

**Components:**
- `v=DKIM1` - DKIM version
- `k=rsa` - Key type (RSA)
- `p=...` - Public key for signature verification

### DMARC (Domain-based Message Authentication)

DMARC tells receiving servers what to do with emails that fail SPF/DKIM checks.

**Policies:**
- `none` - Monitor only (no action taken)
- `quarantine` - Send to spam folder (recommended to start)
- `reject` - Reject the email completely (use after verification)

**Components:**
- `v=DMARC1` - DMARC version
- `p=quarantine` - Policy for failed emails
- `rua=mailto:...` - Aggregate report email
- `ruf=mailto:...` - Forensic report email

## Domain Reputation Monitoring

### Metrics Tracked

1. **Reputation Score** (0-100)
   - Based on email engagement and deliverability
   - Higher is better

2. **Bounce Rate** (%)
   - Percentage of emails that bounce
   - Keep below 5%

3. **Complaint Rate** (%)
   - Percentage of emails marked as spam
   - Keep below 0.1%

### Improving Reputation

- ✅ Warm up new domains gradually
- ✅ Send to engaged users first
- ✅ Remove bounced emails promptly
- ✅ Honor unsubscribe requests
- ✅ Send relevant, expected content
- ✅ Maintain consistent sending patterns

## Troubleshooting

### DNS Records Not Validating

**Problem:** Records show as "invalid" or "missing"

**Solutions:**
1. Wait 24-48 hours for full DNS propagation
2. Check for typos in Host and Value fields
3. Ensure no extra spaces in TXT record values
4. Verify you're adding records to the correct domain/subdomain
5. Use DNS lookup tools to verify: `dig TXT mail.yourdomain.com`

### Test Emails Failing Authentication

**Problem:** Test emails show SPF/DKIM/DMARC failures

**Solutions:**
1. Verify all three DNS records are validated
2. Check that DKIM selector matches (default: "alaskapay")
3. Ensure SPF includes Alaska Pay servers
4. Wait for DNS cache to clear (up to 48 hours)

### Low Reputation Score

**Problem:** Domain reputation score is low

**Solutions:**
1. Review bounce and complaint rates
2. Implement double opt-in for new subscribers
3. Clean email list regularly
4. Improve email content relevance
5. Monitor engagement metrics

## Best Practices

### 1. Domain Selection

- Use a subdomain (e.g., `mail.yourdomain.com`) instead of root domain
- Don't use your main website domain for transactional emails
- Keep marketing and transactional emails on separate subdomains

### 2. Gradual Rollout

**Week 1:** Send 100-500 emails/day
**Week 2:** Send 1,000-2,000 emails/day
**Week 3:** Send 5,000-10,000 emails/day
**Week 4+:** Full volume

### 3. DMARC Policy Progression

1. Start with `p=none` (monitoring)
2. Review reports for 2-4 weeks
3. Move to `p=quarantine`
4. Monitor for 2-4 weeks
5. Move to `p=reject` when confident

### 4. Monitoring

- Check reputation scores weekly
- Review bounce/complaint rates daily
- Monitor DMARC reports regularly
- Set up alerts for high bounce rates

## API Integration

### Check Domain Status

```typescript
import { supabase } from '@/lib/supabase';

const { data: domain } = await supabase
  .from('email_sending_domains')
  .select('*')
  .eq('domain', 'mail.yourdomain.com')
  .single();

console.log('SPF Status:', domain.spf_status);
console.log('DKIM Status:', domain.dkim_status);
console.log('DMARC Status:', domain.dmarc_status);
```

### Validate DNS Records

```typescript
import { validateDNSRecords } from '@/lib/emailDomainService';

const results = await validateDNSRecords(domainId);
console.log('Validation Results:', results);
```

### Test Deliverability

```typescript
import { testEmailDeliverability } from '@/lib/emailDomainService';

await testEmailDeliverability(domainId, 'test@example.com');
```

## Security Considerations

1. **Private Keys**: DKIM private keys are stored securely in the database
2. **Access Control**: Only admins can add/modify email domains
3. **Validation**: All DNS records are validated before use
4. **Monitoring**: Automated alerts for authentication failures

## Support

For issues with email domain authentication:

1. Check the troubleshooting section above
2. Review DNS records using online tools
3. Contact your domain registrar for DNS support
4. Reach out to Alaska Pay support with domain details

## Additional Resources

- [SPF Record Checker](https://mxtoolbox.com/spf.aspx)
- [DKIM Record Checker](https://mxtoolbox.com/dkim.aspx)
- [DMARC Record Checker](https://mxtoolbox.com/dmarc.aspx)
- [Email Authentication Guide](https://www.dmarcanalyzer.com/dmarc/)

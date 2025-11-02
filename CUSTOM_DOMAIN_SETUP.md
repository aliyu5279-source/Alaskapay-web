# Custom Domain Setup Guide

Complete guide for configuring custom domains for Alaska Pay with DNS setup, SSL automation, and domain verification.

## Quick Start

1. Navigate to Admin Dashboard → Custom Domains
2. Click "Add Domain"
3. Enter your domain and select type (Web/API/Both)
4. Follow DNS configuration instructions
5. Verify domain ownership
6. SSL certificate auto-provisions

## Domain Types

### Web Domain
- Main application interface
- User-facing website
- Example: `app.yourdomain.com`

### API Domain
- Backend API endpoints
- Webhook receivers
- Example: `api.yourdomain.com`

### Both
- Combined web and API on subdomains
- Recommended for production

## DNS Configuration

### Required Records

#### For Web Domains:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### For API Domains:
```
Type: CNAME
Name: api
Value: your-project.supabase.co
TTL: 3600
```

#### For Verification:
```
Type: TXT
Name: _alaskapay-verification
Value: [your-verification-token]
TTL: 3600
```

## Registrar-Specific Guides

### GoDaddy

1. Log into GoDaddy account
2. Go to Domain Portfolio
3. Click DNS next to your domain
4. Click "Add" for each record
5. Select record type and enter values
6. Save changes

**DNS Management URL:** https://dcc.godaddy.com/manage/dns

### Namecheap

1. Log into Namecheap
2. Go to Domain List
3. Click "Manage" next to domain
4. Go to Advanced DNS tab
5. Add new records with values
6. Save all changes

**DNS Management URL:** https://ap.www.namecheap.com/domains/list/

### Cloudflare

1. Log into Cloudflare
2. Select your domain
3. Go to DNS tab
4. Click "Add record"
5. Enter record details
6. Ensure proxy status is correct (orange cloud = proxied)

**DNS Management URL:** https://dash.cloudflare.com/

### Google Domains

1. Log into Google Domains
2. Select your domain
3. Click DNS in left menu
4. Scroll to Custom resource records
5. Add each record
6. Save changes

**DNS Management URL:** https://domains.google.com/registrar/

### AWS Route 53

1. Log into AWS Console
2. Go to Route 53
3. Select Hosted Zone
4. Click "Create Record"
5. Enter record details
6. Create record

**Console URL:** https://console.aws.amazon.com/route53/

## SSL Certificate Setup

### Automatic Provisioning

SSL certificates are automatically provisioned via Let's Encrypt when:
- Domain is verified
- DNS records are correctly configured
- Domain points to our servers

### Certificate Details

- **Provider:** Let's Encrypt
- **Type:** Domain Validated (DV)
- **Validity:** 90 days
- **Auto-renewal:** 30 days before expiry
- **Encryption:** TLS 1.2+

### Manual Certificate Upload

For custom certificates:

1. Go to Domain Details → SSL tab
2. Upload certificate files:
   - Certificate (.crt)
   - Private key (.key)
   - Certificate chain (.ca-bundle)
3. Save and activate

## Verification Process

### DNS Verification (Recommended)

1. Add TXT record with verification token
2. Wait for DNS propagation (5-60 minutes)
3. Click "Verify Domain" button
4. System checks TXT record
5. Domain marked as verified

### HTTP Verification

1. Upload verification file to:
   `http://yourdomain.com/.well-known/alaskapay-verification.txt`
2. File content: verification token
3. Click "Verify Domain"
4. System fetches file
5. Domain verified if token matches

### Email Verification

1. Receive verification email at:
   - admin@yourdomain.com
   - webmaster@yourdomain.com
   - postmaster@yourdomain.com
2. Click verification link
3. Domain automatically verified

## Subdomain Management

### Adding Subdomains

```
app.yourdomain.com → Web application
api.yourdomain.com → API endpoints
admin.yourdomain.com → Admin panel
docs.yourdomain.com → Documentation
```

### Wildcard Subdomains

```
Type: A
Name: *
Value: 76.76.21.21
TTL: 3600
```

Enables: `*.yourdomain.com`

## Troubleshooting

### DNS Not Propagating

**Problem:** DNS changes not visible
**Solution:**
- Wait 24-48 hours for full propagation
- Check DNS with: `nslookup yourdomain.com`
- Clear local DNS cache
- Use different DNS server for testing

### SSL Certificate Failed

**Problem:** SSL provisioning failed
**Solution:**
- Verify DNS A/CNAME records correct
- Ensure domain points to our servers
- Check firewall allows port 443
- Wait for DNS propagation
- Try manual verification

### Domain Verification Failed

**Problem:** Verification not completing
**Solution:**
- Check TXT record added correctly
- Verify record name exactly matches
- Wait for DNS propagation
- Try alternative verification method
- Check for typos in verification token

### CNAME Conflicts

**Problem:** Cannot add CNAME for root domain
**Solution:**
- Use A record for root (@)
- Use CNAME for www subdomain
- Consider ALIAS record if supported
- Use subdomain (app.domain.com) instead

## Best Practices

### Security
- Enable DNSSEC if available
- Use CAA records to restrict certificate issuance
- Enable HSTS after SSL active
- Regular certificate monitoring

### Performance
- Set appropriate TTL values (3600 recommended)
- Use CDN for static assets
- Enable HTTP/2
- Configure caching headers

### Monitoring
- Set up uptime monitoring
- Monitor SSL expiry dates
- Track DNS changes
- Alert on verification failures

## API Integration

### Add Domain via API

```typescript
const domain = await domainService.addDomain({
  domain: 'example.com',
  subdomain: 'app',
  domain_type: 'web',
  registrar: 'cloudflare'
});
```

### Verify Domain

```typescript
const verified = await domainService.verifyDomain(domainId);
```

### Get DNS Records

```typescript
const records = await domainService.getDNSRecords(domainId);
```

## Support

For assistance with domain configuration:
- Email: domains@alaskapay.com
- Documentation: https://docs.alaskapay.com/domains
- Live Chat: Available in admin panel

## Advanced Configuration

### Custom Nameservers

If using custom nameservers:
1. Update nameservers at registrar
2. Configure zone file
3. Add all required records
4. Wait for propagation
5. Verify configuration

### Load Balancing

For high-traffic domains:
1. Add multiple A records
2. Configure health checks
3. Set up failover
4. Monitor performance

### Geographic Routing

Route users by location:
1. Use GeoDNS provider
2. Configure regional endpoints
3. Set up latency-based routing
4. Test from different regions

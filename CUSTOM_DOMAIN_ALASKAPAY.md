# Custom Domain Configuration for Alaska Pay

Complete guide to setting up custom domains for your Alaska Pay deployment.

## Overview

Alaska Pay supports custom domains for:
- **Web Application**: Your main app interface (app.yourdomain.com)
- **API Endpoints**: Backend services (api.yourdomain.com)
- **Combined Setup**: Both web and API on your domain

## Quick Setup (5 Minutes)

### Step 1: Add Domain
1. Login to Alaska Pay Admin Dashboard
2. Navigate to **Custom Domains** in sidebar
3. Click **Add Domain**
4. Enter your domain (e.g., alaskapay.com)
5. Select domain type (Web/API/Both)
6. Choose your registrar
7. Click **Add Domain**

### Step 2: Configure DNS
Copy the DNS records shown and add them to your domain registrar:

**For Web:**
```
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

**For API:**
```
CNAME: api → your-project.supabase.co
```

**For Verification:**
```
TXT: _alaskapay-verification → [your-token]
```

### Step 3: Verify
1. Wait 5-60 minutes for DNS propagation
2. Click **Verify Domain** in dashboard
3. SSL certificate auto-provisions
4. Domain goes live!

## Registrar-Specific Guides

### GoDaddy Setup
1. Login at https://dcc.godaddy.com
2. Go to **Domain Portfolio**
3. Click **DNS** next to your domain
4. Click **Add** for each record
5. Enter Type, Name, Value
6. Save changes

### Namecheap Setup
1. Login at https://ap.www.namecheap.com
2. Go to **Domain List**
3. Click **Manage** on your domain
4. Select **Advanced DNS** tab
5. Add Host Records
6. Save all changes

### Cloudflare Setup
1. Login at https://dash.cloudflare.com
2. Select your domain
3. Go to **DNS** tab
4. Click **Add record**
5. Enter record details
6. Set proxy status (orange = on, gray = off)
7. Save

### Google Domains Setup
1. Login at https://domains.google.com
2. Select your domain
3. Click **DNS** in left menu
4. Scroll to **Custom resource records**
5. Add each record
6. Save changes

### AWS Route 53 Setup
1. Login to AWS Console
2. Go to **Route 53**
3. Select **Hosted Zone**
4. Click **Create Record**
5. Enter record details
6. Create record

## SSL Certificates

### Automatic SSL
- **Provider**: Let's Encrypt
- **Type**: Domain Validated (DV)
- **Validity**: 90 days
- **Auto-renewal**: Yes (30 days before expiry)
- **Encryption**: TLS 1.2+

SSL certificates are automatically provisioned when:
✓ Domain is verified
✓ DNS records are correct
✓ Domain points to our servers

### Manual Certificate Upload
For custom SSL certificates:
1. Go to Domain Details → SSL tab
2. Upload certificate files
3. Save and activate

## Common Configurations

### Root Domain Only
```
Domain: alaskapay.com
Type: Web
Records: A, TXT
```

### Subdomain for App
```
Domain: alaskapay.com
Subdomain: app
Full: app.alaskapay.com
Type: Web
Records: CNAME, TXT
```

### Separate Web and API
```
Web: app.alaskapay.com (CNAME)
API: api.alaskapay.com (CNAME)
Type: Both
```

### Multiple Subdomains
```
app.alaskapay.com → Web App
api.alaskapay.com → API
admin.alaskapay.com → Admin Panel
docs.alaskapay.com → Documentation
```

## Troubleshooting

### DNS Not Propagating
**Issue**: Changes not visible after 1 hour
**Solutions**:
- Wait up to 48 hours for full propagation
- Check DNS: `nslookup yourdomain.com`
- Clear local DNS cache
- Try different DNS server (8.8.8.8)

### SSL Certificate Failed
**Issue**: SSL status shows "failed"
**Solutions**:
- Verify A/CNAME records are correct
- Ensure domain points to our IPs
- Check firewall allows port 443
- Wait for DNS propagation
- Contact support

### Domain Verification Failed
**Issue**: Verification not completing
**Solutions**:
- Check TXT record added correctly
- Verify exact token match
- Wait for DNS propagation (5-60 min)
- Try alternative verification method
- Check for typos

### CNAME at Root Domain
**Issue**: Cannot add CNAME for @ record
**Solutions**:
- Use A record for root domain
- Use CNAME for www subdomain
- Consider ALIAS record (if supported)
- Use subdomain instead (app.domain.com)

## Best Practices

### Security
✓ Enable DNSSEC at registrar
✓ Use CAA records to restrict certificate issuance
✓ Enable HSTS after SSL is active
✓ Monitor certificate expiry
✓ Regular security audits

### Performance
✓ Set TTL to 3600 (1 hour)
✓ Use CDN for static assets
✓ Enable HTTP/2
✓ Configure caching headers
✓ Monitor uptime

### Monitoring
✓ Set up uptime monitoring
✓ Track SSL expiry dates
✓ Monitor DNS changes
✓ Alert on verification failures
✓ Regular health checks

## Advanced Features

### Wildcard Subdomains
```
Type: A
Name: *
Value: 76.76.21.21
```
Enables: `*.yourdomain.com`

### Geographic Routing
Route users by location:
- Use GeoDNS provider
- Configure regional endpoints
- Set up latency-based routing

### Load Balancing
For high-traffic:
- Add multiple A records
- Configure health checks
- Set up failover

## API Integration

### Add Domain Programmatically
```typescript
import { domainService } from '@/lib/domainService';

const domain = await domainService.addDomain({
  domain: 'alaskapay.com',
  subdomain: 'app',
  domain_type: 'web',
  registrar: 'cloudflare'
});
```

### Verify Domain
```typescript
const verified = await domainService.verifyDomain(domainId);
if (verified) {
  console.log('Domain verified successfully');
}
```

### Get DNS Records
```typescript
const records = await domainService.getDNSRecords(domainId);
records.forEach(record => {
  console.log(`${record.record_type}: ${record.name} → ${record.value}`);
});
```

## Support

Need help with domain configuration?

**Email**: domains@alaskapay.com
**Documentation**: https://docs.alaskapay.com/domains
**Live Chat**: Available in admin panel
**Status Page**: https://status.alaskapay.com

## Checklist

Before going live:
- [ ] Domain added to dashboard
- [ ] All DNS records configured
- [ ] Domain verified
- [ ] SSL certificate active
- [ ] HTTPS working
- [ ] WWW redirect configured
- [ ] API endpoints tested
- [ ] OAuth URLs updated
- [ ] Webhook URLs updated
- [ ] Team notified
- [ ] Documentation updated
- [ ] Monitoring enabled

## Next Steps

After domain setup:
1. Update OAuth redirect URLs
2. Configure webhook endpoints
3. Update mobile app deep links
4. Set up email sending domain
5. Configure CORS policies
6. Update documentation
7. Notify users of new domain

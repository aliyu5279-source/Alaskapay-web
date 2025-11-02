# AlaskaPay.ng Complete DNS Configuration

Complete DNS setup for alaskapay.ng with all subdomains, SSL, and email authentication.

## Quick Copy-Paste DNS Records

### Main Domain Records

```
# Root Domain (alaskapay.ng)
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

# WWW Subdomain
Type: CNAME
Name: www
Value: alaskapay.netlify.app
TTL: 3600

# Admin Panel Subdomain
Type: CNAME
Name: admin
Value: alaskapay.netlify.app
TTL: 3600

# API Subdomain
Type: CNAME
Name: api
Value: your-project-ref.supabase.co
TTL: 3600
```

### Email Authentication (SendGrid)

```
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:sendgrid.net ~all
TTL: 3600

# DKIM Record 1
Type: CNAME
Name: s1._domainkey
Value: s1.domainkey.u12345678.wl.sendgrid.net
TTL: 3600

# DKIM Record 2
Type: CNAME
Name: s2._domainkey
Value: s2.domainkey.u12345678.wl.sendgrid.net
TTL: 3600

# DMARC Record
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@alaskapay.ng
TTL: 3600
```

### Domain Verification

```
# AlaskaPay Verification
Type: TXT
Name: _alaskapay-verification
Value: alaskapay-verify-[YOUR-TOKEN-HERE]
TTL: 3600

# Netlify Verification
Type: TXT
Name: @
Value: [NETLIFY-VERIFICATION-TOKEN]
TTL: 3600
```

## Subdomain Routing Configuration

### Netlify Configuration (_redirects file)

```
# Admin Panel Routing
https://admin.alaskapay.ng/*  https://alaskapay.netlify.app/admin/:splat  200
http://admin.alaskapay.ng/*   https://admin.alaskapay.ng/:splat  301!

# API Routing (proxy to Supabase)
https://api.alaskapay.ng/*    https://your-project.supabase.co/rest/v1/:splat  200
http://api.alaskapay.ng/*     https://api.alaskapay.ng/:splat  301!

# Main App HTTPS Redirect
http://alaskapay.ng/*         https://alaskapay.ng/:splat  301!
http://www.alaskapay.ng/*     https://www.alaskapay.ng/:splat  301!

# WWW to non-WWW redirect
https://www.alaskapay.ng/*    https://alaskapay.ng/:splat  301!

# SPA Routing
/*  /index.html  200
```

## Setup Instructions

### Step 1: Configure DNS (15 minutes)

1. Login to your domain registrar (e.g., Whogohost, Qservers)
2. Navigate to DNS Management
3. Add all records from above
4. Replace placeholders:
   - `your-project-ref` with your Supabase project reference
   - `u12345678` with your SendGrid user ID
   - `[YOUR-TOKEN-HERE]` with verification tokens
5. Save changes

### Step 2: Netlify Domain Setup (5 minutes)

```bash
# Add domains in Netlify Dashboard
1. Go to Site Settings → Domain Management
2. Add custom domain: alaskapay.ng
3. Add custom domain: www.alaskapay.ng
4. Add custom domain: admin.alaskapay.ng
5. Add custom domain: api.alaskapay.ng

# Netlify will automatically:
- Provision SSL certificates (Let's Encrypt)
- Enable HTTPS
- Configure redirects
```

### Step 3: SendGrid Email Setup (10 minutes)

1. Login to SendGrid Dashboard
2. Go to Settings → Sender Authentication
3. Click "Authenticate Your Domain"
4. Enter: alaskapay.ng
5. Copy DNS records provided
6. Add to your DNS (already included above)
7. Click "Verify" after DNS propagation

### Step 4: Verify Everything (5 minutes)

```bash
# Check DNS propagation
nslookup alaskapay.ng
nslookup admin.alaskapay.ng
nslookup api.alaskapay.ng

# Check email authentication
nslookup -type=txt alaskapay.ng
nslookup -type=txt _dmarc.alaskapay.ng

# Test SSL
curl -I https://alaskapay.ng
curl -I https://admin.alaskapay.ng
curl -I https://api.alaskapay.ng
```

## Automatic SSL Configuration

### Let's Encrypt (Automatic)

Netlify automatically provisions SSL certificates:
- **Provider**: Let's Encrypt
- **Type**: Domain Validated (DV)
- **Validity**: 90 days
- **Auto-renewal**: Yes
- **Protocols**: TLS 1.2, TLS 1.3

### SSL Features Enabled

✅ HTTPS Redirect (HTTP → HTTPS)
✅ HSTS Headers
✅ Perfect Forward Secrecy
✅ Strong Cipher Suites
✅ Automatic Certificate Renewal

## Testing Checklist

- [ ] https://alaskapay.ng loads correctly
- [ ] https://www.alaskapay.ng redirects to alaskapay.ng
- [ ] https://admin.alaskapay.ng shows admin panel
- [ ] https://api.alaskapay.ng/health returns 200
- [ ] HTTP redirects to HTTPS for all domains
- [ ] SSL certificate valid (check browser)
- [ ] Email authentication verified in SendGrid
- [ ] SPF record passes (mail-tester.com)
- [ ] DKIM signatures working
- [ ] DMARC policy active

## Troubleshooting

### DNS Not Propagating
```bash
# Check current DNS
dig alaskapay.ng
dig admin.alaskapay.ng +short

# Clear local cache
sudo dscacheutil -flushcache  # macOS
ipconfig /flushdns             # Windows
```

### SSL Certificate Issues
- Wait 24 hours for DNS propagation
- Verify DNS records point to Netlify
- Check Netlify SSL settings
- Contact Netlify support if needed

### Email Authentication Failing
- Verify DKIM CNAMEs point correctly
- Check SPF includes sendgrid.net
- Wait 48 hours for propagation
- Use MXToolbox to verify

## Support

**DNS Issues**: support@alaskapay.ng
**Email Auth**: sendgrid-support@alaskapay.ng
**SSL Problems**: ssl@alaskapay.ng

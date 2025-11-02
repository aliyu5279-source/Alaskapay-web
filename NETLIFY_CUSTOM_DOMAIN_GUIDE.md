# Netlify Custom Domain Configuration Guide

Complete guide for setting up custom domains on Netlify with DNS, SSL, and HTTPS redirects.

## Quick Setup

1. Go to Netlify Dashboard → Your Site → Domain Settings
2. Click "Add custom domain"
3. Enter your domain (e.g., `alaskapay.com`)
4. Follow DNS instructions below
5. SSL auto-provisions in 24 hours

## DNS Configuration

### Option 1: Netlify DNS (Recommended)

**Easiest method - Netlify manages everything**

1. In Domain Settings, click "Set up Netlify DNS"
2. Copy the 4 nameservers provided
3. Go to your domain registrar
4. Update nameservers to Netlify's
5. Wait 24-48 hours for propagation

**Netlify Nameservers:**
```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

### Option 2: External DNS

**Keep your current DNS provider**

#### For Root Domain (alaskapay.com):
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600
```

#### For WWW Subdomain:
```
Type: CNAME
Name: www
Value: your-site.netlify.app
TTL: 3600
```

#### For Custom Subdomain (app.alaskapay.com):
```
Type: CNAME
Name: app
Value: your-site.netlify.app
TTL: 3600
```

## Registrar-Specific Instructions

### GoDaddy
1. Login → My Products → DNS
2. Click "Add" for each record
3. Select type, enter name and value
4. Save

### Namecheap
1. Domain List → Manage → Advanced DNS
2. Add New Record
3. Enter details and save

### Cloudflare
1. Select domain → DNS
2. Add record
3. **Important:** Set proxy status to "DNS only" (gray cloud)

### Google Domains
1. My domains → DNS
2. Custom resource records
3. Add each record

## SSL Certificate Setup

### Automatic SSL (Let's Encrypt)

**Netlify automatically provisions SSL certificates**

1. Add custom domain
2. Configure DNS correctly
3. Wait 24 hours for DNS propagation
4. SSL certificate auto-generates
5. Certificate auto-renews every 90 days

### Verify SSL Status

Go to: Domain Settings → HTTPS

**Status indicators:**
- ✅ "Certificate provisioned" - Ready
- ⏳ "Provisioning certificate" - In progress
- ❌ "Certificate failed" - Check DNS

### Force HTTPS

1. Domain Settings → HTTPS
2. Enable "Force HTTPS"
3. All HTTP traffic redirects to HTTPS

## Domain Verification

### Automatic Verification

Netlify verifies domains automatically when:
- DNS points to Netlify servers
- Domain resolves correctly
- No conflicts exist

### Manual Verification

If verification fails:
1. Check DNS propagation: `nslookup yourdomain.com`
2. Verify A/CNAME records correct
3. Wait 24-48 hours
4. Contact Netlify support if still failing

## HTTPS Redirect Configuration

### Enable Automatic HTTPS Redirect

1. Site Settings → Domain Management → HTTPS
2. Toggle "Force HTTPS" to ON
3. All HTTP requests redirect to HTTPS

### Custom Redirects

Add to `netlify.toml`:

```toml
[[redirects]]
  from = "http://alaskapay.com/*"
  to = "https://alaskapay.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.alaskapay.com/*"
  to = "https://alaskapay.com/:splat"
  status = 301
  force = true
```

### WWW to Non-WWW Redirect

```toml
[[redirects]]
  from = "https://www.alaskapay.com/*"
  to = "https://alaskapay.com/:splat"
  status = 301
  force = true
```

## Troubleshooting

### DNS Not Propagating
- Wait 24-48 hours
- Check with: `dig yourdomain.com`
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### SSL Certificate Failed
- Verify DNS points to Netlify
- Check no CAA records blocking Let's Encrypt
- Disable Cloudflare proxy if using
- Wait 24 hours after DNS changes

### Domain Not Verifying
- Confirm A record: `75.2.60.5`
- Confirm CNAME points to: `your-site.netlify.app`
- Remove conflicting DNS records
- Check domain not used elsewhere

### Mixed Content Warnings
- Update all URLs to HTTPS
- Check external resources use HTTPS
- Enable "Force HTTPS" in Netlify

## Best Practices

1. **Use Netlify DNS** - Simplest and most reliable
2. **Enable Force HTTPS** - Security and SEO
3. **Set up WWW redirect** - Consistent branding
4. **Monitor SSL expiry** - Auto-renews but verify
5. **Use HSTS headers** - Enhanced security

## Advanced Configuration

### Custom Headers

Add to `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### Branch Subdomains

Netlify auto-creates:
- `main--your-site.netlify.app` (main branch)
- `dev--your-site.netlify.app` (dev branch)

Map to custom domains:
- `alaskapay.com` → main branch
- `staging.alaskapay.com` → staging branch

## Support Resources

- **Netlify Docs:** https://docs.netlify.com/domains-https/
- **DNS Checker:** https://dnschecker.org
- **SSL Checker:** https://www.sslshopper.com/ssl-checker.html
- **Netlify Support:** https://answers.netlify.com

## Checklist

- [ ] Domain added in Netlify
- [ ] DNS records configured
- [ ] DNS propagated (24-48 hours)
- [ ] Domain verified
- [ ] SSL certificate provisioned
- [ ] Force HTTPS enabled
- [ ] WWW redirect configured
- [ ] Site accessible via custom domain
- [ ] All pages load with HTTPS
- [ ] No mixed content warnings

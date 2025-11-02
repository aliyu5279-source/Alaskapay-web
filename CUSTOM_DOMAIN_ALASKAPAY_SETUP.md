# 🌐 Alaska Pay Custom Domain Setup Guide

## Complete guide for configuring alaskapay.com with SSL certificates

---

## 📋 Prerequisites

- [ ] Domain purchased (alaskapay.com)
- [ ] Access to domain registrar (GoDaddy, Namecheap, etc.)
- [ ] Alaska Pay deployed to Netlify or Vercel
- [ ] DNS propagation patience (24-48 hours)

---

## 🎯 Quick Setup Overview

1. **Choose Platform**: Netlify or Vercel
2. **Add Domain**: In platform dashboard
3. **Configure DNS**: Update domain registrar
4. **Verify Domain**: Wait for verification
5. **Enable SSL**: Automatic via Let's Encrypt
6. **Force HTTPS**: Enable redirect

---

## 🔷 Option 1: Netlify Custom Domain

### Step 1: Add Domain to Netlify

```bash
# Login to Netlify
netlify login

# Link your site
netlify link

# Add custom domain
netlify domains:add alaskapay.com
```

**Or via Dashboard:**
1. Go to https://app.netlify.com
2. Select your Alaska Pay site
3. Go to **Domain settings**
4. Click **Add custom domain**
5. Enter: `alaskapay.com`
6. Click **Verify**

### Step 2: Configure DNS Records

**At your domain registrar (GoDaddy, Namecheap, etc.):**

#### Primary Domain (alaskapay.com)
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600
```

#### WWW Subdomain (www.alaskapay.com)
```
Type: CNAME
Name: www
Value: alaskapay.netlify.app
TTL: 3600
```

### Step 3: Verify Domain

1. Wait 5-10 minutes after DNS changes
2. In Netlify dashboard, click **Verify DNS configuration**
3. Status will change from "Awaiting DNS" to "Verified"

### Step 4: Enable SSL Certificate

**Automatic (Recommended):**
- Netlify automatically provisions Let's Encrypt SSL
- Takes 1-2 hours after domain verification
- Certificate auto-renews every 90 days

**Manual Check:**
1. Go to **Domain settings** > **HTTPS**
2. Status should show: "Certificate active"
3. If not, click **Verify DNS configuration**

### Step 5: Force HTTPS Redirect

1. Go to **Domain settings** > **HTTPS**
2. Enable **Force HTTPS**
3. All HTTP traffic redirects to HTTPS automatically

---

## 🔶 Option 2: Vercel Custom Domain

### Step 1: Add Domain to Vercel

```bash
# Login to Vercel
vercel login

# Add domain
vercel domains add alaskapay.com
```

**Or via Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your Alaska Pay project
3. Go to **Settings** > **Domains**
4. Enter: `alaskapay.com`
5. Click **Add**

### Step 2: Configure DNS Records

**At your domain registrar:**

#### Primary Domain (alaskapay.com)
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

#### WWW Subdomain (www.alaskapay.com)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Alternative (Vercel Nameservers):**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Step 3: Verify Domain

1. Wait 5-10 minutes after DNS changes
2. Vercel automatically checks DNS
3. Status changes to "Valid Configuration"

### Step 4: SSL Certificate

**Automatic:**
- Vercel auto-provisions SSL via Let's Encrypt
- Takes 1-2 hours after verification
- Auto-renews before expiration

**Check Status:**
```bash
vercel domains ls
```

### Step 5: HTTPS Redirect

**Automatic on Vercel:**
- HTTPS redirect enabled by default
- No configuration needed
- All HTTP → HTTPS automatically

---

## 🔧 DNS Configuration Details

### Complete DNS Records Table

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| A | @ | 75.2.60.5 (Netlify) | 3600 | Root domain |
| A | @ | 76.76.21.21 (Vercel) | 3600 | Root domain |
| CNAME | www | alaskapay.netlify.app | 3600 | WWW subdomain |
| CNAME | www | cname.vercel-dns.com | 3600 | WWW subdomain |

### Popular Domain Registrars

**GoDaddy:**
1. Login → My Products → DNS
2. Add/Edit records as above
3. Save changes

**Namecheap:**
1. Domain List → Manage → Advanced DNS
2. Add records as above
3. Save all changes

**Cloudflare:**
1. Select domain → DNS
2. Add records (disable proxy for initial setup)
3. Enable proxy after verification

**Google Domains:**
1. My domains → Manage → DNS
2. Custom records → Add records
3. Save

---

## ✅ Domain Verification Steps

### Netlify Verification

```bash
# Check DNS propagation
dig alaskapay.com
dig www.alaskapay.com

# Expected output for A record:
# alaskapay.com. 3600 IN A 75.2.60.5

# Expected output for CNAME:
# www.alaskapay.com. 3600 IN CNAME alaskapay.netlify.app
```

### Vercel Verification

```bash
# Check domain status
vercel domains inspect alaskapay.com

# Check DNS
nslookup alaskapay.com
nslookup www.alaskapay.com
```

---

## 🔒 SSL Certificate Setup

### Let's Encrypt (Automatic)

**Netlify:**
- Provisions within 1-2 hours
- Covers alaskapay.com and www.alaskapay.com
- Auto-renews 30 days before expiration

**Vercel:**
- Provisions within minutes to hours
- Wildcard support available
- Auto-renewal handled automatically

### Custom SSL Certificate (Advanced)

**If you have your own certificate:**

1. Generate CSR and private key
2. Purchase SSL from provider
3. Upload to platform:
   - Netlify: Domain settings > HTTPS > Custom certificate
   - Vercel: Contact support for enterprise plans

---

## 🚀 HTTPS Redirect Configuration

### Netlify HTTPS Redirect

**Automatic (Recommended):**
- Enable in dashboard: Domain settings > HTTPS > Force HTTPS

**Manual (_redirects file):**
```
# Force HTTPS
http://alaskapay.com/* https://alaskapay.com/:splat 301!
http://www.alaskapay.com/* https://www.alaskapay.com/:splat 301!
```

### Vercel HTTPS Redirect

**Automatic (Default):**
- Always enabled, no configuration needed

**Custom (vercel.json):**
```json
{
  "redirects": [
    {
      "source": "http://alaskapay.com/:path*",
      "destination": "https://alaskapay.com/:path*",
      "permanent": true
    }
  ]
}
```

---

## 🧪 Testing Your Setup

### 1. DNS Propagation Check
```bash
# Check if DNS has propagated
nslookup alaskapay.com
dig alaskapay.com

# Online tools
# https://dnschecker.org
# https://www.whatsmydns.net
```

### 2. SSL Certificate Check
```bash
# Check SSL certificate
openssl s_client -connect alaskapay.com:443 -servername alaskapay.com

# Online tools
# https://www.ssllabs.com/ssltest/
# https://www.sslshopper.com/ssl-checker.html
```

### 3. HTTPS Redirect Test
```bash
# Should redirect to HTTPS
curl -I http://alaskapay.com

# Expected: 301 Moved Permanently
# Location: https://alaskapay.com
```

### 4. Browser Test
1. Visit: http://alaskapay.com (should redirect to HTTPS)
2. Visit: https://alaskapay.com (should load with padlock)
3. Visit: www.alaskapay.com (should work)
4. Check certificate: Click padlock icon

---

## 🐛 Troubleshooting

### DNS Not Propagating
```bash
# Clear local DNS cache

# Windows
ipconfig /flushdns

# Mac
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches
```

### SSL Certificate Not Provisioning

**Netlify:**
1. Verify DNS is correct
2. Remove and re-add domain
3. Wait 24 hours
4. Contact support if still failing

**Vercel:**
1. Check DNS configuration
2. Remove domain and re-add
3. Try using Vercel nameservers
4. Check domain registrar restrictions

### Domain Shows "Not Secure"

1. Wait for SSL provisioning (up to 24 hours)
2. Clear browser cache
3. Check certificate status in dashboard
4. Verify HTTPS is enabled

### WWW Not Working

1. Verify CNAME record is correct
2. Check TTL hasn't expired
3. Add www as separate domain in dashboard
4. Wait for DNS propagation

---

## 📊 Domain Status Commands

```bash
# Netlify
netlify status
netlify domains:list

# Vercel
vercel domains ls
vercel inspect alaskapay.com

# DNS lookup
dig alaskapay.com +short
nslookup alaskapay.com

# SSL check
curl -vI https://alaskapay.com 2>&1 | grep -i ssl
```

---

## 🎯 Quick Reference

### Netlify DNS
- **A Record**: 75.2.60.5
- **CNAME**: your-site.netlify.app

### Vercel DNS
- **A Record**: 76.76.21.21
- **CNAME**: cname.vercel-dns.com

### SSL Providers
- **Let's Encrypt**: Free, auto-renewing
- **Cloudflare**: Free with proxy enabled
- **Custom**: Upload your own certificate

---

## ✅ Final Checklist

- [ ] Domain added to platform
- [ ] DNS records configured
- [ ] DNS propagation complete (24-48 hours)
- [ ] Domain verified in dashboard
- [ ] SSL certificate active
- [ ] HTTPS redirect enabled
- [ ] WWW subdomain working
- [ ] All pages load correctly
- [ ] No mixed content warnings
- [ ] Certificate valid for 90 days

---

## 🆘 Need Help?

**Netlify Support:**
- https://answers.netlify.com
- support@netlify.com

**Vercel Support:**
- https://vercel.com/support
- support@vercel.com

**DNS Propagation:**
- https://dnschecker.org
- Wait 24-48 hours for global propagation

---

**Your Alaska Pay app will be live at https://alaskapay.com! 🚀**

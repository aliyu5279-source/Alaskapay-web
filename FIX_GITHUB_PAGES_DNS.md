# Fix GitHub Pages DNS Error for alaskapay.ng

## The Problem
GitHub Pages can't find DNS records for `alaskapay.ng`. You need to configure DNS at your domain registrar.

## Quick Fix (5 Minutes)

### Step 1: Find Your Domain Registrar
Where did you buy `alaskapay.ng`? Common registrars:
- **Whogohost** (Nigerian registrar)
- **Qservers** (Nigerian registrar)
- **Namecheap**
- **GoDaddy**
- **Cloudflare**

### Step 2: Add These DNS Records

Log into your domain registrar and add these 4 A records:

```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @
Value: 185.199.111.153
TTL: 3600
```

**For www subdomain, add:**
```
Type: CNAME
Name: www
Value: aliyu5279-source.github.io
TTL: 3600
```

### Step 3: Wait for DNS Propagation
- Takes 5-60 minutes (sometimes up to 24 hours)
- Check status: https://dnschecker.org/#A/alaskapay.ng

### Step 4: Re-add Domain on GitHub
1. Go to: https://github.com/aliyu5279-source/Alaska-pay/settings/pages
2. Remove `alaskapay.ng` if it's there
3. Wait 5 minutes
4. Add `alaskapay.ng` again
5. Check "Enforce HTTPS" after SSL provisions

## Registrar-Specific Instructions

### For Whogohost (Nigerian)
1. Login: https://whogohost.com/members/clientarea.php
2. Go to: My Domains → Manage Domain → DNS Management
3. Delete any existing A records for `@`
4. Add the 4 A records above
5. Add the CNAME record for `www`
6. Save changes

### For Qservers (Nigerian)
1. Login: https://www.qservers.net/clients/
2. Go to: Services → My Services → Manage
3. Click: DNS Management
4. Add all records above
5. Save

### For Namecheap
1. Login: https://www.namecheap.com/myaccount/login/
2. Domain List → Manage → Advanced DNS
3. Delete existing A records
4. Add new records
5. Save

### For GoDaddy
1. Login: https://dcc.godaddy.com/
2. My Products → DNS
3. Add records
4. Save

## Verification

### Check DNS Records
Open Command Prompt and run:
```bash
nslookup alaskapay.ng
```

Should show:
```
Address: 185.199.108.153
Address: 185.199.109.153
Address: 185.199.110.153
Address: 185.199.111.153
```

### Check Online
Visit: https://dnschecker.org/#A/alaskapay.ng

All locations should show the GitHub Pages IPs.

## Common Issues

### "DNS record could not be retrieved"
- DNS records not added yet
- Wrong values entered
- Still propagating (wait longer)

### "Domain is already taken"
- Another GitHub Pages site uses this domain
- Contact GitHub Support

### "HTTPS not available"
- DNS not fully propagated yet
- Wait 24 hours after DNS setup
- SSL certificate provisioning in progress

## Alternative: Use Subdomain First

If main domain has issues, try subdomain:
```
app.alaskapay.ng → Your GitHub Pages site
```

Add CNAME record:
```
Type: CNAME
Name: app
Value: aliyu5279-source.github.io
TTL: 3600
```

Then use `app.alaskapay.ng` in GitHub Pages settings.

## Need Help?

1. **Check current DNS**: https://mxtoolbox.com/SuperTool.aspx?action=a%3aalaskapay.ng
2. **GitHub Pages docs**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
3. **Contact your registrar's support** if you can't find DNS settings

## Quick Checklist
- [ ] Found domain registrar login
- [ ] Added 4 A records for GitHub Pages
- [ ] Added CNAME record for www
- [ ] Waited 30+ minutes
- [ ] Verified DNS with dnschecker.org
- [ ] Re-added domain in GitHub Pages settings
- [ ] Enabled HTTPS after SSL provisions

# ✅ Domain Verification Checklist for alaskapay.com

## Step-by-step verification process

---

## 🎯 Pre-Verification Checklist

- [ ] Domain purchased and owned
- [ ] Access to domain registrar account
- [ ] Alaska Pay deployed to Netlify or Vercel
- [ ] DNS records added correctly
- [ ] Waited 5-10 minutes after DNS changes

---

## 🔷 Netlify Domain Verification

### Step 1: Add Domain
- [ ] Logged into Netlify dashboard
- [ ] Selected Alaska Pay site
- [ ] Went to Domain settings
- [ ] Clicked "Add custom domain"
- [ ] Entered "alaskapay.com"
- [ ] Clicked "Verify"

### Step 2: Configure DNS
- [ ] Added A record: @ → 75.2.60.5
- [ ] Added CNAME: www → alaskapay.netlify.app
- [ ] Saved changes at registrar
- [ ] Waited 5-10 minutes

### Step 3: Verify DNS
```bash
# Run these commands
dig alaskapay.com +short
# Expected: 75.2.60.5

dig www.alaskapay.com +short
# Expected: alaskapay.netlify.app
```

- [ ] A record returns correct IP
- [ ] CNAME returns correct value
- [ ] No errors in dig/nslookup

### Step 4: Netlify Verification
- [ ] Clicked "Verify DNS configuration" in Netlify
- [ ] Status changed from "Awaiting DNS" to "Verified"
- [ ] Green checkmark appears
- [ ] Domain shows as "Active"

### Step 5: SSL Certificate
- [ ] Went to HTTPS section
- [ ] Certificate status: "Provisioning" or "Active"
- [ ] Waited up to 24 hours if provisioning
- [ ] Certificate shows valid dates

### Step 6: Enable HTTPS
- [ ] Toggled "Force HTTPS" to ON
- [ ] Tested http://alaskapay.com (redirects to HTTPS)
- [ ] Tested https://alaskapay.com (loads with padlock)
- [ ] Tested www.alaskapay.com (works)

---

## 🔶 Vercel Domain Verification

### Step 1: Add Domain
- [ ] Logged into Vercel dashboard
- [ ] Selected Alaska Pay project
- [ ] Went to Settings → Domains
- [ ] Entered "alaskapay.com"
- [ ] Clicked "Add"

### Step 2: Configure DNS
- [ ] Added A record: @ → 76.76.21.21
- [ ] Added CNAME: www → cname.vercel-dns.com
- [ ] Saved changes at registrar
- [ ] Waited 5-10 minutes

### Step 3: Verify DNS
```bash
# Run these commands
dig alaskapay.com +short
# Expected: 76.76.21.21

dig www.alaskapay.com +short
# Expected: cname.vercel-dns.com
```

- [ ] A record returns correct IP
- [ ] CNAME returns correct value
- [ ] No errors in commands

### Step 4: Vercel Verification
- [ ] Domain status: "Valid Configuration"
- [ ] Green checkmark in dashboard
- [ ] No error messages
- [ ] Domain listed as active

### Step 5: SSL Certificate
- [ ] Certificate auto-provisioned
- [ ] Status shows "Active"
- [ ] HTTPS works immediately
- [ ] Certificate valid for 90 days

### Step 6: Test HTTPS
- [ ] http://alaskapay.com redirects to HTTPS (automatic)
- [ ] https://alaskapay.com loads correctly
- [ ] www.alaskapay.com works
- [ ] Padlock icon shows in browser

---

## 🧪 Testing Checklist

### DNS Propagation
```bash
# Check propagation globally
# Visit: https://dnschecker.org
# Enter: alaskapay.com
```

- [ ] Green checkmarks in multiple locations
- [ ] At least 50% propagated
- [ ] No red X marks

### SSL Certificate
```bash
# Check certificate
curl -vI https://alaskapay.com 2>&1 | grep -i ssl

# Or visit
# https://www.ssllabs.com/ssltest/analyze.html?d=alaskapay.com
```

- [ ] Certificate issued by Let's Encrypt
- [ ] Valid for alaskapay.com and www.alaskapay.com
- [ ] Expiration date 90 days in future
- [ ] SSL Labs grade A or A+

### HTTPS Redirect
```bash
# Test redirect
curl -I http://alaskapay.com
# Expected: 301 Moved Permanently
# Location: https://alaskapay.com
```

- [ ] HTTP redirects to HTTPS
- [ ] 301 status code (permanent)
- [ ] No redirect loops
- [ ] Fast redirect (< 1 second)

### Browser Testing
- [ ] Chrome: https://alaskapay.com loads
- [ ] Firefox: https://alaskapay.com loads
- [ ] Safari: https://alaskapay.com loads
- [ ] Edge: https://alaskapay.com loads
- [ ] Mobile browsers work
- [ ] No "Not Secure" warnings
- [ ] Padlock icon visible
- [ ] Certificate details accessible

### Functionality Testing
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Images load
- [ ] CSS/JS working
- [ ] Forms submit
- [ ] API calls work
- [ ] No mixed content warnings
- [ ] No console errors

---

## 🐛 Troubleshooting Checklist

### DNS Not Resolving
- [ ] Waited 24-48 hours
- [ ] Flushed local DNS cache
- [ ] Checked registrar for typos
- [ ] Removed conflicting records
- [ ] Used correct record types (A, CNAME)

### SSL Not Provisioning
- [ ] DNS fully propagated
- [ ] Domain verified in dashboard
- [ ] Waited 24 hours
- [ ] No CAA records blocking Let's Encrypt
- [ ] Removed and re-added domain

### HTTPS Not Working
- [ ] SSL certificate active
- [ ] Force HTTPS enabled
- [ ] Cleared browser cache
- [ ] Tried incognito mode
- [ ] Checked for mixed content

### WWW Not Working
- [ ] CNAME record correct
- [ ] Added www as separate domain
- [ ] DNS propagated
- [ ] SSL covers www subdomain

---

## 📊 Verification Commands Reference

```bash
# DNS lookup
dig alaskapay.com
nslookup alaskapay.com

# Trace DNS
dig alaskapay.com +trace

# Check nameservers
dig alaskapay.com NS

# SSL certificate
openssl s_client -connect alaskapay.com:443 -servername alaskapay.com

# HTTP headers
curl -I https://alaskapay.com

# Full test
curl -vL http://alaskapay.com
```

---

## ✅ Final Verification

### All Systems Go ✓
- [ ] Domain resolves correctly
- [ ] DNS fully propagated (100%)
- [ ] SSL certificate active and valid
- [ ] HTTPS redirect working
- [ ] WWW subdomain functional
- [ ] All pages load correctly
- [ ] No security warnings
- [ ] Mobile responsive
- [ ] Fast load times (< 3 seconds)
- [ ] SEO meta tags present

---

## 🎉 Success Criteria

Your domain is successfully configured when:

✅ https://alaskapay.com loads with padlock
✅ http://alaskapay.com redirects to HTTPS
✅ www.alaskapay.com works
✅ SSL Labs grade A or higher
✅ No browser warnings
✅ All functionality works
✅ DNS propagated globally

---

## 📞 Support Resources

**If verification fails:**

1. **Netlify**: https://answers.netlify.com
2. **Vercel**: https://vercel.com/support
3. **DNS Help**: https://dnschecker.org
4. **SSL Help**: https://www.ssllabs.com

**Wait 24-48 hours before contacting support!**

---

**Your Alaska Pay domain is ready! 🚀**

# AlaskaPay Custom Domain Setup Checklist

Complete this checklist to set up alaskapay.ng with all subdomains and email authentication.

## Pre-Setup Requirements

- [ ] Domain registered: alaskapay.ng
- [ ] Access to domain registrar DNS settings
- [ ] Netlify account with site deployed
- [ ] Supabase project created
- [ ] SendGrid account created
- [ ] Admin access to AlaskaPay dashboard

## Phase 1: DNS Configuration (15 minutes)

### Main Domain Records
- [ ] Add A record: @ → 75.2.60.5
- [ ] Add CNAME: www → alaskapay.netlify.app
- [ ] Verify main domain resolves: `nslookup alaskapay.ng`

### Subdomain Records
- [ ] Add CNAME: admin → alaskapay.netlify.app
- [ ] Add CNAME: api → your-project.supabase.co
- [ ] Verify subdomains resolve: `nslookup admin.alaskapay.ng`

### Email Authentication (SendGrid)
- [ ] Add TXT: @ → v=spf1 include:sendgrid.net ~all
- [ ] Add CNAME: s1._domainkey → s1.domainkey.u12345678.wl.sendgrid.net
- [ ] Add CNAME: s2._domainkey → s2.domainkey.u12345678.wl.sendgrid.net
- [ ] Add TXT: _dmarc → v=DMARC1; p=quarantine; rua=mailto:dmarc@alaskapay.ng

### Verification Records
- [ ] Add TXT: _alaskapay-verification → [token from dashboard]
- [ ] Add TXT: @ → [Netlify verification token]

## Phase 2: Netlify Configuration (10 minutes)

### Domain Setup
- [ ] Login to Netlify dashboard
- [ ] Navigate to Site Settings → Domain Management
- [ ] Add custom domain: alaskapay.ng
- [ ] Add custom domain: www.alaskapay.ng
- [ ] Add custom domain: admin.alaskapay.ng
- [ ] Add custom domain: api.alaskapay.ng

### SSL Certificates
- [ ] Wait for DNS propagation (5-60 minutes)
- [ ] Verify SSL provisioning started
- [ ] Check all domains show "HTTPS" status
- [ ] Enable "Force HTTPS" option
- [ ] Enable HSTS

### Redirects Configuration
- [ ] Verify netlify.toml in repository
- [ ] Verify public/_redirects file exists
- [ ] Deploy latest changes
- [ ] Test redirect rules

## Phase 3: SendGrid Setup (10 minutes)

### Domain Authentication
- [ ] Login to SendGrid dashboard
- [ ] Go to Settings → Sender Authentication
- [ ] Click "Authenticate Your Domain"
- [ ] Enter domain: alaskapay.ng
- [ ] Copy DNS records (already added in Phase 1)
- [ ] Click "Verify" button
- [ ] Confirm status: "Verified" ✅

### API Configuration
- [ ] Create API key in SendGrid
- [ ] Copy API key securely
- [ ] Add to Netlify environment variables: VITE_SENDGRID_API_KEY
- [ ] Configure from email: noreply@alaskapay.ng
- [ ] Test email sending

## Phase 4: Environment Variables (5 minutes)

### Netlify Environment Variables
- [ ] VITE_APP_URL = https://alaskapay.ng
- [ ] VITE_ADMIN_URL = https://admin.alaskapay.ng
- [ ] VITE_API_URL = https://api.alaskapay.ng
- [ ] VITE_SUPABASE_URL = https://api.alaskapay.ng
- [ ] VITE_SENDGRID_API_KEY = [your-key]
- [ ] VITE_SENDGRID_FROM_EMAIL = noreply@alaskapay.ng

### Redeploy
- [ ] Trigger new deployment
- [ ] Wait for deployment to complete
- [ ] Verify environment variables loaded

## Phase 5: Testing (15 minutes)

### Domain Access Tests
- [ ] Visit https://alaskapay.ng (should load)
- [ ] Visit http://alaskapay.ng (should redirect to HTTPS)
- [ ] Visit https://www.alaskapay.ng (should redirect to alaskapay.ng)
- [ ] Visit https://admin.alaskapay.ng (should show admin panel)
- [ ] Visit https://api.alaskapay.ng/health (should return 200)

### SSL Certificate Tests
- [ ] Check SSL certificate valid (browser lock icon)
- [ ] Verify certificate issuer: Let's Encrypt
- [ ] Check certificate expiry date (90 days)
- [ ] Test on SSL Labs: https://www.ssllabs.com/ssltest/
- [ ] Score should be A or A+

### Email Authentication Tests
- [ ] Send test email from noreply@alaskapay.ng
- [ ] Check email headers for SPF: PASS
- [ ] Check email headers for DKIM: PASS
- [ ] Check email headers for DMARC: PASS
- [ ] Test spam score: https://www.mail-tester.com
- [ ] Score should be 10/10

### Redirect Tests
```bash
# Test WWW redirect
curl -I https://www.alaskapay.ng
# Should return 301 to https://alaskapay.ng

# Test HTTP redirect
curl -I http://alaskapay.ng
# Should return 301 to https://alaskapay.ng

# Test admin subdomain
curl -I https://admin.alaskapay.ng
# Should return 200 OK

# Test API subdomain
curl -I https://api.alaskapay.ng/health
# Should return 200 OK
```

## Phase 6: Monitoring Setup (10 minutes)

### Uptime Monitoring
- [ ] Sign up for UptimeRobot or similar
- [ ] Add monitor: https://alaskapay.ng
- [ ] Add monitor: https://admin.alaskapay.ng
- [ ] Add monitor: https://api.alaskapay.ng/health
- [ ] Set alert email
- [ ] Test alerts

### SSL Monitoring
- [ ] Set up certificate expiry alerts
- [ ] Monitor SSL Labs score
- [ ] Check for mixed content warnings
- [ ] Enable browser console monitoring

### Email Monitoring
- [ ] Monitor SendGrid delivery rates
- [ ] Set up bounce rate alerts (>5%)
- [ ] Set up spam rate alerts (>0.1%)
- [ ] Monitor email reputation score

## Phase 7: Documentation (5 minutes)

### Update Documentation
- [ ] Update README.md with new domain
- [ ] Update API documentation URLs
- [ ] Update OAuth redirect URLs
- [ ] Update webhook URLs
- [ ] Update mobile app deep links

### Team Communication
- [ ] Notify team of new domain
- [ ] Share access credentials
- [ ] Update internal documentation
- [ ] Schedule training if needed

## Phase 8: Post-Launch (Ongoing)

### First 24 Hours
- [ ] Monitor error logs
- [ ] Check analytics for traffic
- [ ] Verify all features working
- [ ] Monitor email deliverability
- [ ] Check SSL certificate status

### First Week
- [ ] Review uptime reports
- [ ] Check email bounce rates
- [ ] Monitor API performance
- [ ] Review user feedback
- [ ] Optimize as needed

### Ongoing Maintenance
- [ ] Monitor SSL expiry (auto-renews)
- [ ] Review DNS records monthly
- [ ] Check email reputation weekly
- [ ] Update documentation as needed
- [ ] Regular security audits

## Troubleshooting Checklist

### If Domain Not Loading
- [ ] Check DNS propagation: https://dnschecker.org
- [ ] Verify A/CNAME records correct
- [ ] Clear browser cache
- [ ] Try incognito mode
- [ ] Wait up to 48 hours

### If SSL Not Working
- [ ] Verify DNS points to Netlify
- [ ] Check Netlify SSL status
- [ ] Wait 24 hours for provisioning
- [ ] Remove CAA records if present
- [ ] Contact Netlify support

### If Emails Going to Spam
- [ ] Verify SPF, DKIM, DMARC pass
- [ ] Check sender reputation
- [ ] Warm up IP address
- [ ] Remove spam trigger words
- [ ] Clean email list

## Success Criteria

All items below should be ✅:
- [ ] All domains accessible via HTTPS
- [ ] SSL certificates valid and auto-renewing
- [ ] All HTTP traffic redirects to HTTPS
- [ ] Admin panel accessible at admin.alaskapay.ng
- [ ] API accessible at api.alaskapay.ng
- [ ] Email authentication verified
- [ ] Test emails delivered successfully
- [ ] Spam score 10/10
- [ ] Uptime monitoring active
- [ ] Team notified and trained

## Support Contacts

**DNS Issues**: domains@alaskapay.ng
**SSL Problems**: ssl@alaskapay.ng
**Email Issues**: email-support@alaskapay.ng
**General Support**: support@alaskapay.ng

## Estimated Total Time

- DNS Configuration: 15 minutes
- Netlify Setup: 10 minutes
- SendGrid Setup: 10 minutes
- Environment Variables: 5 minutes
- Testing: 15 minutes
- Monitoring: 10 minutes
- Documentation: 5 minutes

**Total Active Time**: ~70 minutes
**Total with DNS Propagation**: 2-24 hours

## Next Steps After Completion

1. Update OAuth providers with new redirect URLs
2. Configure payment webhooks with new domain
3. Update mobile app configuration
4. Set up additional subdomains if needed
5. Configure CDN for static assets
6. Enable advanced security features
7. Set up backup domain (optional)

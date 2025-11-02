# Domain Setup Checklist

Complete this checklist when adding a custom domain to Alaska Pay.

## Pre-Setup

- [ ] Domain purchased and active
- [ ] Access to domain registrar account
- [ ] Know your registrar (GoDaddy, Namecheap, etc.)
- [ ] Admin access to Alaska Pay dashboard

## Add Domain

- [ ] Login to Alaska Pay Admin Dashboard
- [ ] Navigate to Custom Domains tab
- [ ] Click "Add Domain" button
- [ ] Enter domain name
- [ ] Select domain type (Web/API/Both)
- [ ] Choose registrar from dropdown
- [ ] Submit domain

## Configure DNS

- [ ] Copy verification token
- [ ] Login to domain registrar
- [ ] Navigate to DNS management
- [ ] Add A record for root domain
- [ ] Add CNAME for www subdomain
- [ ] Add CNAME for api (if needed)
- [ ] Add TXT record for verification
- [ ] Save all DNS changes
- [ ] Wait 5-60 minutes for propagation

## Verify Domain

- [ ] Return to Alaska Pay dashboard
- [ ] Open domain details
- [ ] Click "Verify Domain" button
- [ ] Check verification status
- [ ] Confirm all DNS records configured
- [ ] Domain status shows "Verified"

## SSL Certificate

- [ ] SSL status shows "Provisioning"
- [ ] Wait 5-15 minutes
- [ ] SSL status changes to "Active"
- [ ] Test HTTPS access
- [ ] Verify certificate valid

## Testing

- [ ] Visit domain in browser
- [ ] Check HTTPS working
- [ ] Test www redirect
- [ ] Test API endpoints (if configured)
- [ ] Verify mobile access
- [ ] Check different browsers

## Post-Setup

- [ ] Update app configuration
- [ ] Update OAuth redirect URLs
- [ ] Update webhook URLs
- [ ] Notify team of new domain
- [ ] Update documentation
- [ ] Monitor domain health

## Troubleshooting

If issues occur:
- [ ] Check DNS propagation: nslookup domain.com
- [ ] Verify DNS records exact match
- [ ] Clear browser cache
- [ ] Wait full 24-48 hours
- [ ] Contact support if needed

## Completion

Domain setup complete when:
- ✅ Domain verified
- ✅ SSL certificate active
- ✅ Website accessible via HTTPS
- ✅ All tests passing

# Alaska Pay Pre-Deployment Checklist

## 1. Database Migrations ✓

### Before Deployment
- [ ] Review all migration files in `supabase/migrations/`
- [ ] Test migrations on staging database
- [ ] Backup production database
- [ ] Run migrations: `npm run db:migrate`
- [ ] Verify all tables created successfully
- [ ] Check indexes and constraints
- [ ] Seed initial data if needed

### Key Tables to Verify
- [ ] users, profiles, wallets
- [ ] transactions, payment_methods
- [ ] virtual_cards, beneficiaries
- [ ] kyc_verifications, audit_logs
- [ ] webhooks, notifications

## 2. API Keys Verification ✓

### Required Keys
- [ ] VITE_SUPABASE_URL
- [ ] VITE_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] PAYSTACK_SECRET_KEY
- [ ] PAYSTACK_PUBLIC_KEY
- [ ] OPENAI_API_KEY (for AI features)
- [ ] SENDGRID_API_KEY (for emails)

### Verification Steps
```bash
# Check environment variables
npm run verify:env

# Test API connections
curl -X GET "YOUR_SUPABASE_URL/rest/v1/" \
  -H "apikey: YOUR_ANON_KEY"
```

## 3. Security Headers ✓

### Netlify (_headers file)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

### Vercel (vercel.json)
- [ ] Verify headers in `vercel.json`
- [ ] Enable HTTPS redirect
- [ ] Configure CORS policies

## 4. SSL Setup ✓

### Automatic SSL (Recommended)
- [ ] Netlify: Auto-provisions Let's Encrypt
- [ ] Vercel: Auto-provisions SSL
- [ ] Verify HTTPS redirect enabled

### Custom SSL
- [ ] Upload SSL certificate
- [ ] Configure private key
- [ ] Set up certificate chain
- [ ] Test SSL: `https://www.ssllabs.com/ssltest/`

## 5. Custom Domain Configuration ✓

### DNS Records
```
A     @       76.76.21.21
CNAME www     your-app.netlify.app
```

### Steps
- [ ] Add domain in Netlify/Vercel dashboard
- [ ] Configure DNS records at registrar
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Verify domain: `dig yourdomain.com`
- [ ] Enable HTTPS on custom domain
- [ ] Test www and non-www versions

## 6. Post-Deployment Testing ✓

### Critical User Flows
- [ ] User registration and email verification
- [ ] Login with 2FA
- [ ] Wallet funding via Paystack
- [ ] Send money to beneficiary
- [ ] Virtual card creation
- [ ] Bill payment
- [ ] Transaction history viewing
- [ ] KYC submission

### API Endpoints
```bash
# Health check
curl https://yourdomain.com/api/health

# Test authentication
curl -X POST https://yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Mobile responsiveness
- [ ] Cross-browser testing

### Security Tests
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF token validation
- [ ] Rate limiting working
- [ ] Webhook signature verification

## 7. Monitoring Setup ✓

- [ ] Enable error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure alert notifications
- [ ] Enable analytics tracking
- [ ] Set up log aggregation

## 8. Final Checks ✓

- [ ] Environment variables set correctly
- [ ] Database backups configured
- [ ] CDN caching enabled
- [ ] 404 page working
- [ ] Robots.txt configured
- [ ] Sitemap.xml generated
- [ ] Privacy policy and terms updated
- [ ] Support contact information correct

## Deployment Commands

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Vercel
```bash
npm run build
vercel --prod
```

## Rollback Plan

If deployment fails:
1. Revert to previous Git commit
2. Restore database backup
3. Clear CDN cache
4. Notify users of maintenance

## Post-Deployment

- [ ] Monitor error logs for 24 hours
- [ ] Check transaction success rates
- [ ] Verify webhook deliveries
- [ ] Test payment processing
- [ ] Review user feedback

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Version:** _____________

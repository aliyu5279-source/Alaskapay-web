# 🔧 Environment Variables Setup Guide

## Overview

AlaskaPay uses environment variables for configuration. This guide covers setup for development and production.

---

## 📝 Quick Setup

### 1. Copy Example File
```bash
cp .env.example .env
```

### 2. Fill in Required Values

**Minimum Required (Development):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

**Production Values:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_SECRET_KEY=sk_live_xxx
```

---

## 🔑 Getting API Keys

### Supabase (Required)
1. Visit https://supabase.com/dashboard
2. Create new project or select existing
3. Go to Settings → API
4. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`

### Paystack (Required for Payments)
1. Visit https://dashboard.paystack.com
2. Go to Settings → API Keys & Webhooks
3. Copy:
   - Public Key → `VITE_PAYSTACK_PUBLIC_KEY`
   - Secret Key → `PAYSTACK_SECRET_KEY`

**Note:** Use test keys for development, live keys for production.

### SendGrid (Optional - Email)
1. Visit https://app.sendgrid.com
2. Settings → API Keys
3. Create new API key
4. Copy to `SENDGRID_API_KEY`

### Twilio (Optional - SMS)
1. Visit https://console.twilio.com
2. Copy Account SID and Auth Token
3. Get a phone number
4. Add to `.env`

---

## 🌐 Platform-Specific Setup

### Netlify
1. Site settings → Environment variables
2. Add each variable with key and value
3. Redeploy site

### Vercel
1. Project settings → Environment Variables
2. Add variables for Production/Preview
3. Redeploy

### GitHub Actions (Mobile CI/CD)
See `SECRETS_SETUP_CHECKLIST.md` for 16 required secrets.

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` in `.gitignore`
- Use test keys in development
- Rotate keys regularly
- Use different keys per environment
- Store secrets in platform dashboards

### ❌ DON'T:
- Commit `.env` to Git
- Share keys in public channels
- Use production keys in development
- Hardcode secrets in code

---

## 🧪 Testing Your Setup

```bash
# Start dev server
npm run dev

# Check console for errors
# Try logging in
# Test a payment
```

---

## 📋 Environment Variables Reference

### Client-Side (VITE_ prefix)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase public key
- `VITE_PAYSTACK_PUBLIC_KEY` - Paystack public key
- `VITE_APP_NAME` - Application name
- `VITE_APP_URL` - Production URL

### Server-Side (Edge Functions)
- `PAYSTACK_SECRET_KEY` - Paystack secret key
- `SENDGRID_API_KEY` - SendGrid API key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token

---

## 🆘 Troubleshooting

### Variables not loading?
- Restart dev server after changes
- Check variable names (case-sensitive)
- Ensure `VITE_` prefix for client-side

### Still having issues?
- Check `.env` file location (project root)
- Verify no extra spaces in values
- Check quotes around values with spaces

---

## ✅ Verification

Your environment is ready when:
- [ ] `.env` file exists
- [ ] All required variables set
- [ ] Dev server starts without errors
- [ ] Can authenticate users
- [ ] Payments process successfully

**Next:** Run `npm run dev` to start development!

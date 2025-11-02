# AlaskaPay - Quick Operational Setup

## Current Status
✅ Frontend: https://secure-payments-wallet-1-4c5mv7347-aliyu-ibrahims-projects.vercel.app
✅ Backend: https://psafbcbhbidnbzfsccsu.supabase.co
❌ Not Connected - Follow steps below

## Step 1: Vercel Environment Variables (5 mins)

1. Go to: https://vercel.com/dashboard
2. Select project → Settings → Environment Variables
3. Add these:

```
VITE_SUPABASE_URL=https://psafbcbhbidnbzfsccsu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYWZiY2JoYmlkbmJ6ZnNjY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTA1MTIsImV4cCI6MjA3NTE2NjUxMn0.RrZpBW6JujulVZ8H74k1EizS7dz3qHIwhyNJmoxwvKI
VITE_PAYSTACK_PUBLIC_KEY=pk_test_YOUR_KEY
VITE_APP_NAME=Alaska Pay
```

4. Click **Redeploy**

## Step 2: Setup Database (10 mins)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref psafbcbhbidnbzfsccsu

# Run migrations
supabase db push

# Seed data
node scripts/seed-database.js
```

## Step 3: Deploy Edge Functions (5 mins)

```bash
supabase functions deploy verify-paystack-payment
supabase functions deploy paystack-webhook
supabase functions deploy process-bill-commission
supabase functions deploy settle-commission-paystack
```

## Step 4: Configure Paystack (5 mins)

1. Get keys: https://dashboard.paystack.com/#/settings/developer
2. Add webhook: https://psafbcbhbidnbzfsccsu.supabase.co/functions/v1/paystack-webhook
3. Set secret:
```bash
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_YOUR_KEY
```

## Step 5: Test (5 mins)

1. Visit your Vercel URL
2. Sign up with email
3. Fund wallet with Paystack
4. Make a bill payment
5. Check commission credited

## Troubleshooting

**Can't login?** Check Vercel env vars are set
**Payment fails?** Verify Paystack webhook configured
**No commission?** Check edge function deployed

## Next: Mobile Deployment
See NATIVE_MOBILE_COMPLETE.md for Android/iOS setup

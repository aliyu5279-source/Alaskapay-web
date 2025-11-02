# Make AlaskaPay Fully Operational - Complete Integration Guide

## Current Status
✅ Frontend deployed to Vercel: https://secure-payments-wallet-1-4c5mv7347-aliyu-ibrahims-projects.vercel.app
✅ Supabase backend configured: https://psafbcbhbidnbzfsccsu.supabase.co
❌ Frontend-Backend connection not active
❌ Services not operational

## Step 1: Configure Environment Variables on Vercel

### 1.1 Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your project: `secure-payments-wallet-1`
3. Go to **Settings** → **Environment Variables**

### 1.2 Add Required Variables
Add these environment variables:

```env
VITE_SUPABASE_URL=https://psafbcbhbidnbzfsccsu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYWZiY2JoYmlkbmJ6ZnNjY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTA1MTIsImV4cCI6MjA3NTE2NjUxMn0.RrZpBW6JujulVZ8H74k1EizS7dz3qHIwhyNJmoxwvKI
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_paystack_key
VITE_APP_NAME=Alaska Pay
VITE_APP_URL=https://secure-payments-wallet-1-4c5mv7347-aliyu-ibrahims-projects.vercel.app
VITE_ENABLE_BILL_PAYMENTS=true
VITE_ENABLE_VIRTUAL_CARDS=true
VITE_ENABLE_SUBSCRIPTIONS=true
```

### 1.3 Redeploy
After adding variables, click **Redeploy** to apply changes.

## Step 2: Setup Supabase Database

### 2.1 Run Database Migration
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref psafbcbhbidnbzfsccsu

# Push all migrations
supabase db push
```

### 2.2 Seed Initial Data
```bash
# Run seed script
node scripts/seed-database.js
```

This creates:
- Nigerian banks list
- Currency configurations
- Bill payment providers
- Commission rules
- Initial admin user

## Step 3: Configure Paystack Integration

### 3.1 Get Paystack API Keys
1. Go to: https://dashboard.paystack.com/#/settings/developer
2. Copy your **Public Key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3.2 Add to Supabase Secrets
```bash
# Add Paystack secret key
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_secret_key
```

### 3.3 Update Vercel Environment
Add to Vercel environment variables:
```
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
```

## Step 4: Deploy Supabase Edge Functions

### 4.1 Deploy All Functions
```bash
# Deploy all edge functions
supabase functions deploy verify-paystack-payment
supabase functions deploy paystack-webhook
supabase functions deploy process-bill-commission
supabase functions deploy settle-commission-paystack
supabase functions deploy send-push-notification
supabase functions deploy send-transactional-email
supabase functions deploy verify-bank-account
supabase functions deploy create-paystack-recipient
```

### 4.2 Set Function Secrets
```bash
# Set all required secrets
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_key
supabase secrets set SENDGRID_API_KEY=your_sendgrid_key
supabase secrets set VAPID_PUBLIC_KEY=your_vapid_public_key
supabase secrets set VAPID_PRIVATE_KEY=your_vapid_private_key
```

## Step 5: Configure Paystack Webhooks

### 5.1 Setup Webhook URL
1. Go to: https://dashboard.paystack.com/#/settings/developer
2. Click **Webhooks**
3. Add webhook URL:
```
https://psafbcbhbidnbzfsccsu.supabase.co/functions/v1/paystack-webhook
```

### 5.2 Select Events
Enable these events:
- ✅ charge.success
- ✅ transfer.success
- ✅ transfer.failed
- ✅ transfer.reversed

## Step 6: Enable Row Level Security Policies

Run in Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_balances ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only see their own data)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own wallet" ON wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
```

## Step 7: Test the Application

### 7.1 Create Test User
1. Visit your Vercel URL
2. Click **Sign Up**
3. Register with email and password
4. Verify email (check Supabase Auth emails)

### 7.2 Test Wallet Funding
1. Login to dashboard
2. Click **Fund Wallet**
3. Enter amount (e.g., ₦1000)
4. Complete Paystack payment
5. Verify balance updates

### 7.3 Test Bill Payment
1. Go to **Services** section
2. Select a biller (e.g., EKEDC - Electricity)
3. Enter meter number
4. Complete payment
5. Check commission credited to Alaska Mega Plus Ltd

### 7.4 Test Virtual Cards
1. Go to **Virtual Cards**
2. Click **Create Card**
3. Fund the card
4. Verify card details displayed

## Step 8: Monitor and Debug

### 8.1 Check Supabase Logs
```bash
# View function logs
supabase functions logs verify-paystack-payment
supabase functions logs paystack-webhook
```

### 8.2 Check Database
```sql
-- Check users
SELECT * FROM users LIMIT 10;

-- Check wallets
SELECT * FROM wallets;

-- Check transactions
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;

-- Check commissions
SELECT * FROM commission_balances;
```

### 8.3 Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click **Deployments**
4. View logs for errors

## Step 9: Setup Commission Auto-Settlement

### 9.1 Configure Taj Bank Recipient
Run this in your app (as admin):
```javascript
// This creates Paystack recipient for Taj Bank
const response = await fetch(
  'https://psafbcbhbidnbzfsccsu.supabase.co/functions/v1/create-paystack-recipient',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY'
    },
    body: JSON.stringify({
      account_number: '0013010127',
      bank_code: '000026',
      name: 'Alaska Mega Plus Ltd'
    })
  }
);
```

### 9.2 Enable Auto-Settlement
The system automatically settles commissions daily at 11 PM when balance ≥ ₦1,000.

## Step 10: Production Checklist

Before going live:

- [ ] Change Paystack to LIVE keys (pk_live_ and sk_live_)
- [ ] Update VITE_APP_URL to your custom domain
- [ ] Enable SSL certificate on custom domain
- [ ] Test all payment flows with real money (small amounts)
- [ ] Setup monitoring alerts
- [ ] Configure backup schedule
- [ ] Add admin users
- [ ] Test commission settlement
- [ ] Verify webhook deliveries
- [ ] Enable rate limiting
- [ ] Setup error tracking (Sentry)

## Troubleshooting

### Issue: "Supabase client not configured"
**Solution**: Ensure environment variables are set on Vercel and redeploy.

### Issue: "Payment not confirming"
**Solution**: 
1. Check Paystack webhook is configured
2. Verify edge function is deployed
3. Check function logs for errors

### Issue: "Commission not credited"
**Solution**:
1. Verify commission rules exist in database
2. Check process-bill-commission function logs
3. Ensure bill payment completed successfully

### Issue: "Can't login"
**Solution**:
1. Check Supabase Auth is enabled
2. Verify email confirmation settings
3. Check RLS policies are correct

## Support Commands

```bash
# Check Supabase status
supabase status

# View all functions
supabase functions list

# Test function locally
supabase functions serve verify-paystack-payment

# View database tables
supabase db list

# Reset database (WARNING: Deletes all data)
supabase db reset
```

## Next Steps After Operational

1. **Mobile Deployment**: Deploy to Android/iOS using Capacitor
2. **Custom Domain**: Setup alaskapay.com domain
3. **Analytics**: Enable Google Analytics
4. **Monitoring**: Setup Sentry for error tracking
5. **Backups**: Configure automated database backups

## Contact Support

If you encounter issues:
1. Check logs first (Vercel + Supabase)
2. Review this guide step-by-step
3. Test with Paystack test mode first
4. Verify all environment variables are set

---

**Status Check URL**: https://psafbcbhbidnbzfsccsu.supabase.co/functions/v1/health-check

Once operational, you should see:
- ✅ Users can register and login
- ✅ Wallet funding works
- ✅ Bill payments process
- ✅ Commissions auto-credit
- ✅ Virtual cards create successfully

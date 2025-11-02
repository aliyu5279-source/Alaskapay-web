# 🚀 AlaskaPay - Make It Operational NOW

Your app is deployed but dormant. Follow these 4 steps to make it fully operational.

## ⚡ Step 1: Configure Vercel (5 minutes)

### Option A: Web Interface (Easiest)
1. Go to: https://vercel.com/dashboard
2. Select: `secure-payments-wallet-1`
3. Click: **Settings** → **Environment Variables**
4. Add these 3 variables:

```
VITE_SUPABASE_URL = https://psafbcbhbidnbzfsccsu.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYWZiY2JoYmlkbmJ6ZnNjY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTA1MTIsImV4cCI6MjA3NTE2NjUxMn0.RrZpBW6JujulVZ8H74k1EizS7dz3qHIwhyNJmoxwvKI
VITE_PAYSTACK_PUBLIC_KEY = pk_test_YOUR_KEY
```

5. Click **Redeploy**

### Option B: Automated Script
```bash
chmod +x scripts/setup-vercel-env.sh
./scripts/setup-vercel-env.sh
```

## 📊 Step 2: Setup Database (10 minutes)

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref psafbcbhbidnbzfsccsu

# Run migrations
supabase db push

# Add initial data
node scripts/seed-database.js
```

## 🔧 Step 3: Deploy Functions (5 minutes)

```bash
# Deploy payment functions
supabase functions deploy verify-paystack-payment
supabase functions deploy paystack-webhook
supabase functions deploy process-bill-commission
supabase functions deploy settle-commission-paystack

# Set Paystack secret
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_YOUR_KEY
```

## 💳 Step 4: Configure Paystack (5 minutes)

1. Get keys: https://dashboard.paystack.com/#/settings/developer
2. Add webhook URL:
```
https://psafbcbhbidnbzfsccsu.supabase.co/functions/v1/paystack-webhook
```
3. Enable events: charge.success, transfer.success

## ✅ Test It Works

1. Visit: https://secure-payments-wallet-1-4c5mv7347-aliyu-ibrahims-projects.vercel.app
2. Sign up with email
3. Fund wallet (₦1000)
4. Make bill payment (₦500)
5. Check commission credited

**Test Card:**
```
4084 0840 8408 4081
12/25 | CVV: 408 | PIN: 0000 | OTP: 123456
```

## 🎯 Success Indicators

✅ Can register and login
✅ Wallet funding works
✅ Bill payments process
✅ Commission auto-credits to Taj Bank (0013010127)
✅ Virtual cards work
✅ All services operational

## 📚 Detailed Guides

- **Vercel Setup**: See `VERCEL_ENV_SETUP_GUIDE.md`
- **Database**: See `SUPABASE_SETUP_COMMANDS.md`
- **Testing**: See `TEST_SERVICES_GUIDE.md`
- **Quick Start**: See `QUICK_OPERATIONAL_SETUP.md`

## 🆘 Need Help?

**Issue: Can't login**
→ Check Vercel env vars set and redeployed

**Issue: Payment fails**
→ Verify Paystack webhook configured

**Issue: No commission**
→ Check edge functions deployed

## 📱 Next: Mobile Apps

Once web is working:
```bash
# Build Android
npm run build:android

# Build iOS
npm run build:ios
```

See `NATIVE_MOBILE_COMPLETE.md` for mobile deployment.

---

**Total Time: 25 minutes**
**Result: Fully operational AlaskaPay**

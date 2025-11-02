# Complete Vercel Environment Variables Setup

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard/project/psafbcbhbidnbzfsccsu
2. Click **Settings** (gear icon) → **API**
3. Copy these values:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon public** key → This is your `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → This is your `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Get Your Paystack Credentials

1. Go to https://dashboard.paystack.com/#/settings/developers
2. Copy these values:
   - **Public Key** → This is your `VITE_PAYSTACK_PUBLIC_KEY`
   - **Secret Key** → This is your `PAYSTACK_SECRET_KEY`

⚠️ **IMPORTANT**: Use **TEST** keys for testing, **LIVE** keys for production!

### Step 3: Add to Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

#### Required Variables (Add All):

```
VITE_SUPABASE_URL
Value: https://psafbcbhbidnbzfsccsu.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development
```

```
VITE_SUPABASE_ANON_KEY
Value: [Paste your anon key from Supabase]
Environments: ✓ Production ✓ Preview ✓ Development
```

```
SUPABASE_SERVICE_ROLE_KEY
Value: [Paste your service_role key from Supabase]
Environments: ✓ Production ✓ Preview ✓ Development
```

```
VITE_PAYSTACK_PUBLIC_KEY
Value: [Paste your Paystack public key]
Environments: ✓ Production ✓ Preview ✓ Development
```

```
PAYSTACK_SECRET_KEY
Value: [Paste your Paystack secret key]
Environments: ✓ Production ✓ Preview ✓ Development
```

```
VITE_APP_URL
Value: https://your-domain.vercel.app
Environments: ✓ Production ✓ Preview ✓ Development
```

```
VITE_COMMISSION_RATE
Value: 0.015
Environments: ✓ Production ✓ Preview ✓ Development
```

```
VITE_COMMISSION_BANK_ACCOUNT
Value: 0013010127
Environments: ✓ Production ✓ Preview ✓ Development
```

```
VITE_COMMISSION_BANK_NAME
Value: Taj Bank
Environments: ✓ Production ✓ Preview ✓ Development
```

```
VITE_COMMISSION_ACCOUNT_NAME
Value: Alaska Mega Plus Ltd
Environments: ✓ Production ✓ Preview ✓ Development
```

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click the **three dots** on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache: No**
5. Click **Redeploy**

---

## 🎯 Verification

After redeployment, test your site:

1. **Sign Up**: Create a new account
2. **Fund Wallet**: Add money via Paystack
3. **Make Payment**: Send money to another user
4. **Check Commission**: Verify 1.5% goes to Taj Bank 0013010127

---

## 📋 Complete Environment Variables Checklist

### Frontend Variables (VITE_*)
- [ ] VITE_SUPABASE_URL
- [ ] VITE_SUPABASE_ANON_KEY
- [ ] VITE_PAYSTACK_PUBLIC_KEY
- [ ] VITE_APP_URL
- [ ] VITE_COMMISSION_RATE
- [ ] VITE_COMMISSION_BANK_ACCOUNT
- [ ] VITE_COMMISSION_BANK_NAME
- [ ] VITE_COMMISSION_ACCOUNT_NAME

### Backend Variables (Server-side)
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] PAYSTACK_SECRET_KEY

---

## 🔧 Alternative: Use Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add VITE_PAYSTACK_PUBLIC_KEY
vercel env add PAYSTACK_SECRET_KEY
vercel env add VITE_APP_URL
vercel env add VITE_COMMISSION_RATE
vercel env add VITE_COMMISSION_BANK_ACCOUNT
vercel env add VITE_COMMISSION_BANK_NAME
vercel env add VITE_COMMISSION_ACCOUNT_NAME

# Deploy
vercel --prod
```

---

## 🚨 Troubleshooting

### Issue: "Supabase client not initialized"
**Solution**: Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set

### Issue: "Paystack payment fails"
**Solution**: Verify VITE_PAYSTACK_PUBLIC_KEY is correct and active

### Issue: "Commission not deducted"
**Solution**: Check VITE_COMMISSION_RATE is set to 0.015

### Issue: "Changes not reflecting"
**Solution**: Redeploy without build cache

---

## 📞 Support

- Supabase Dashboard: https://supabase.com/dashboard/project/psafbcbhbidnbzfsccsu
- Paystack Dashboard: https://dashboard.paystack.com
- Vercel Dashboard: https://vercel.com/dashboard

---

## ✅ Success Indicators

After setup, you should see:
- ✓ Users can sign up and login
- ✓ Wallet balances display correctly
- ✓ Paystack payment modal opens
- ✓ Transactions save to database
- ✓ 1.5% commission deducted automatically
- ✓ Commission tracked for Alaska Mega Plus Ltd

**Setup Time**: ~5 minutes
**Next Step**: Test all features on your live site!

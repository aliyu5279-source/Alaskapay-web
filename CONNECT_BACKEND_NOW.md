# 🔌 Connect Supabase Backend & Paystack Payments

## ✅ Your Supabase is Already Connected!

Good news! Your Supabase backend is **already configured** in the code:
- **URL**: `https://psafbcbhbidnbzfsccsu.supabase.co`
- **Status**: ✅ Active and working

---

## 🚀 Step 1: Add Paystack API Keys to Vercel

### Get Your Paystack Keys:

1. Go to https://dashboard.paystack.com/settings/developer
2. Login with: **pescotservices@gmail.com**
3. Copy your **Test Secret Key** (starts with `sk_test_`)
4. Copy your **Test Public Key** (starts with `pk_test_`)

### Add to Vercel:

1. Go to https://vercel.com/aliyu5279-source/alaskapay-web/settings/environment-variables
2. Add these variables:

```
VITE_PAYSTACK_SECRET_KEY = sk_test_your_key_here
VITE_PAYSTACK_PUBLIC_KEY = pk_test_your_key_here
```

3. Click **Save**
4. Go to **Deployments** tab → Click **Redeploy**

---

## 🧪 Step 2: Test the Connection

### Test Paystack Payment:

Visit: https://alaskapay-web.vercel.app

1. Click **Sign Up** or **Login**
2. Go to **Wallet** section
3. Click **Top Up Wallet**
4. Enter amount: **₦1,000**
5. Use Paystack test card:

```
Card Number: 4084 0840 8408 4081
Expiry: 12/25
CVV: 408
PIN: 1234
```

If payment succeeds → ✅ Paystack is connected!

---

## 📊 Step 3: Verify Supabase Database

### Check Database Tables:

1. Go to https://supabase.com/dashboard/project/psafbcbhbidnbzfsccsu
2. Click **Table Editor**
3. Verify these tables exist:
   - ✅ `profiles`
   - ✅ `wallets`
   - ✅ `transactions`
   - ✅ `payment_methods`

If tables are missing, run: `npm run setup:database`

---

## 🎯 What's Already Working:

✅ Supabase Authentication (Login/Signup)
✅ Supabase Database (User profiles, wallets)
✅ Real-time updates
✅ Paystack service code (just needs API keys)

---

## 🔧 Troubleshooting:

### If Paystack payment fails:
- Check API keys are correct in Vercel
- Make sure you redeployed after adding keys
- Verify you're using TEST keys (not live keys)

### If login fails:
- Supabase is already connected
- Check browser console for errors
- Email verification may be required

---

## 📞 Need Help?

Your backend is 90% ready! Just add Paystack keys and you're live! 🚀

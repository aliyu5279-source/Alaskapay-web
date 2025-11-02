# ⚡ Quick Paystack Setup (2 Minutes)

## Step 1: Get Your Paystack Keys (1 min)

1. Go to: https://dashboard.paystack.com/settings/developer
2. Login with: **pescotservices@gmail.com**
3. Copy these two keys:
   - **Test Public Key** (starts with `pk_test_`)
   - **Test Secret Key** (starts with `sk_test_`)

---

## Step 2: Add Keys to Vercel (1 min)

1. Go to: https://vercel.com/aliyu5279-source/alaskapay-web/settings/environment-variables

2. Click **Add New** and enter:

### First Variable:
```
Name: VITE_PAYSTACK_PUBLIC_KEY
Value: pk_test_[paste your key here]
```

### Second Variable:
```
Name: VITE_PAYSTACK_SECRET_KEY
Value: sk_test_[paste your key here]
```

3. Click **Save** for each

---

## Step 3: Redeploy (30 seconds)

1. Go to: https://vercel.com/aliyu5279-source/alaskapay-web
2. Click **Deployments** tab
3. Click the **⋮** menu on latest deployment
4. Click **Redeploy**
5. Wait 30-60 seconds

---

## ✅ Test Payment

1. Visit: https://alaskapay-web.vercel.app
2. Login or Sign Up
3. Go to **Wallet** → **Top Up**
4. Enter ₦1,000
5. Use test card:
   - **Card**: 4084 0840 8408 4081
   - **Expiry**: 12/25
   - **CVV**: 408
   - **PIN**: 1234

If successful → 🎉 Paystack is connected!

---

## 🔧 Troubleshooting

**Payment fails?**
- Check keys are correct (no extra spaces)
- Make sure you clicked "Save" in Vercel
- Verify you redeployed after adding keys
- Use TEST keys (not live keys)

**Still not working?**
- Check browser console (F12) for errors
- Verify keys start with `pk_test_` and `sk_test_`
- Contact Paystack support if keys don't work

---

## 📊 Your Status:

✅ Supabase: Already connected
⏳ Paystack: Add keys above
🚀 Deploy: Redeploy after adding keys

**Total Time: 2 minutes** ⚡

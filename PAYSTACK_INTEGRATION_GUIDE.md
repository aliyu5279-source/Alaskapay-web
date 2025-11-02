# 💳 Paystack Integration Guide for AlaskaPay

**Purpose:** Payment processing for Nigerian users  
**Cost:** FREE to setup, 1.5% + ₦100 per transaction  
**Email:** pescotservices@gmail.com

---

## ⚡ Quick Setup (10 Minutes)

### Step 1: Create Paystack Account
1. Go to: https://paystack.com
2. Click: **Create a free account**
3. Enter:
   - Email: pescotservices@gmail.com
   - Password: (create strong password)
   - Business Name: AlaskaPay or Pescot Services
4. Click: **Get Started**
5. Verify email (check pescotservices@gmail.com inbox)

### Step 2: Complete Business Profile
1. Login to: https://dashboard.paystack.com
2. Complete: Business Information
   - Business Type: Fintech/Payment Platform
   - Country: Nigeria
   - Business Address: Your address
   - Phone: Your phone number
3. Add: Bank Account for settlements
4. Upload: Business documents (if required)

### Step 3: Get API Keys
1. Dashboard → Settings → **API Keys & Webhooks**
2. You'll see:
   - **Test Public Key:** pk_test_xxxxx (use this first)
   - **Test Secret Key:** sk_test_xxxxx (keep secret!)
   - **Live Public Key:** pk_live_xxxxx (after verification)
   - **Live Secret Key:** sk_live_xxxxx (keep secret!)

---

## 🔧 Step 4: Add to Vercel

1. Go to: https://vercel.com/dashboard
2. Select: **alaskapay-web** project
3. Settings → Environment Variables
4. Add:

```
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_test_key_here
```

5. Check: Production, Preview, Development
6. Click: **Save**
7. Redeploy

---

## 🔗 Step 5: Setup Webhooks

Webhooks notify your app when payments succeed/fail.

### In Paystack Dashboard:
1. Settings → **API Keys & Webhooks**
2. Scroll to: **Webhook URL**
3. Add: `https://alaskapay-web.vercel.app/api/paystack-webhook`
4. Click: **Save Changes**

### In Supabase (for Edge Functions):
1. Your project already has webhook handlers
2. Edge function: `supabase/functions/paystack-webhook/index.ts`
3. Deploy edge functions:
```bash
supabase functions deploy paystack-webhook
```

---

## ✅ Step 6: Test Payment Flow

### On Live Site:
1. Open: https://alaskapay-web.vercel.app
2. Login/Signup
3. Go to: Wallet → **Fund Wallet**
4. Enter: ₦1,000 (test amount)
5. Click: **Pay with Paystack**

### Test Cards (Paystack Provides):
```
Success Card:
Card: 4084 0840 8408 4081
CVV: 408
Expiry: 12/25
PIN: 0000

Insufficient Funds:
Card: 5060 6666 6666 6666
CVV: 123
Expiry: 12/25
PIN: 1234
```

---

## 🔐 Security Best Practices

### Never Expose Secret Keys:
- ❌ Don't use `sk_test_` or `sk_live_` in frontend
- ✅ Only use `pk_test_` or `pk_live_` in VITE_ variables
- ✅ Keep secret keys in Supabase Edge Functions only

### Verify Webhooks:
- Always verify webhook signatures
- Already implemented in: `supabase/functions/paystack-webhook/`

---

## 🚀 Going Live (After Testing)

### Step 1: Business Verification
1. Paystack will review your business
2. Submit required documents:
   - Business registration (CAC for Nigeria)
   - Valid ID
   - Bank account verification
3. Wait: 1-3 business days

### Step 2: Switch to Live Keys
1. Get Live API keys from dashboard
2. Update Vercel environment variable:
```
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_live_key
```
3. Redeploy

### Step 3: Update Webhook URL
1. Change webhook to production URL
2. Test with small real transaction

---

## 💰 Paystack Features in AlaskaPay

✅ **Card Payments:** Visa, Mastercard, Verve  
✅ **Bank Transfer:** Direct bank account funding  
✅ **USSD:** *737# payments  
✅ **Mobile Money:** MTN, Airtel, etc.  
✅ **QR Codes:** Scan to pay  
✅ **Recurring Payments:** Subscriptions  
✅ **Payouts:** Send money to bank accounts  

---

## 📊 Transaction Fees

### Paystack Charges:
- **Local Cards:** 1.5% + ₦100 cap at ₦2,000
- **International Cards:** 3.9% + ₦100
- **Bank Transfer:** ₦50 flat fee
- **USSD:** 1.5% + ₦100

### Your Pricing:
- You can add your own fees on top
- Configure in: `src/config/commissionConfig.ts`

---

## 🚨 Common Issues

### "Invalid public key"
- Check key starts with `pk_test_` or `pk_live_`
- Ensure no spaces or quotes
- Redeploy after adding

### "Webhook not receiving events"
- Verify webhook URL is correct
- Check Supabase edge function is deployed
- Test webhook in Paystack dashboard

### "Payment successful but wallet not credited"
- Check webhook handler logs
- Verify database permissions
- Check Supabase edge function logs

---

## 🧪 Testing Checklist

- [ ] Paystack account created ✅
- [ ] Business profile completed ✅
- [ ] Test API keys obtained ✅
- [ ] Keys added to Vercel ✅
- [ ] App redeployed ✅
- [ ] Test card payment works ✅
- [ ] Wallet credited after payment ✅
- [ ] Webhook receiving events ✅

---

## 🎯 Next Steps

1. **Test thoroughly** with test cards
2. **Submit for verification** when ready
3. **Switch to live keys** after approval
4. **Monitor transactions** in dashboard

**Support:** support@paystack.com or hi@paystack.com

# ⚡ Quick Vercel Environment Setup (Mobile)

## 🎯 5-Minute Setup

### Step 1: Get Your API Keys

**Supabase** (2 keys needed):
1. Go to: https://app.supabase.com → Your Project
2. Settings → API
3. Copy: **Project URL** and **anon public key**

**Paystack** (1 key needed):
1. Go to: https://dashboard.paystack.com
2. Settings → API Keys
3. Copy: **Public Key** (pk_test_...)

---

### Step 2: Add to Vercel

1. Go to: https://vercel.com/dashboard
2. Click your **alaska-pay** project
3. Click **Settings** → **Environment Variables**
4. Add these 3 variables:

```
Name: VITE_SUPABASE_URL
Value: https://xxxxx.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development

Name: VITE_SUPABASE_ANON_KEY  
Value: eyJhbGci... (your long key)
Environments: ✓ Production ✓ Preview ✓ Development

Name: VITE_PAYSTACK_PUBLIC_KEY
Value: pk_test_xxxxx
Environments: ✓ Production ✓ Preview ✓ Development
```

---

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes

---

### Step 4: Test

Open your site and try to:
- ✅ Sign up / Login
- ✅ Access dashboard

**Working?** 🎉 You're done!

**Not working?** Check the full guide: `VERCEL_ENV_SETUP_GUIDE.md`

---

## 🔗 Quick Links

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- Paystack Dashboard: https://dashboard.paystack.com

---

## 💡 Pro Tips

1. **Copy carefully** - API keys are long and case-sensitive
2. **Select all environments** - Production, Preview, Development
3. **Always redeploy** after adding variables
4. **Test immediately** to catch issues early

---

## ⚠️ Common Mistakes

❌ Forgetting to redeploy after adding variables
❌ Typos in variable names (must be exact)
❌ Not selecting all environments
❌ Using wrong Supabase key (use anon, not service_role)

---

**Need detailed help?** See `VERCEL_ENV_SETUP_GUIDE.md`

# ✅ AlaskaPay Vercel Environment Setup

**Your App:** https://alaskapay-web.vercel.app/  
**Status:** Deployed but needs environment variables

---

## 🔧 Step 1: Add Environment Variables to Vercel

### Go to Vercel Dashboard:
1. Open: https://vercel.com/dashboard
2. Click on **alaskapay-web** project
3. Click **Settings** tab
4. Click **Environment Variables** (left sidebar)

---

## 📝 Step 2: Add These Variables

Copy and paste each variable below:

### **Required Variables:**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_key
VITE_APP_URL=https://alaskapay-web.vercel.app
```

### **How to Get These Keys:**

#### **1. Supabase Keys:**
- Go to: https://supabase.com/dashboard
- Select your AlaskaPay project
- Click **Settings** → **API**
- Copy:
  - **Project URL** → Use as `VITE_SUPABASE_URL`
  - **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY`

#### **2. Paystack Keys:**
- Go to: https://dashboard.paystack.com
- Login with pescotservices@gmail.com
- Click **Settings** → **API Keys & Webhooks**
- Copy **Test Public Key** → Use as `VITE_PAYSTACK_PUBLIC_KEY`

---

## ⚡ Step 3: Redeploy After Adding Variables

After adding all variables:

1. Go to **Deployments** tab
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait 30-60 seconds

✅ Your app will now work with backend!

---

## 🧪 Step 4: Test Your Live App

Open: https://alaskapay-web.vercel.app/

**Test These Features:**
- ✅ Sign up / Login
- ✅ Wallet dashboard
- ✅ Send money
- ✅ Payment processing
- ✅ Transaction history

---

## 🚨 If You Don't Have Supabase/Paystack Yet:

### Create Supabase Project (FREE):
1. Go to: https://supabase.com
2. Sign in with GitHub
3. Click **New Project**
4. Name: **AlaskaPay**
5. Database Password: (save this!)
6. Region: **West Africa (Lagos)** or closest
7. Wait 2 minutes for setup
8. Get your keys from Settings → API

### Create Paystack Account (FREE):
1. Go to: https://paystack.com
2. Sign up with pescotservices@gmail.com
3. Verify email
4. Complete business profile
5. Get Test API keys from Settings

---

## 📱 Quick Access Commands:

```bash
# View your live site
open https://alaskapay-web.vercel.app

# Check deployment logs
vercel logs alaskapay-web

# Redeploy from terminal
vercel --prod
```

---

## ✅ Checklist:

- [ ] Add VITE_SUPABASE_URL to Vercel
- [ ] Add VITE_SUPABASE_ANON_KEY to Vercel
- [ ] Add VITE_PAYSTACK_PUBLIC_KEY to Vercel
- [ ] Add VITE_APP_URL to Vercel
- [ ] Redeploy on Vercel
- [ ] Test signup/login
- [ ] Test wallet features
- [ ] Share URL with team

---

## 🎯 Next Steps After Setup:

1. **Test all features** on live site
2. **Create Play Store account** ($25 fee)
3. **Create App Store Connect account** ($99/year)
4. **Deploy mobile apps** when stores are ready

---

**Need Help?** Reply with:
- "Show me Supabase setup"
- "Show me Paystack setup"
- "Environment variables not working"

# ⚡ Quick Vercel Environment Setup (5 Minutes)

**Your Live App:** https://alaskapay-web.vercel.app/

---

## 🎯 What You Need to Do NOW:

Your app is live but **missing backend connection**. Add these 4 variables:

---

## 📋 Copy-Paste These Steps:

### **Step 1:** Open Vercel Settings
```
1. Go to: https://vercel.com/dashboard
2. Click: alaskapay-web project
3. Click: Settings tab
4. Click: Environment Variables
```

### **Step 2:** Add Each Variable

Click **Add New** for each:

#### Variable 1:
```
Name: VITE_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production, Preview, Development (check all 3)
```

#### Variable 2:
```
Name: VITE_SUPABASE_ANON_KEY
Value: your-supabase-anon-key-here
Environment: Production, Preview, Development (check all 3)
```

#### Variable 3:
```
Name: VITE_PAYSTACK_PUBLIC_KEY
Value: pk_test_your_paystack_public_key
Environment: Production, Preview, Development (check all 3)
```

#### Variable 4:
```
Name: VITE_APP_URL
Value: https://alaskapay-web.vercel.app
Environment: Production, Preview, Development (check all 3)
```

### **Step 3:** Redeploy
```
1. Go to: Deployments tab
2. Click: ... (three dots) on latest deployment
3. Click: Redeploy
4. Wait: 30-60 seconds
```

---

## 🔑 Where to Get API Keys:

### **Supabase Keys** (if you have account):
- Dashboard: https://supabase.com/dashboard
- Your Project → Settings → API
- Copy: Project URL + anon public key

### **Paystack Keys** (if you have account):
- Dashboard: https://dashboard.paystack.com
- Settings → API Keys & Webhooks
- Copy: Test Public Key

---

## 🚨 Don't Have Accounts Yet?

### Option 1: Create Supabase (2 minutes)
```
1. Go to: https://supabase.com
2. Sign in with GitHub
3. New Project → Name: AlaskaPay
4. Wait 2 minutes → Get keys
```

### Option 2: Create Paystack (5 minutes)
```
1. Go to: https://paystack.com
2. Sign up: pescotservices@gmail.com
3. Verify email
4. Settings → Get Test API Key
```

---

## ✅ After Setup - Test These:

Open: https://alaskapay-web.vercel.app/

- [ ] Homepage loads ✅
- [ ] Click "Sign Up" works
- [ ] Login form appears
- [ ] Dashboard loads (after login)
- [ ] No console errors

---

## 🎯 Quick Commands:

```bash
# Open your live site
open https://alaskapay-web.vercel.app

# Check if variables are set
vercel env ls

# Force redeploy
vercel --prod
```

---

**Status:** App is LIVE but needs environment variables to function fully!

**Next:** Add the 4 variables above → Redeploy → Test! 🚀

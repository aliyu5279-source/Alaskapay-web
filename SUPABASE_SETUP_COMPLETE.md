# 🗄️ Supabase Setup for AlaskaPay (Complete Guide)

**Purpose:** Backend database + authentication for AlaskaPay  
**Cost:** FREE (500MB database, 50,000 monthly active users)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Create Supabase Account
1. Go to: https://supabase.com
2. Click: **Start your project**
3. Sign in with: **GitHub** (recommended) or Email
4. Authorize Supabase to access GitHub

### Step 2: Create New Project
1. Click: **New Project**
2. Fill in:
   - **Name:** AlaskaPay
   - **Database Password:** (create strong password - SAVE THIS!)
   - **Region:** West Africa (Lagos) or closest to Nigeria
   - **Pricing Plan:** Free
3. Click: **Create new project**
4. Wait: 2-3 minutes for project setup

### Step 3: Get API Keys
1. Project is ready when you see dashboard
2. Click: **Settings** (gear icon, bottom left)
3. Click: **API** section
4. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGc...long-key-here
service_role key: eyJhbGc...another-long-key (keep secret!)
```

---

## 🔧 Step 4: Run Database Migrations

### Option A: Using Supabase Dashboard (Easiest)
1. In Supabase Dashboard → Click **SQL Editor**
2. Click **New Query**
3. Copy contents from: `supabase/migrations/20250201_complete_profiles_setup.sql`
4. Paste into editor
5. Click **Run**
6. Repeat for other migration files in order:
   - `20250102_fix_transactions_and_tables.sql`
   - `20250103_wallet_transfer_withdrawal.sql`

### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## 📝 Step 5: Add to Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select: **alaskapay-web** project
3. Settings → Environment Variables
4. Add:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

5. Check: Production, Preview, Development
6. Click: **Save**
7. Redeploy your app

---

## ✅ Step 6: Verify Setup

### Test in Supabase Dashboard:
1. Click **Table Editor**
2. You should see tables:
   - profiles
   - wallets
   - transactions
   - payment_methods
   - notifications

### Test on Live Site:
1. Open: https://alaskapay-web.vercel.app
2. Click: **Sign Up**
3. Create account
4. Check Supabase → Authentication → Users
5. Should see new user ✅

---

## 🔐 Security Settings (Important!)

### Enable RLS (Row Level Security):
1. Supabase Dashboard → Authentication → Policies
2. Ensure RLS is enabled on all tables
3. Policies should already be set from migrations

### Email Settings:
1. Settings → Authentication → Email
2. Enable: Email confirmations (optional for testing)
3. Add: Custom SMTP (optional, use SendGrid later)

---

## 📊 What Supabase Provides:

✅ **Database:** PostgreSQL with real-time subscriptions  
✅ **Authentication:** Email/password, social logins  
✅ **Storage:** File uploads (profile pictures, documents)  
✅ **Edge Functions:** Serverless functions (already in project)  
✅ **Realtime:** Live updates for transactions  

---

## 🚨 Common Issues:

### "Project not found"
- Check Project URL is correct
- Ensure no trailing slash

### "Invalid API key"
- Use **anon/public** key (not service_role)
- Copy entire key including eyJhbGc...

### "Table does not exist"
- Run database migrations first
- Check SQL Editor for errors

### "Authentication failed"
- Verify VITE_SUPABASE_ANON_KEY is set
- Redeploy after adding variables

---

## 🎯 Next Steps:

- [ ] Supabase project created ✅
- [ ] API keys copied ✅
- [ ] Database migrations run ✅
- [ ] Environment variables added to Vercel ✅
- [ ] App redeployed ✅
- [ ] Test signup/login ✅

**After this:** Set up Paystack for payments!

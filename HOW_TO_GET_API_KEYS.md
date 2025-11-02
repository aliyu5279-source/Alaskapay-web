# How to Get API Keys - Complete Guide

## 🚀 Quick Start

Run the environment setup script first:
```bash
bash scripts/setup-environment.sh
```

This creates your `.env` file. Now let's fill in the API keys!

---

## 📋 Required API Keys

### 1. Supabase Configuration (REQUIRED)

**Step 1: Create Supabase Project**
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with GitHub (recommended) or email
4. Click "New Project"
5. Fill in:
   - **Name**: `alaskapay` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
6. Click "Create new project" (takes ~2 minutes)

**Step 2: Get Your API Keys**
1. Once project is ready, go to **Settings** (gear icon) → **API**
2. Copy these values to your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Step 3: Run Database Migrations**
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Seed initial data
node scripts/seed-database.js
```

---

### 2. Paystack Configuration (REQUIRED for Payments)

**Step 1: Create Paystack Account**
1. Go to [https://paystack.com](https://paystack.com)
2. Click "Get Started" or "Sign Up"
3. Fill in your business details
4. Verify your email address
5. Complete KYC verification (required for live mode)

**Step 2: Get Test Keys (for development)**
1. Login to Paystack Dashboard
2. Go to **Settings** → **API Keys & Webhooks**
3. Copy your **Test Keys**:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

**Step 3: Get Live Keys (for production)**
1. Complete business verification
2. Go to **Settings** → **API Keys & Webhooks**
3. Toggle to "Live" mode
4. Copy your **Live Keys**:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
```

**Step 4: Setup Webhook**
1. In Paystack Dashboard → **Settings** → **API Keys & Webhooks**
2. Scroll to "Webhook URL"
3. Enter: `https://your-domain.com/api/paystack-webhook`
4. Click "Save"
5. Copy the webhook secret and add to `.env`:

```env
PAYSTACK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

---

## 🔧 Optional Services

### 3. Termii SMS (for OTP/Notifications)

1. Go to [https://termii.com](https://termii.com)
2. Sign up for an account
3. Verify your email
4. Go to **Dashboard** → **API Settings**
5. Copy your API Key:

```env
TERMII_API_KEY=TLxxxxxxxxxxxxx
TERMII_SENDER_ID=AlaskaPay
```

---

### 4. SendGrid Email (for Email Notifications)

1. Go to [https://sendgrid.com](https://sendgrid.com)
2. Sign up (free tier: 100 emails/day)
3. Verify your email
4. Go to **Settings** → **API Keys**
5. Click "Create API Key"
6. Name: `AlaskaPay Production`
7. Select "Full Access"
8. Copy the key (shown only once!):

```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=AlaskaPay
```

**Setup Domain Authentication:**
1. Go to **Settings** → **Sender Authentication**
2. Click "Authenticate Your Domain"
3. Follow DNS setup instructions
4. Verify domain

---

### 5. Google Maps (for Location Features)

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Maps JavaScript API** and **Places API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Restrict the key:
   - **Application restrictions**: HTTP referrers
   - **API restrictions**: Maps JavaScript API, Places API
6. Copy the key:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxx
```

---

## ✅ Verify Your Setup

After adding all keys, verify your `.env` file:

```bash
# Check if all required keys are present
cat .env | grep -E "VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY|VITE_PAYSTACK_PUBLIC_KEY"
```

Test the connection:
```bash
npm run dev
```

Visit `http://localhost:5173` and check:
- [ ] App loads without errors
- [ ] Can sign up/login (tests Supabase)
- [ ] Can view wallet (tests database)

---

## 🔒 Security Checklist

- [ ] Never commit `.env` file to Git
- [ ] Use test keys in development
- [ ] Use live keys only in production
- [ ] Restrict API keys by domain/IP
- [ ] Rotate keys regularly
- [ ] Store production keys in secure vault

---

## 🆘 Troubleshooting

**"Invalid API Key" Error:**
- Check for extra spaces in `.env` file
- Ensure no quotes around values
- Verify you're using correct environment (test vs live)

**"CORS Error" with Supabase:**
- Check your Supabase URL is correct
- Verify project is not paused
- Check RLS policies are set up

**Paystack Webhook Not Working:**
- Ensure webhook URL is publicly accessible
- Check webhook secret matches
- Verify SSL certificate is valid

---

## 📞 Support

- **Supabase**: [https://supabase.com/docs](https://supabase.com/docs)
- **Paystack**: [https://paystack.com/docs](https://paystack.com/docs)
- **Termii**: [https://developers.termii.com](https://developers.termii.com)
- **SendGrid**: [https://docs.sendgrid.com](https://docs.sendgrid.com)

---

## 🎯 Next Steps

Once your environment is set up:

1. **Run Database Setup:**
   ```bash
   bash scripts/setup-database.sh
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Create Admin Account:**
   - Sign up through the UI
   - Manually update `is_admin` in Supabase dashboard

4. **Test Payment Flow:**
   - Use Paystack test cards
   - Verify webhook events

5. **Deploy to Production:**
   - See `DEPLOYMENT_GUIDE.md`

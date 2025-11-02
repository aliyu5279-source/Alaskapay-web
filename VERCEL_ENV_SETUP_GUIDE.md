# Vercel Environment Variables Setup

## Quick Setup (Web Interface)

### 1. Access Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on: `secure-payments-wallet-1`

### 3. Go to Settings
Click: **Settings** → **Environment Variables**

### 4. Add These Variables

Click **Add New** for each:

**Variable 1:**
- Key: `VITE_SUPABASE_URL`
- Value: `https://psafbcbhbidnbzfsccsu.supabase.co`
- Environment: Production, Preview, Development

**Variable 2:**
- Key: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYWZiY2JoYmlkbmJ6ZnNjY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTA1MTIsImV4cCI6MjA3NTE2NjUxMn0.RrZpBW6JujulVZ8H74k1EizS7dz3qHIwhyNJmoxwvKI`
- Environment: Production, Preview, Development

**Variable 3:**
- Key: `VITE_PAYSTACK_PUBLIC_KEY`
- Value: `pk_test_YOUR_ACTUAL_KEY` (get from Paystack)
- Environment: Production, Preview, Development

**Variable 4:**
- Key: `VITE_APP_NAME`
- Value: `Alaska Pay`
- Environment: Production, Preview, Development

### 5. Redeploy
Click **Deployments** → Latest deployment → **Redeploy**

## Automated Setup (CLI)

```bash
# Run the setup script
chmod +x scripts/setup-vercel-env.sh
./scripts/setup-vercel-env.sh
```

## Verify Setup

Visit: https://secure-payments-wallet-1-4c5mv7347-aliyu-ibrahims-projects.vercel.app

You should now see:
- Login/Signup working
- No "Supabase not configured" errors
- Services page loads properly

## Get Paystack Keys

1. Go to: https://dashboard.paystack.com
2. Login to your account
3. Navigate to: Settings → API Keys & Webhooks
4. Copy **Public Key** (starts with pk_test_ or pk_live_)
5. Add to Vercel as VITE_PAYSTACK_PUBLIC_KEY

## Troubleshooting

**Issue: Changes not reflecting**
- Solution: Force redeploy from Vercel dashboard

**Issue: Still seeing errors**
- Solution: Check browser console, clear cache

**Issue: Can't find project**
- Solution: Ensure you're logged into correct Vercel account

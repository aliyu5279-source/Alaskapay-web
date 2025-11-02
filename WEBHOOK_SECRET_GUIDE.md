# How to Get Your Stripe Webhook Secret - DETAILED GUIDE

## 🚀 EASIEST METHOD: Use Stripe CLI (Recommended for Development)

### Step 1: Install Stripe CLI
**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows:**
Download from: https://github.com/stripe/stripe-cli/releases/latest

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

### Step 2: Login to Stripe
```bash
stripe login
```
This opens your browser - click "Allow access"

### Step 3: Get Webhook Secret
```bash
stripe listen --print-secret
```

**Copy the secret that appears** (starts with `whsec_`) and add it to Supabase!

---

## 📋 METHOD 2: Stripe Dashboard (Step-by-Step with Exact Clicks)

### Part A: Create Webhook Endpoint First

1. **Open Browser** → Go to https://dashboard.stripe.com
2. **Login** to your Stripe account
3. **Top Right Corner** → Click "Developers"
4. **Left Sidebar** → Click "Webhooks"
5. **Blue Button** → Click "Add endpoint" or "+ Add an endpoint"

### Part B: Configure Endpoint

6. **Endpoint URL** → Enter: `https://YOUR-PROJECT.supabase.co/functions/v1/stripe-webhook`
   - Replace YOUR-PROJECT with your actual Supabase project ID
7. **Description** (optional) → Enter: "Payment webhook handler"
8. **Events to send** → Click "Select events"
9. **Search and Select These Events:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
10. **Bottom Right** → Click "Add endpoint"

### Part C: Get the Secret

11. **You'll see your new endpoint** in the list
12. **Click on the endpoint** you just created
13. **Look at the top section** - you'll see "Signing secret"
14. **Click "Reveal"** or "Click to reveal" button
15. **Copy the secret** (starts with `whsec_`)

---

## 🔧 METHOD 3: I Can't Find "Reveal" Button?

If you don't see a reveal button:

1. **Delete the old endpoint** (if any exist)
2. **Create a NEW endpoint** following Part A & B above
3. **Immediately after creation**, the secret will be shown
4. **Copy it right away** before closing the page

---

## ⚙️ Add Secret to Supabase

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Project Settings** (gear icon, bottom left)
4. Click **Edge Functions** in left menu
5. Scroll to **Secrets** section
6. Click **Add new secret**
7. Name: `STRIPE_WEBHOOK_SECRET`
8. Value: Paste your `whsec_...` secret
9. Click **Save**

---

## 🧪 For Development: Temporary Workaround

If you still can't get the secret, I can create a webhook handler that works WITHOUT signature verification for development (NOT for production).

**Would you like me to create this temporary development webhook?**

---

## ❓ Still Having Issues?

Tell me:
1. Which method are you trying?
2. What exact step are you stuck on?
3. What do you see on your screen?

I'll help you through it!

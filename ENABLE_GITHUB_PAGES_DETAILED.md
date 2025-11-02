# 🚀 DETAILED GUIDE: Enable GitHub Pages for AlaskaPay

## ⚠️ BEFORE YOU START - CHECK ACCESS
**You MUST be the repository owner or have admin access!**

To check: Go to your repository → Look for "Settings" tab at the top
- ✅ **Can see it?** → You have access, continue below
- ❌ **Can't see it?** → You don't have admin rights. Contact the repo owner.

---

## 📍 STEP 1: NAVIGATE TO YOUR REPOSITORY

1. Open your web browser
2. Go to: `https://github.com/[YOUR-USERNAME]/[YOUR-REPO-NAME]`
   - Replace `[YOUR-USERNAME]` with your GitHub username
   - Replace `[YOUR-REPO-NAME]` with your repository name (probably "alaskapay" or similar)

3. You should see tabs at the top:
   ```
   < > Code    Issues    Pull requests    Actions    Projects    Wiki    Security    Insights    Settings
   ```

---

## 📍 STEP 2: OPEN SETTINGS

1. Click the **"Settings"** tab (far right in the top navigation)
   - If you DON'T see "Settings", you don't have admin access
   - Ask the repository owner to give you admin rights OR do these steps

2. You'll see a LEFT SIDEBAR with many options

---

## 📍 STEP 3: ENABLE GITHUB PAGES

### Find Pages Section:
1. Look at the **LEFT SIDEBAR**
2. Scroll down until you see **"Pages"** (it's under "Code and automation" section)
3. Click **"Pages"**

### Configure Pages:
1. You'll see **"Build and deployment"** section
2. Under **"Source"**, you'll see a dropdown (probably says "Deploy from a branch")
3. Click the dropdown and select: **"GitHub Actions"**
4. The page will auto-save (you might see a green checkmark)

✅ **GitHub Pages is now enabled!**

---

## 📍 STEP 4: ADD ENVIRONMENT SECRETS

### Navigate to Secrets:
1. Still in **Settings** (left sidebar)
2. Look for **"Secrets and variables"** (under "Security" section)
3. Click **"Secrets and variables"** → It will expand
4. Click **"Actions"**

### Add Each Secret:
You'll see a green button: **"New repository secret"**

#### Add Secret #1 - Supabase URL:
1. Click **"New repository secret"**
2. In **"Name"** field, type: `VITE_SUPABASE_URL`
3. In **"Secret"** field, paste your Supabase project URL
   - Get it from: https://supabase.com/dashboard → Your Project → Settings → API
   - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
4. Click **"Add secret"**

#### Add Secret #2 - Supabase Key:
1. Click **"New repository secret"** again
2. Name: `VITE_SUPABASE_ANON_KEY`
3. Secret: Your Supabase anon/public key (from same place as URL)
4. Click **"Add secret"**

#### Add Secret #3 - Stripe Key:
1. Click **"New repository secret"**
2. Name: `VITE_STRIPE_PUBLISHABLE_KEY`
3. Secret: Your Stripe publishable key
   - Get it from: https://dashboard.stripe.com/apikeys
4. Click **"Add secret"**

#### Add Secret #4 - Paystack Key:
1. Click **"New repository secret"**
2. Name: `VITE_PAYSTACK_PUBLIC_KEY`
3. Secret: Your Paystack public key
   - Get it from: https://dashboard.paystack.com/#/settings/developers
4. Click **"Add secret"**

✅ **All secrets added!**

---

## 📍 STEP 5: TRIGGER DEPLOYMENT

### Option A - Push Code:
```bash
git add .
git commit -m "Enable GitHub Pages"
git push origin main
```

### Option B - Manual Trigger:
1. Go to **"Actions"** tab (top navigation)
2. Click **"Deploy to GitHub Pages"** workflow (left sidebar)
3. Click **"Run workflow"** button (right side)
4. Click green **"Run workflow"** button in dropdown
5. Wait 2-3 minutes

---

## 📍 STEP 6: VIEW YOUR LIVE SITE

1. Go back to **Settings** → **Pages**
2. At the top, you'll see: **"Your site is live at https://[username].github.io/[repo]"**
3. Click the link to view your live AlaskaPay site! 🎉

---

## ❌ TROUBLESHOOTING

### "I don't see Settings tab"
- You don't have admin access
- Solution: Ask repo owner to add you as admin or do setup themselves

### "I don't see Pages in sidebar"
- Scroll down more in the left sidebar
- Or search for "pages" in the settings search bar

### "Deployment failed"
- Go to **Actions** tab → Click the failed workflow → Check error logs
- Common issue: Missing secrets → Re-add them

### "Site shows 404"
- Check if base path is correct in `vite.config.pages.ts`
- Should be: `base: '/[your-repo-name]/'`

### "Need help finding API keys"
- **Supabase**: https://supabase.com/dashboard → Project → Settings → API
- **Stripe**: https://dashboard.stripe.com/apikeys
- **Paystack**: https://dashboard.paystack.com/#/settings/developers

---

## 📞 STILL STUCK?

Share a screenshot of what you see when you:
1. Go to your repository
2. Look at the top navigation tabs

This will help identify the issue!

# 🎯 VISUAL GUIDE: 3-Minute Setup

## 🔍 WHERE TO CLICK - VISUAL MAP

```
GitHub Repository Page Layout:
┌─────────────────────────────────────────────────────────────┐
│  [YOUR-REPO-NAME]                                           │
├─────────────────────────────────────────────────────────────┤
│  < > Code   Issues   Pull requests   Actions   [Settings] ← CLICK HERE FIRST
└─────────────────────────────────────────────────────────────┘

After clicking Settings, LEFT SIDEBAR appears:
┌──────────────────────┐
│ General              │
│ Access               │
│ Code and automation  │
│   ├─ Pages          │ ← CLICK HERE SECOND
│   ├─ Actions        │
│ Security             │
│   ├─ Secrets and... │ ← CLICK HERE THIRD
└──────────────────────┘
```

---

## ✅ CHECKLIST - Follow in Order

### □ TASK 1: Enable Pages (2 clicks)
1. Click **Settings** tab (top right)
2. Click **Pages** (left sidebar)
3. Change "Source" dropdown to **"GitHub Actions"**
4. ✅ Done! (auto-saves)

### □ TASK 2: Add Secrets (4 secrets)
1. Click **Secrets and variables** (left sidebar)
2. Click **Actions**
3. Click **"New repository secret"** (green button)
4. Add these 4 secrets (one at a time):

```
Secret 1:
Name: VITE_SUPABASE_URL
Value: [Your Supabase URL]

Secret 2:
Name: VITE_SUPABASE_ANON_KEY
Value: [Your Supabase Key]

Secret 3:
Name: VITE_STRIPE_PUBLISHABLE_KEY
Value: [Your Stripe Key]

Secret 4:
Name: VITE_PAYSTACK_PUBLIC_KEY
Value: [Your Paystack Key]
```

### □ TASK 3: Deploy (1 command)
```bash
git push origin main
```

### □ TASK 4: Check Live Site
- Go to: Settings → Pages
- Click the URL shown at top
- Your site is LIVE! 🎉

---

## 🆘 CAN'T FIND SOMETHING?

### "Where is Settings tab?"
Look at the VERY TOP of your repository page, far right:
```
Code  Issues  Pull requests  Actions  Projects  Wiki  Security  Insights  [Settings]
                                                                            ↑ HERE
```

### "Where is Pages in sidebar?"
After clicking Settings, look at LEFT side:
```
Left Sidebar:
- General
- Access  
- Collaborators
- Code and automation
  - Pages ← HERE (click to expand if needed)
  - Actions
```

### "Where do I get API keys?"

**Supabase:**
1. Go to: https://supabase.com/dashboard
2. Click your project
3. Click Settings (left) → API
4. Copy "Project URL" and "anon public" key

**Stripe:**
1. Go to: https://dashboard.stripe.com
2. Click "Developers" → "API keys"
3. Copy "Publishable key" (starts with pk_)

**Paystack:**
1. Go to: https://dashboard.paystack.com
2. Click Settings → API Keys & Webhooks
3. Copy "Public Key"

---

## 📱 MOBILE SETUP?

GitHub Pages setup requires desktop browser. Use:
- Desktop computer
- Laptop
- Or request desktop site on mobile browser

---

## ⏱️ TIMELINE

- Enable Pages: 30 seconds
- Add Secrets: 2 minutes
- Deploy: 2-3 minutes automatic
- **Total: ~5 minutes to live site!**

---

## 🎬 WHAT HAPPENS AFTER SETUP?

1. Every time you push code to `main` branch
2. GitHub automatically builds your site
3. Deploys to: `https://[username].github.io/[repo-name]`
4. Takes 2-3 minutes per deployment
5. You get email if deployment fails

---

## 💡 PRO TIPS

✅ **Bookmark your live site URL** after first deployment
✅ **Check Actions tab** to see deployment progress
✅ **Keep API keys secret** - never commit them to code
✅ **Use test keys** for development, production keys for live site

---

## 🔗 HELPFUL LINKS

- Your Repo: `https://github.com/[username]/[repo-name]`
- Your Live Site: `https://[username].github.io/[repo-name]`
- Deployment Status: `https://github.com/[username]/[repo-name]/actions`

Replace `[username]` and `[repo-name]` with your actual values!

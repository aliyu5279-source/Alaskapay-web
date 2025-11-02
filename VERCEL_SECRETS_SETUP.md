# 🔐 Vercel Secrets & GitHub Setup

## Complete Guide to Configure Auto-Deploy

---

## 📋 Required Secrets

You need 6 secrets total:

### Vercel Secrets (3):
1. `VERCEL_TOKEN` - Authentication token
2. `VERCEL_ORG_ID` - Your team/org ID
3. `VERCEL_PROJECT_ID` - Your project ID

### App Secrets (3):
4. `VITE_SUPABASE_URL` - Supabase project URL
5. `VITE_SUPABASE_ANON_KEY` - Supabase public key
6. `VITE_PAYSTACK_PUBLIC_KEY` - Paystack key (optional)

---

## 🔑 Step 1: Get Vercel Token

1. **Go to:** https://vercel.com/account/tokens
2. **Click:** "Create Token"
3. **Name:** `GitHub Actions Deploy`
4. **Scope:** Full Account
5. **Expiration:** No Expiration (or 1 year)
6. **Click:** "Create"
7. **Copy the token** (shown once!)

**Save this as:** `VERCEL_TOKEN`

---

## 🆔 Step 2: Get Vercel Org ID

### Method 1: From Dashboard
1. **Go to:** https://vercel.com/account
2. **Settings** → **General**
3. **Copy:** Team ID (or User ID)

### Method 2: From CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project (in your repo directory)
vercel link

# View .vercel/project.json
cat .vercel/project.json
```

**Save as:** `VERCEL_ORG_ID`

---

## 📦 Step 3: Get Vercel Project ID

### After linking project (Step 2):

```bash
# View project.json
cat .vercel/project.json

# You'll see:
{
  "orgId": "team_xxxxx",
  "projectId": "prj_xxxxx"
}
```

**Save as:** `VERCEL_PROJECT_ID`

---

## 🔐 Step 4: Get Supabase Keys

1. **Go to:** https://supabase.com/dashboard
2. **Select your project**
3. **Settings** → **API**
4. **Copy:**
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`

---

## 💳 Step 5: Get Paystack Key (Optional)

1. **Go to:** https://dashboard.paystack.com
2. **Settings** → **API Keys & Webhooks**
3. **Copy:** Public Key
4. **Save as:** `VITE_PAYSTACK_PUBLIC_KEY`

---

## 🔧 Step 6: Add Secrets to GitHub

### Go to GitHub Repository:
```
https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
```

### Add Each Secret:

1. **Click:** "New repository secret"
2. **Name:** `VERCEL_TOKEN`
3. **Value:** Paste your token
4. **Click:** "Add secret"

**Repeat for all 6 secrets:**

```
VERCEL_TOKEN=vercel_xxxxx
VERCEL_ORG_ID=team_xxxxx
VERCEL_PROJECT_ID=prj_xxxxx
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
```

---

## ✅ Step 7: Verify Setup

### Check Secrets Added:
```
GitHub Repo → Settings → Secrets and variables → Actions
```

You should see all 6 secrets listed.

### Test Auto-Deploy:

```bash
# Make a small change
echo "# Test deploy" >> README.md

# Commit and push
git add .
git commit -m "test: verify auto-deploy"
git push origin main

# Watch deployment
# 1. GitHub: Actions tab
# 2. Vercel: Dashboard → Deployments
```

---

## 🎯 Step 8: Add Secrets to Vercel (Optional)

For additional security, also add to Vercel:

1. **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. **Add each variable:**

```
VITE_SUPABASE_URL → Production, Preview, Development
VITE_SUPABASE_ANON_KEY → Production, Preview, Development
VITE_PAYSTACK_PUBLIC_KEY → Production only
```

---

## 🔄 Update Secrets Later

### GitHub:
```
Settings → Secrets → Click secret name → Update
```

### Vercel:
```
Settings → Environment Variables → Edit → Save → Redeploy
```

---

## 🐛 Troubleshooting

### "VERCEL_TOKEN is not set"
- Check secret name is exactly `VERCEL_TOKEN` (case-sensitive)
- Verify token hasn't expired
- Create new token if needed

### "Project not found"
- Verify `VERCEL_PROJECT_ID` is correct
- Run `vercel link` in your repo
- Check `.vercel/project.json`

### "Unauthorized"
- Check `VERCEL_ORG_ID` matches your account
- Verify token has correct permissions
- Try creating new token with full access

### Build fails with "undefined"
- Environment variables not loaded
- Check variable names start with `VITE_`
- Verify added to correct environment

---

## 📊 Verify Everything Works

### ✅ Checklist:

- [ ] All 6 secrets added to GitHub
- [ ] Environment variables added to Vercel
- [ ] Test push triggers deployment
- [ ] GitHub Actions workflow succeeds
- [ ] Vercel deployment completes
- [ ] Site loads correctly
- [ ] No console errors

---

## 🎉 Success!

Your automatic deployment is configured!

**Every push to `main` will:**
1. ✅ Trigger GitHub Actions
2. ✅ Build your app with env vars
3. ✅ Deploy to Vercel automatically
4. ✅ Update your live site

**Preview deployments:**
- Every PR gets a unique URL
- Test before merging to main

---

## 📚 Reference

**Files that use these secrets:**
- `.github/workflows/vercel-auto-deploy.yml`
- `.github/workflows/deploy-vercel-production.yml`
- `vercel.json`

**Documentation:**
- Vercel: https://vercel.com/docs/concepts/projects/environment-variables
- GitHub: https://docs.github.com/en/actions/security-guides/encrypted-secrets

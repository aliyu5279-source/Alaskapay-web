# ⚡ Quick Auto-Deploy Setup (5 Minutes)

## 🎯 Choose Your Platform

### 🟢 Netlify (Recommended - Easier)

**1. Get Credentials (2 min)**
```bash
# Go to: https://app.netlify.com/user/applications
# Create "Personal access token" → Copy it
# Go to your site → Site settings → Copy "Site ID"
```

**2. Add to GitHub (2 min)**
```
GitHub Repo → Settings → Secrets → Actions → New secret

Add these 5 secrets:
- NETLIFY_AUTH_TOKEN
- NETLIFY_SITE_ID
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_PAYSTACK_PUBLIC_KEY
```

**3. Push & Deploy (1 min)**
```bash
git add .
git commit -m "Enable auto-deploy"
git push origin main
```

✅ **DONE!** Check GitHub Actions tab for deployment.

---

### 🔵 Vercel (Alternative)

**1. Get Credentials (3 min)**
```bash
npm i -g vercel
vercel login
vercel link
vercel project ls  # Copy project ID

# Get token: https://vercel.com/account/tokens
```

**2. Add to GitHub (2 min)**
```
Add these 5 secrets:
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_PAYSTACK_PUBLIC_KEY
```

**3. Push**
```bash
git push origin main
```

---

## 🎉 What You Get

✅ Push to main → Auto-deploy  
✅ Create PR → Preview deployment  
✅ Merge PR → Production update  
✅ No manual steps needed  

## 🔍 Check Status

Go to: `https://github.com/YOUR-USERNAME/YOUR-REPO/actions`

See your deployment in real-time!

## ⚠️ Common Issues

**Build fails?**
- Check all 5 secrets are added
- Verify secret values are correct
- Check Actions logs for details

**Site broken after deploy?**
- Wrong API keys (use production keys)
- Check browser console for errors
- Verify Supabase URL is correct

---

## 📞 Quick Help

1. GitHub repo → **Actions** tab
2. Click latest workflow
3. View logs to see what failed
4. Fix the issue and push again

**That's it! Auto-deploy is now active! 🚀**

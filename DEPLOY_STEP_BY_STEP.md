# 🚀 Quick Deploy Guide - Step by Step

## ✅ Prerequisites Check

Before deploying, ensure you have:
- [ ] Node.js installed (v18 or higher)
- [ ] Git installed
- [ ] GitHub account created
- [ ] Project running locally (`npm run dev` works)

---

## 📦 Step 1: Build Your Project

```bash
# Install dependencies (if not already done)
npm install

# Build production version
npm run build
```

**Expected Output**: `dist` folder created with production files

---

## 🔐 Step 2: Push to GitHub (Required First!)

### A. Initialize Git (if not done)
```bash
git init
git add .
git commit -m "Initial commit - Alaska Pay"
```

### B. Create GitHub Repository
1. Go to https://github.com/new
2. Name: `alaskapay` (or your choice)
3. **Don't** initialize with README
4. Click "Create repository"

### C. Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/alaskapay.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Choose Deployment Platform

### **Option A: Netlify** (Easiest - Recommended)

#### Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Login to Netlify
```bash
netlify login
```
*Browser will open - authorize the app*

#### Deploy
```bash
# Deploy to production
netlify deploy --prod --dir=dist
```

**Your site will be live at**: `https://random-name.netlify.app`

#### Custom Domain (Optional)
```bash
netlify domains:add yourdomain.com
```

---

### **Option B: Vercel** (Fast & Easy)

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Login to Vercel
```bash
vercel login
```

#### Deploy
```bash
vercel --prod
```

**Your site will be live at**: `https://alaskapay.vercel.app`

---

### **Option C: GitHub Pages** (Free, GitHub Only)

#### 1. Enable GitHub Pages
1. Go to your repo: `https://github.com/YOUR_USERNAME/alaskapay`
2. Click **Settings** → **Pages**
3. Source: **GitHub Actions**

#### 2. Deploy
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push
```

**Your site will be live at**: `https://YOUR_USERNAME.github.io/alaskapay`

---

## 🔧 Step 4: Configure Environment Variables

### Netlify
```bash
netlify env:set VITE_SUPABASE_URL "your-supabase-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-supabase-key"
```

### Vercel
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

Or add via dashboard:
- Netlify: https://app.netlify.com → Site Settings → Environment Variables
- Vercel: https://vercel.com → Project → Settings → Environment Variables

---

## ✅ Step 5: Verify Deployment

1. **Visit your live URL**
2. **Test key features**:
   - [ ] Homepage loads
   - [ ] Login/Signup works
   - [ ] Dashboard accessible
   - [ ] Transactions display
   - [ ] Wallet functions work

---

## 🔄 Update Your Site (Future Deployments)

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push

# Redeploy
netlify deploy --prod --dir=dist
# OR
vercel --prod
```

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### 404 Errors on Routes
- **Netlify**: Already configured in `netlify.toml`
- **Vercel**: Already configured in `vercel.json`

### Environment Variables Not Working
```bash
# Check variables are set
netlify env:list
# OR
vercel env ls
```

---

## 📊 Recommended: Netlify (Easiest)

```bash
# One-time setup
npm install -g netlify-cli
netlify login

# Every deployment
npm run build
netlify deploy --prod --dir=dist
```

**Done! Your site is live! 🎉**

---

## 🔗 Next Steps

1. **Custom Domain**: Add your own domain (alaskapay.com)
2. **SSL Certificate**: Automatically provided by Netlify/Vercel
3. **CI/CD**: Auto-deploy on every git push (see `CI_CD_PIPELINE.md`)
4. **Monitoring**: Set up analytics and error tracking

---

## 💡 Pro Tips

- Use **Netlify** for simplicity
- Use **Vercel** for Next.js-like features
- Use **GitHub Pages** for free static hosting
- Always test locally before deploying
- Keep environment variables secure
- Enable automatic deployments for convenience

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed documentation.

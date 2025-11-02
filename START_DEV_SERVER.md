# 🚀 Start Development Server

## Quick Start (30 seconds)

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# 3. Start development server
npm run dev
```

Open http://localhost:8080 in your browser.

---

## 📋 First Time Setup

### Prerequisites
- Node.js 20+ installed
- Git installed
- Code editor (VS Code recommended)

### Step-by-Step

**1. Clone Repository (if needed)**
```bash
git clone <your-repo-url>
cd <project-folder>
```

**2. Install Dependencies**
```bash
npm install --legacy-peer-deps
```

**3. Configure Environment**
```bash
cp .env.example .env
```

Edit `.env` and add:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

**4. Start Server**
```bash
npm run dev
```

---

## 🌐 Available Scripts

```bash
# Development server (port 8080)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🔍 Verify Setup

Visit http://localhost:8080 and check:

- ✅ Homepage loads with hero section
- ✅ 12 service cards displayed
- ✅ Navigation menu works
- ✅ "Get Started" button navigates to auth
- ✅ No console errors

---

## 🐛 Troubleshooting

### Port 8080 already in use?
```bash
# Kill process on port 8080
npx kill-port 8080

# Or use different port
npm run dev -- --port 3000
```

### Module not found errors?
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### Vite errors?
```bash
rm -rf node_modules/.vite
npm run dev
```

### Environment variables not loading?
- Restart dev server after editing `.env`
- Check file is named `.env` (not `.env.txt`)
- Ensure variables start with `VITE_`

---

## 📱 Testing Mobile Features

The app includes mobile-specific features:

```bash
# Test in mobile viewport
# Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
```

---

## 🎯 Development Workflow

1. **Start server:** `npm run dev`
2. **Make changes** to files in `src/`
3. **Hot reload** updates automatically
4. **Test features** in browser
5. **Commit changes** when ready

---

## 🚀 Ready to Deploy?

When development is complete:

1. Test production build: `npm run build && npm run preview`
2. Follow `QUICK_DEPLOY_GUIDE.md`
3. Deploy to Netlify/Vercel

---

## 📚 Additional Resources

- **Environment Setup:** `ENVIRONMENT_SETUP.md`
- **Deployment:** `DEPLOYMENT_READY.md`
- **Build Verification:** `BUILD_VERIFICATION.md`
- **Mobile CI/CD:** `CI_CD_MOBILE_SETUP.md`

---

## ✅ You're Ready!

Development server should be running at:
**http://localhost:8080**

Happy coding! 🎉

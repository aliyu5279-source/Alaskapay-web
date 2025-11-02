# 🔍 Build Verification Checklist

## Pre-Deployment Build Test

Run these commands to verify your application builds successfully:

### 1. Clean Install
```bash
rm -rf node_modules dist
npm install --legacy-peer-deps
```

### 2. Build for Production
```bash
npm run build
```

**Expected Output:**
```
✓ built in XXXms
✓ dist/index.html
✓ dist/assets/...
```

### 3. Preview Build Locally
```bash
npm run preview
```

Visit http://localhost:4173 to test the production build.

---

## ✅ Build Success Indicators

- [ ] No TypeScript errors
- [ ] No build warnings (or only minor ones)
- [ ] `dist/` folder created
- [ ] `dist/index.html` exists
- [ ] `dist/assets/` contains JS and CSS files
- [ ] Preview server runs without errors
- [ ] All routes work in preview
- [ ] Images load correctly

---

## 🐛 Common Build Issues & Fixes

### Issue: Module not found
```bash
npm install --legacy-peer-deps
```

### Issue: TypeScript errors
```bash
# Temporarily disable strict checks
# Edit tsconfig.json: "strict": false
```

### Issue: Out of memory
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Issue: Vite build fails
```bash
rm -rf node_modules/.vite
npm run build
```

---

## 📦 Build Output Structure

```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js    # Main JS bundle
│   ├── vendor-[hash].js   # Vendor bundle
│   └── index-[hash].css   # Styles
└── [other static files]
```

---

## 🚀 Ready for Deployment

If all checks pass, you're ready to deploy!

**Next:** Follow `QUICK_DEPLOY_GUIDE.md` or `DEPLOYMENT_READY.md`

# 🚀 NETLIFY DEPLOYMENT FIX - Alaska Pay

## ✅ CORRECT CONFIGURATION

### Base Directory Setting:
**Leave EMPTY** or set to: `.` (dot)

### Build Settings:
- **Base directory:** *(leave empty)* or `.`
- **Build command:** `npm run build`
- **Publish directory:** `dist`

---

## 📋 STEP-BY-STEP FIX

### Option 1: Fix in Netlify Dashboard (RECOMMENDED)

1. **Go to your site:** https://app.netlify.com/sites/a49be8e7-5d3e-442a-962f-42cc53fce437

2. **Navigate to:** Site Settings → Build & Deploy → Build Settings

3. **Set these values:**
   - **Base directory:** *(DELETE any value, leave BLANK)*
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **Add Environment Variables:** Site Settings → Environment Variables
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   ```

5. **Click:** "Save" then go to Deploys → "Trigger deploy" → "Deploy site"

---

### Option 2: Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link --id=a49be8e7-5d3e-442a-962f-42cc53fce437

# Build locally
npm install
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

## 🔍 WHY THE ERROR OCCURRED

The error `ENOENT: no such file or directory, open '/opt/build/repo/package.json'` means:
- Netlify was looking for package.json in the wrong directory
- The base directory was likely set to a subdirectory that doesn't exist
- Solution: Set base directory to EMPTY (root level)

---

## ✨ AFTER SUCCESSFUL DEPLOY

Your site will be live at:
- **Netlify URL:** https://a49be8e7-5d3e-442a-962f-42cc53fce437.netlify.app
- **Custom domain:** (if configured) alaskapay.com

---

## 🆘 STILL HAVING ISSUES?

Check that:
1. ✅ Base directory is EMPTY
2. ✅ All environment variables are set
3. ✅ Build command is `npm run build`
4. ✅ Publish directory is `dist`
5. ✅ Your GitHub repo is connected properly

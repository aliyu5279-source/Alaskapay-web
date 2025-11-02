# 🔧 Netlify Deployment Troubleshooting Guide

## Common Build Errors & Solutions

### ❌ Error: "Build script returned non-zero exit code: 1"

**Cause**: Build failed during compilation

**Solution**:
```bash
# Test build locally
npm install
npm run build

# Check for errors in output
# Fix any TypeScript or build errors
# Then push to GitHub again
```

---

### ❌ Error: "Module not found"

**Cause**: Missing dependency in package.json

**Solution**:
```bash
# Install missing package
npm install package-name --save

# Commit and push
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push origin main
```

---

### ❌ Error: "Command not found: npm"

**Cause**: Node.js version mismatch

**Solution**:
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add environment variable:
   ```
   NODE_VERSION=18
   ```
3. Trigger new deploy

---

### ❌ Error: "Failed to load environment variables"

**Cause**: Environment variables not set

**Solution**:
1. Go to **Site settings** → **Environment variables**
2. Add all required variables:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_PAYSTACK_PUBLIC_KEY
   ```
3. Redeploy site

---

### ❌ Error: "Publish directory not found"

**Cause**: Wrong publish directory configured

**Solution**:
1. Go to **Site settings** → **Build & deploy** → **Build settings**
2. Set **Publish directory** to: `dist`
3. Trigger new deploy

---

## Domain Issues

### ❌ Domain not resolving

**Solution**:
1. Check DNS records at your registrar
2. Use https://dnschecker.org to verify
3. Wait 24-48 hours for propagation
4. Verify records match Netlify's requirements

**Required DNS Records**:
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

---

### ❌ SSL Certificate not provisioning

**Solution**:
1. Ensure DNS is properly configured
2. Wait 24 hours after DNS setup
3. Go to **Domain settings** → **HTTPS**
4. Click **"Verify DNS configuration"**
5. Click **"Provision certificate"**

---

### ❌ "Domain already registered"

**Solution**:
1. Remove domain from old Netlify site
2. Wait 5 minutes
3. Add domain to new site

---

## Performance Issues

### ⚠️ Slow build times

**Solution**:
```bash
# Enable build cache
# In netlify.toml add:
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"
```

---

### ⚠️ Large bundle size

**Solution**:
```bash
# Analyze bundle
npm run build -- --analyze

# Enable compression in netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Encoding = "br"
```

---

## Deployment Issues

### ❌ Deploy not triggering on push

**Solution**:
1. Go to **Site settings** → **Build & deploy**
2. Check **Build hooks** are enabled
3. Verify GitHub connection is active
4. Check branch is set to `main` or `master`

---

### ❌ Old version still showing

**Solution**:
```bash
# Clear cache
1. Go to Site settings → Build & deploy
2. Click "Clear cache and deploy site"

# Or force refresh in browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## Environment Variable Issues

### ❌ Variables not accessible in app

**Cause**: Variables must start with `VITE_`

**Solution**:
```bash
# Correct format
VITE_SUPABASE_URL=https://...
VITE_PAYSTACK_PUBLIC_KEY=pk_...

# Wrong format (won't work)
SUPABASE_URL=https://...
PAYSTACK_KEY=pk_...
```

---

### ❌ Variables work locally but not on Netlify

**Solution**:
1. Check variables are set in Netlify dashboard
2. Ensure no typos in variable names
3. Redeploy after adding variables
4. Don't use `.env` files (use Netlify dashboard)

---

## CLI Issues

### ❌ "netlify: command not found"

**Solution**:
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Verify installation
netlify --version
```

---

### ❌ "Not authorized"

**Solution**:
```bash
# Login to Netlify
netlify login

# This opens browser for authentication
```

---

### ❌ "No site found"

**Solution**:
```bash
# Link to existing site
netlify link

# Or create new site
netlify init
```

---

## Quick Diagnostic Commands

```bash
# Check build locally
npm run build

# Test with Netlify CLI
netlify dev

# Deploy draft (test before production)
netlify deploy

# Deploy to production
netlify deploy --prod

# Check site status
netlify status

# View build logs
netlify watch
```

---

## Get Help

### Check Build Logs
1. Go to **Deploys** tab
2. Click on failed deploy
3. Read full build log
4. Look for specific error messages

### Contact Support
- **Netlify Support**: https://answers.netlify.com
- **Documentation**: https://docs.netlify.com
- **Status Page**: https://www.netlifystatus.com

---

## Prevention Tips

✅ **Always test builds locally first**
```bash
npm install
npm run build
```

✅ **Use environment variables correctly**
- Start with `VITE_` prefix
- Set in Netlify dashboard, not in code

✅ **Keep dependencies updated**
```bash
npm update
npm audit fix
```

✅ **Monitor deployments**
- Enable email notifications
- Check build logs regularly

✅ **Use staging environment**
- Test on branch deploys first
- Then merge to main for production

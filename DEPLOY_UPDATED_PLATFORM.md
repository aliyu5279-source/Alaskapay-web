# 🚀 Deploy Updated Alaska Pay Platform

## Quick Deploy Options

### Option 1: Automatic GitHub Actions Deploy (Recommended)
```bash
# Commit and push your changes
git add .
git commit -m "Deploy Alaska Pay with Backup & Recovery System"
git push origin main
```

GitHub Actions will automatically:
- ✅ Install dependencies
- ✅ Run linting
- ✅ Build the project
- ✅ Deploy to Netlify
- ✅ Run post-deployment checks

**Monitor deployment**: https://github.com/YOUR_USERNAME/alaskamega/actions

---

### Option 2: Quick Deploy Script
```bash
chmod +x scripts/quick-deploy.sh
./scripts/quick-deploy.sh
```

Choose from:
1. Netlify CLI deployment
2. Git push (triggers GitHub Actions)
3. Manual build only

---

### Option 3: Netlify CLI Direct Deploy
```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to production
netlify deploy --prod --dir=dist
```

---

### Option 4: One-Command Deploy
```bash
npm run deploy
```

This runs the complete deployment pipeline.

---

## 🔐 Required Environment Variables

Ensure these are set in:
- `.env` file (local)
- GitHub Secrets (for Actions)
- Netlify Environment Variables (for hosting)

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payment Gateways
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Optional
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Backup system tested
- [ ] Build completes successfully (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Tests passing (`npm test`)

---

## 🗄️ Database Setup for Backup System

Run these migrations in Supabase SQL Editor:

```sql
-- Apply backup system migration
-- File: supabase/migrations/20250101_backup_recovery_system.sql
```

Or use Supabase CLI:
```bash
supabase db push
```

---

## 🎯 Post-Deployment Verification

1. **Check deployment status**:
   - Netlify: https://app.netlify.com/sites/alaskamega/deploys
   - GitHub Actions: https://github.com/YOUR_USERNAME/alaskamega/actions

2. **Verify live site**:
   - Visit: https://alaskapay.netlify.app
   - Test login/signup
   - Check admin dashboard
   - Verify backup system accessible

3. **Test backup system**:
   - Login as admin
   - Navigate to Backup & Recovery
   - Create test backup
   - Verify backup completion

---

## 🔄 Rollback Plan

If deployment fails:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback in Netlify Dashboard
# Go to: Deploys → Previous Deploy → Publish
```

---

## 📊 Monitoring

- **Netlify Dashboard**: https://app.netlify.com/sites/alaskamega
- **GitHub Actions**: Check workflow runs
- **Supabase Dashboard**: Monitor database and functions
- **Application Logs**: Check browser console and network tab

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install --legacy-peer-deps
npm run build
```

### Environment Variables Not Working
- Check Netlify: Site Settings → Environment Variables
- Verify GitHub Secrets: Repository → Settings → Secrets
- Ensure variables start with `VITE_` for client-side access

### Deployment Timeout
- Increase timeout in GitHub Actions (currently 5 min)
- Check Netlify build logs for specific errors

---

## 🎉 Success!

Your Alaska Pay platform with automated backup system is now live!

**Next Steps**:
1. Configure backup schedules in admin panel
2. Set retention policies
3. Test restore operations
4. Monitor backup job execution
5. Review system health dashboard

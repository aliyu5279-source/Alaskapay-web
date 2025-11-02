# ⚡ Quick Deploy - Updated Alaska Pay

## 🚀 Fastest Deploy Method

### Option 1: One-Line Deploy
```bash
chmod +x scripts/deploy-updated-platform.sh && ./scripts/deploy-updated-platform.sh
```

### Option 2: GitHub Actions (Recommended)
1. Go to: https://github.com/YOUR_USERNAME/alaskamega/actions
2. Click "Deploy Updated Alaska Pay Platform"
3. Click "Run workflow"
4. Select environment (production/staging/preview)
5. Click "Run workflow" button

### Option 3: Git Push Auto-Deploy
```bash
git add .
git commit -m "Deploy updated Alaska Pay"
git push origin main
```
Automatically triggers deployment via GitHub Actions.

---

## ✅ Pre-Deploy Checklist (30 seconds)

- [ ] `.env` file exists with Supabase credentials
- [ ] Node.js 18+ installed (`node -v`)
- [ ] Dependencies installed (`npm install --legacy-peer-deps`)
- [ ] Build works (`npm run build`)

---

## 🔐 Required GitHub Secrets

Set these in: Repository → Settings → Secrets and variables → Actions

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_PAYSTACK_PUBLIC_KEY
VITE_STRIPE_PUBLIC_KEY
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

---

## 🗄️ Database Setup (Required for Backup System)

1. Open Supabase SQL Editor
2. Run migration: `supabase/migrations/20250101_backup_recovery_system.sql`
3. Verify tables created: backup_jobs, backup_schedules, etc.

Or use CLI:
```bash
supabase db push
```

---

## 📊 Verify Deployment

1. **Check Status**: https://app.netlify.com/sites/alaskamega/deploys
2. **Visit Site**: https://alaskapay.netlify.app
3. **Test Login**: Use your credentials
4. **Check Admin**: Navigate to Backup & Recovery tab
5. **Create Test Backup**: Verify system works

---

## 🆘 Quick Troubleshooting

**Build fails?**
```bash
rm -rf node_modules dist
npm install --legacy-peer-deps
npm run build
```

**Environment variables not working?**
- Check Netlify: Site Settings → Environment Variables
- Ensure they start with `VITE_` for client-side

**Deployment timeout?**
- Check GitHub Actions logs
- Verify Netlify build logs

---

## 🎯 What's New in This Deploy

✅ Automated backup system
✅ Point-in-time recovery
✅ Backup verification
✅ Automated restore testing
✅ Retention policies
✅ Backup encryption
✅ Admin dashboard for backups
✅ Scheduled backup jobs

---

## 📞 Support

- GitHub Issues: https://github.com/YOUR_USERNAME/alaskamega/issues
- Documentation: See DEPLOY_UPDATED_PLATFORM.md
- Backup System: See BACKUP_RECOVERY_SYSTEM.md

# Environment Variable Sync System - Setup Guide

## 🚀 Quick Start

The automated environment variable sync system helps you detect missing variables and sync them to Vercel/Netlify with one click.

## 📋 Features

✅ **Automatic Detection** - Scans for missing environment variables
✅ **One-Click Setup** - Wizard-guided sync process
✅ **Real-Time Validation** - Validates variables before syncing
✅ **Multi-Platform** - Supports Vercel and Netlify
✅ **Visual Dashboard** - Monitor sync status and health

## 🎯 How to Use

### 1. Access the Dashboard

Navigate to Admin Panel → **Environment Sync** (🔄 icon in sidebar)

### 2. One-Click Setup Wizard

Click the **"One-Click Setup"** button and follow these steps:

#### Step 1: Platform Credentials
- Choose platform (Vercel or Netlify)
- Enter your Project/Site ID
- Enter your API Token

**Get Vercel Credentials:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login and link project
vercel login
vercel link

# Get IDs from .vercel/project.json
cat .vercel/project.json
```

**Get Netlify Credentials:**
- Site ID: Netlify Dashboard → Site Settings → General → Site Information
- API Token: User Settings → Applications → Personal Access Tokens

#### Step 2: Environment Variables
Enter values for each required variable:
- `VITE_SUPABASE_URL` (Required)
- `VITE_SUPABASE_ANON_KEY` (Required)
- `VITE_PAYSTACK_PUBLIC_KEY` (Required)
- `VITE_STRIPE_PUBLIC_KEY` (Optional)
- `VITE_GOOGLE_MAPS_API_KEY` (Optional)

#### Step 3: Review & Sync
- Review the variables to be synced
- Click "Sync Now" to push to platform
- Wait for confirmation

### 3. Variable Detection

The **Variable Detector** tab shows:
- ✅ Present variables (green checkmark)
- ❌ Missing variables (red alert)
- Required vs Optional status
- Variable descriptions

### 4. Validation Panel

The **Validation** tab provides:
- Configuration status percentage
- Validation results (pass/fail)
- Specific issues to fix
- Individual variable status

## 🔧 Manual Sync via API

### Vercel API

```bash
curl -X POST "https://api.vercel.com/v9/projects/YOUR_PROJECT_ID/env" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "encrypted",
    "key": "VITE_SUPABASE_URL",
    "value": "your-value",
    "target": ["production", "preview", "development"]
  }'
```

### Netlify API

```bash
curl -X PATCH "https://api.netlify.com/api/v1/sites/YOUR_SITE_ID/env" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "VITE_SUPABASE_URL": "your-value",
    "VITE_SUPABASE_ANON_KEY": "your-value"
  }'
```

## 📊 Dashboard Features

### Quick Actions
- **Sync to Vercel** - Push variables to Vercel
- **Sync to Netlify** - Push variables to Netlify
- **Export Variables** - Download .env file

### Platform Status
- Real-time connection status
- Last sync timestamp
- Active environment indicator

### Documentation Links
- Direct access to setup guides
- Platform-specific instructions
- Troubleshooting resources

## 🛠️ Troubleshooting

### "Missing required variable" Error
- Ensure all required variables are set
- Check variable names match exactly
- Verify values are not empty

### "Sync Failed" Error
- Verify API token is valid
- Check Project/Site ID is correct
- Ensure you have write permissions
- Check platform API status

### "Validation Failed" Error
- Some keys appear too short
- Required variables are missing
- Check for typos in variable names

## 🔐 Security Best Practices

1. **Never commit .env files** to version control
2. **Rotate tokens regularly** (every 90 days)
3. **Use encrypted values** on platforms
4. **Limit token permissions** to environment variables only
5. **Monitor sync logs** for unauthorized changes

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Supabase Setup Guide](./SUPABASE_SETUP_COMPLETE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🎉 Success Indicators

You'll know the sync is successful when:
- ✅ All required variables show green checkmarks
- ✅ Validation panel shows "All validations passed"
- ✅ Platform status shows "Connected"
- ✅ Configuration status is 100%
- ✅ Your deployment builds successfully

## 💡 Pro Tips

1. **Test locally first** - Verify variables work before syncing
2. **Use preview environments** - Test in staging before production
3. **Document custom variables** - Add descriptions for team members
4. **Set up alerts** - Monitor for missing variables in CI/CD
5. **Keep backups** - Export variables regularly

## 🚨 Common Issues

### 404 Error on Deployment
- Missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`
- Run the sync wizard to fix

### Build Fails
- Check all required variables are present
- Verify variable values are correct
- Review build logs for specific missing variables

### API Rate Limits
- Vercel: 100 requests per hour
- Netlify: 500 requests per hour
- Use batch operations when possible

## 📞 Support

If you need help:
1. Check the validation panel for specific issues
2. Review platform documentation
3. Check deployment logs
4. Contact platform support if API issues persist

---

**Last Updated:** 2025-01-13
**Version:** 1.0.0

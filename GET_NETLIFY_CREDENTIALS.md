# How to Get Netlify Credentials - Complete Guide

## Step 1: Get NETLIFY_AUTH_TOKEN

### Option A: Via Netlify Dashboard (Recommended)
1. **Go to Netlify**: https://app.netlify.com
2. **Login** to your account (or create one if you don't have it)
3. **Click your profile picture** (top right corner)
4. **Select "User settings"**
5. **Click "Applications"** in the left sidebar
6. **Scroll to "Personal access tokens"**
7. **Click "New access token"**
8. **Name it**: `Alaska Pay Deployment`
9. **Click "Generate token"**
10. **COPY THE TOKEN IMMEDIATELY** (shown only once!)
11. **Save it securely** - you'll need it for GitHub Secrets

### Option B: Direct Link
Go directly to: https://app.netlify.com/user/applications#personal-access-tokens

---

## Step 2: Get NETLIFY_SITE_ID

### For Existing Site:
1. **Go to**: https://app.netlify.com
2. **Select your Alaska Pay site** from the sites list
3. **Click "Site settings"** button
4. **Look for "Site information"** section
5. **Copy the "Site ID"** (looks like: `abc123def-4567-89gh-ijkl-mnopqrstuvwx`)

### For New Site:
1. **Go to**: https://app.netlify.com
2. **Click "Add new site"** → **"Import an existing project"**
3. **Connect to GitHub** and select your Alaska Pay repository
4. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Click "Deploy site"**
6. **After deployment**, go to **Site settings** → **General**
7. **Copy the "Site ID"**

---

## Step 3: Add to GitHub Secrets

### Manual Method:
1. **Go to your GitHub repository**
2. **Click "Settings"** tab
3. **Click "Secrets and variables"** → **"Actions"**
4. **Click "New repository secret"**
5. **Add first secret**:
   - Name: `NETLIFY_AUTH_TOKEN`
   - Value: (paste the token from Step 1)
   - Click "Add secret"
6. **Add second secret**:
   - Name: `NETLIFY_SITE_ID`
   - Value: (paste the site ID from Step 2)
   - Click "Add secret"

### Automated Method:
```bash
# Run the setup script
bash scripts/setup-github-secrets.sh
```

---

## Step 4: Verify Setup

### Test the deployment:
```bash
# Manual deployment
netlify deploy --prod --auth YOUR_TOKEN --site YOUR_SITE_ID

# Or use GitHub Actions
git push origin main
```

### Check GitHub Actions:
1. Go to your repository
2. Click "Actions" tab
3. Look for "Deploy to Netlify" workflow
4. Verify it runs successfully

---

## Troubleshooting

### "Token not found" error:
- Make sure you copied the entire token
- Check for extra spaces at the beginning/end
- Regenerate a new token if needed

### "Site not found" error:
- Verify the Site ID is correct
- Make sure the site exists in your Netlify account
- Check that the token has access to the site

### "Build failed" error:
- Check that all environment variables are set
- Verify build command is correct
- Check Netlify build logs for details

---

## Quick Reference

**Netlify Dashboard**: https://app.netlify.com
**Access Tokens**: https://app.netlify.com/user/applications
**GitHub Secrets**: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions

---

## Security Notes

⚠️ **NEVER commit tokens to your repository**
⚠️ **Store tokens securely** (password manager recommended)
⚠️ **Rotate tokens periodically** for security
⚠️ **Use separate tokens** for staging and production

---

## Need Help?

- Netlify Docs: https://docs.netlify.com
- GitHub Actions Docs: https://docs.github.com/actions
- Alaska Pay Support: Check the repository issues

# GitHub Actions Automatic Deployment Setup

## Step-by-Step Guide to Configure GitHub Secrets

### Step 1: Get Your Netlify Auth Token

1. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com/user/applications

2. **Create New Access Token:**
   - Scroll to "Personal access tokens"
   - Click "New access token"
   - Name it: "GitHub Actions Deploy"
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

### Step 2: Get Your Netlify Site ID

1. **Go to Your Site Settings:**
   - Visit: https://app.netlify.com/sites/alaskamega/settings

2. **Find Site ID:**
   - Look for "Site information" section
   - Copy the "Site ID" (looks like: `12abc345-6789-0def-ghij-klmnopqrstuv`)

### Step 3: Add Secrets to GitHub

1. **Go to Your GitHub Repository:**
   - Visit: https://github.com/YOUR_USERNAME/alaskamega/settings/secrets/actions

2. **Add NETLIFY_AUTH_TOKEN:**
   - Click "New repository secret"
   - Name: `NETLIFY_AUTH_TOKEN`
   - Value: Paste the token from Step 1
   - Click "Add secret"

3. **Add NETLIFY_SITE_ID:**
   - Click "New repository secret"
   - Name: `NETLIFY_SITE_ID`
   - Value: Paste the site ID from Step 2
   - Click "Add secret"

### Step 4: Verify Setup

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "test auto deploy"
   git push origin main
   ```

2. **Check GitHub Actions:**
   - Visit: https://github.com/YOUR_USERNAME/alaskamega/actions
   - You should see a workflow running
   - Wait for green checkmark ✓

3. **Check Netlify:**
   - Visit: https://app.netlify.com/sites/alaskamega/deploys
   - New deploy should appear automatically

## Quick Reference

### Required Secrets:
- `NETLIFY_AUTH_TOKEN` - From Netlify User Settings
- `NETLIFY_SITE_ID` - From Netlify Site Settings

### URLs You Need:
- Netlify Tokens: https://app.netlify.com/user/applications
- Netlify Site Settings: https://app.netlify.com/sites/alaskamega/settings
- GitHub Secrets: https://github.com/YOUR_USERNAME/alaskamega/settings/secrets/actions
- GitHub Actions: https://github.com/YOUR_USERNAME/alaskamega/actions

## Troubleshooting

### "Secret not found" error:
- Make sure secret names are EXACTLY: `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
- Check for typos or extra spaces

### "Unauthorized" error:
- Regenerate Netlify token
- Make sure you copied the full token
- Update GitHub secret with new token

### Workflow not running:
- Check if GitHub Actions are enabled in repo settings
- Make sure you pushed to the correct branch
- Check workflow file syntax

## Success! 🎉

Once configured, every push to GitHub will automatically:
1. Build your React app
2. Run tests (if any)
3. Deploy to Netlify
4. Update your live site

Your site will be live at: **https://alaskapay.netlify.app**

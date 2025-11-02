# 🚀 LAUNCH NOW - Alaska Pay

## ⚡ INSTANT DEPLOY (Click & Done)

### 👉 ONE CLICK DEPLOY:
**https://app.netlify.com/sites/alaskamega/deploys**

1. Login to Netlify
2. Find draft `68eab9bf`
3. Click "Publish deploy"
4. LIVE! → https://alaskapay.netlify.app

---

## 🤖 AUTO-DEPLOY SETUP (Never Deploy Manually Again)

### Copy-Paste These Commands:

```bash
# Make script executable
chmod +x scripts/setup-github-secrets.sh

# Run setup (will prompt for tokens)
./scripts/setup-github-secrets.sh

# Deploy
git add .
git commit -m "auto deploy setup"
git push
```

### Get Your Tokens:

**Netlify Token:** https://app.netlify.com/user/applications
- Click "New access token"
- Name: "GitHub Deploy"
- Copy token

**Site ID:** https://app.netlify.com/sites/alaskamega/settings
- Copy "Site ID" value

**Add to GitHub:** https://github.com/YOUR_USERNAME/alaskamega/settings/secrets/actions
- Secret 1: `NETLIFY_AUTH_TOKEN`
- Secret 2: `NETLIFY_SITE_ID`

---

## 📋 ALL IMPORTANT LINKS

| What | Link |
|------|------|
| **Live Site** | https://alaskapay.netlify.app |
| **Netlify Dashboard** | https://app.netlify.com/sites/alaskamega |
| **Get Token** | https://app.netlify.com/user/applications |
| **Site Settings** | https://app.netlify.com/sites/alaskamega/settings |
| **GitHub Secrets** | https://github.com/YOUR_USERNAME/alaskamega/settings/secrets/actions |
| **GitHub Actions** | https://github.com/YOUR_USERNAME/alaskamega/actions |

---

## ✅ VERIFICATION

After setup, test it:
```bash
git commit --allow-empty -m "test deploy"
git push
```

Watch it deploy:
- GitHub Actions: Auto-build starts
- Netlify: New deploy appears
- Site: Updates in 2-3 minutes

---

## 🆘 TROUBLESHOOTING

**"Can't find draft"** → Login to Netlify with GitHub account

**"Unauthorized"** → Regenerate Netlify token, update GitHub secret

**"Workflow not running"** → Check GitHub Actions are enabled in repo settings

**Need help?** → See `GITHUB_ACTIONS_SETUP.md` for detailed guide

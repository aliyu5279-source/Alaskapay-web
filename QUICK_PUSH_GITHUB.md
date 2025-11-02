# 🚀 Push Alaska Pay to GitHub - Quick Start

## 📋 What You Need
1. **Git installed** - [Download Git](https://git-scm.com/downloads)
2. **GitHub account** - [Sign up free](https://github.com/join)
3. **Your GitHub repo URL** - Example: `https://github.com/yourusername/alaska-pay.git`

---

## ⚡ FASTEST METHOD - Use Automated Scripts

### 🪟 **Windows Users**
1. Open Command Prompt or PowerShell in your project folder
2. Run: `push-to-github.bat`
3. Enter your GitHub repo URL when prompted
4. Done! ✅

### 🍎 **Mac/Linux Users**
1. Open Terminal in your project folder
2. Run: `chmod +x push-to-github.sh && ./push-to-github.sh`
3. Enter your GitHub repo URL when prompted
4. Done! ✅

---

## 📝 Manual Method (All Operating Systems)

### Step 1: Open Terminal/Command Prompt
Navigate to your Alaska Pay folder:
```bash
cd /path/to/alaska-pay
```

### Step 2: Run These Commands
```bash
# Remove old git history (if exists)
rm -rf .git          # Mac/Linux
rmdir /s .git        # Windows

# Initialize fresh repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Alaska Pay"

# Connect to your GitHub repo (REPLACE WITH YOUR URL!)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 Authentication

When pushing, GitHub will ask for credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (NOT your GitHub password)

### Get Your Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select `repo` scope
4. Copy the token
5. Use it as your password when pushing

---

## ❌ Common Errors & Fixes

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin YOUR_GITHUB_URL
```

### "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### "Authentication failed"
- Use Personal Access Token instead of password
- Or set up SSH keys: https://docs.github.com/en/authentication

---

## ✅ Verify Success

After pushing, visit your GitHub repo URL in a browser.
You should see all your Alaska Pay files! 🎉

---

## 📚 Helpful Links

- **Git Download**: https://git-scm.com/downloads
- **GitHub Signup**: https://github.com/join
- **Create New Repo**: https://github.com/new
- **Personal Access Tokens**: https://github.com/settings/tokens
- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/

---

## 🆘 Need Help?

1. Check if Git is installed: `git --version`
2. Check GitHub status: https://www.githubstatus.com/
3. Read full guide: See `PUSH_TO_GITHUB.md`
4. Contact support or check Stack Overflow

---

## 🎯 Next Steps After Pushing

1. ✅ **Set up CI/CD** - See `DEPLOYMENT_GUIDE.md`
2. ✅ **Deploy to Netlify/Vercel** - See deployment docs
3. ✅ **Configure environment variables**
4. ✅ **Set up custom domain**
5. ✅ **Enable branch protection**

---

**Made with ❤️ for Alaska Pay**

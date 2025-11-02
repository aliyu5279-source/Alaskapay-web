# Push Alaska Pay to GitHub - Step by Step Guide

## Prerequisites
- Git installed on your computer
- GitHub account created
- Your GitHub repository URL ready

## Step-by-Step Instructions

### Step 1: Open Terminal/Command Prompt
Navigate to your Alaska Pay project folder:
```bash
cd /path/to/your/alaska-pay-project
```

### Step 2: Check for Existing Git Repository
```bash
# Check if .git folder exists
ls -la | grep .git
```

**If .git exists and you want a fresh start:**
```bash
# Windows
rmdir /s .git

# Mac/Linux
rm -rf .git
```

### Step 3: Initialize Git Repository
```bash
git init
```

### Step 4: Configure Git (First Time Only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 5: Add All Files
```bash
git add .
```

### Step 6: Create Initial Commit
```bash
git commit -m "Initial commit: Alaska Pay project"
```

### Step 7: Connect to GitHub Repository
Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
```

**Example:**
```bash
git remote add origin https://github.com/aliyu5279/alaska-pay.git
```

### Step 8: Verify Remote Connection
```bash
git remote -v
```

### Step 9: Push to GitHub
```bash
# Push to main branch
git branch -M main
git push -u origin main
```

**If you get authentication errors:**
- You may need a Personal Access Token (PAT) instead of password
- Go to: GitHub → Settings → Developer settings → Personal access tokens
- Generate new token with 'repo' permissions
- Use token as password when prompted

## Quick Command Summary (Copy & Paste)

```bash
# Navigate to project
cd /path/to/your/alaska-pay-project

# Remove old git if needed
rm -rf .git

# Initialize and commit
git init
git add .
git commit -m "Initial commit: Alaska Pay project"

# Connect to GitHub (replace with YOUR repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin YOUR_GITHUB_URL
```

### Error: "failed to push some refs"
```bash
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: "Authentication failed"
- Use Personal Access Token instead of password
- Or set up SSH keys

## After Successful Push

Your project is now on GitHub! Next steps:
1. Set up automated deployment (Netlify/Vercel)
2. Enable GitHub Pages if needed
3. Add collaborators
4. Set up branch protection rules

## Need Help?
- Check GitHub status: https://www.githubstatus.com/
- Git documentation: https://git-scm.com/doc

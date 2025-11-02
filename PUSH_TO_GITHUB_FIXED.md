# Push to GitHub - Fixed Commands

## Problem: "command not found" error

This means Git is not installed or not in your PATH. Here are solutions:

## Solution 1: Install Git (If Not Installed)

### Windows:
1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Restart your terminal/command prompt
4. Try the commands again

### Mac:
```bash
brew install git
```
Or download from: https://git-scm.com/download/mac

### Linux:
```bash
sudo apt-get install git  # Ubuntu/Debian
sudo yum install git      # CentOS/RHEL
```

## Solution 2: Use GitHub Desktop (Easiest)

1. Download GitHub Desktop: https://desktop.github.com/
2. Open GitHub Desktop
3. Click "Add" → "Add Existing Repository"
4. Select your Alaska-pay folder
5. Click "Publish repository" or "Push origin"

## Solution 3: Use VS Code Built-in Git

1. Open your project in VS Code
2. Click the Source Control icon (left sidebar)
3. Stage all changes (+ icon)
4. Enter commit message: "Fix GitHub Pages deployment"
5. Click the checkmark to commit
6. Click "..." → "Push"

## Solution 4: Manual Git Commands (After Installing Git)

Open terminal in your project folder:

```bash
# Check if git is installed
git --version

# If git is installed, run these commands:
git add .
git commit -m "Fix GitHub Pages deployment and DNS configuration"
git push origin master
```

## Solution 5: Use the Batch File (Windows)

Double-click: `push-to-github.bat`

This will automatically push your code.

## After Pushing Successfully

1. Go to: https://github.com/aliyu5279-source/Alaska-pay
2. Click "Actions" tab
3. Wait for the deployment to complete (green checkmark)
4. Visit: https://aliyu5279-source.github.io/Alaska-pay/

## Still Having Issues?

### Check Repository Settings:
1. Go to your GitHub repository
2. Click "Settings" → "Pages"
3. Ensure Source is set to "GitHub Actions"
4. Check if there are any error messages

### Verify Branch Name:
Your branch might be called "main" instead of "master":
```bash
git branch  # Check current branch name
git push origin main  # If branch is "main"
```

## Quick Troubleshooting

**Error: "repository not found"**
- Check if you're logged into the correct GitHub account
- Verify repository exists at: https://github.com/aliyu5279-source/Alaska-pay

**Error: "permission denied"**
- Set up authentication: https://docs.github.com/en/authentication
- Use GitHub Desktop instead (easier)

**Error: "failed to push"**
- Pull first: `git pull origin master`
- Then push: `git push origin master`

## Need Help?

1. Share the exact error message you see
2. Tell me which method you're trying (Git command, GitHub Desktop, VS Code)
3. Let me know your operating system (Windows/Mac/Linux)

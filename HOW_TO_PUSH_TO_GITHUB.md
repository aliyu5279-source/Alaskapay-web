# How to Push Changes to GitHub

## Quick Method (Copy and Paste)

Open your terminal/command prompt in your project folder and run these commands one by one:

```bash
git add .
git commit -m "Add transaction history tab to airtime modal"
git push origin main
```

## Step-by-Step Instructions

### 1. Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
- **VS Code**: Press `` Ctrl + ` `` (backtick) or go to Terminal > New Terminal

### 2. Navigate to Your Project Folder
```bash
cd path/to/your/project
```

### 3. Check What Changed
```bash
git status
```
This shows you all the files that were modified.

### 4. Add All Changes
```bash
git add .
```
The dot (.) means "add all changed files"

### 5. Commit Changes
```bash
git commit -m "Add transaction history tab to airtime modal"
```
The message in quotes describes what you changed.

### 6. Push to GitHub
```bash
git push origin main
```
This uploads your changes to GitHub.

## Vercel Auto-Deploy

Once you push to GitHub:
1. Vercel will automatically detect the changes
2. It will start building your app (takes 1-2 minutes)
3. Your live site will update automatically
4. You'll see the changes at your Vercel URL

## Check Deployment Status

1. Go to [vercel.com](https://vercel.com)
2. Log in to your account
3. Click on your project
4. You'll see the deployment progress

## Troubleshooting

### If you get "permission denied"
```bash
git remote -v
```
Make sure the URL shows your GitHub username.

### If you get "rejected" error
```bash
git pull origin main
git push origin main
```

### If you need to configure git first
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## What Changed?

The airtime modal now has two tabs:
1. **Buy Airtime** - The form to purchase airtime
2. **History** - Shows your past 10 airtime transactions

Users can now see their transaction history without closing the modal!

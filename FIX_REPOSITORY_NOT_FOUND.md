# Fix: Repository Not Found Error

## The Problem
You're trying to push to the **GitHub Pages URL** instead of the **repository URL**.

**Wrong URL (GitHub Pages - deployment site):**
```
https://aliyu5279-source.github.io/Alaska-pay/
```

**Correct URL (Repository):**
```
https://github.com/aliyu5279-source/Alaska-pay.git
```

---

## Solution 1: Fix Remote URL (Quickest)

### Step 1: Check Current Remote
```bash
git remote -v
```

### Step 2: Remove Wrong Remote
```bash
git remote remove origin
```

### Step 3: Add Correct Remote
```bash
git remote add origin https://github.com/aliyu5279-source/Alaska-pay.git
```

### Step 4: Push to GitHub
```bash
git push -u origin master
```

---

## Solution 2: Create Repository First (If It Doesn't Exist)

### Option A: Create on GitHub Website
1. Go to https://github.com
2. Click the **+** icon (top right) → **New repository**
3. Repository name: `Alaska-pay`
4. Keep it **Public**
5. **DO NOT** initialize with README
6. Click **Create repository**

### Option B: Use GitHub CLI
```bash
# Install GitHub CLI first: https://cli.github.com/
gh repo create Alaska-pay --public --source=. --remote=origin --push
```

---

## Solution 3: Complete Setup Commands

```bash
# 1. Initialize git (if not done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit"

# 4. Set correct remote
git remote add origin https://github.com/aliyu5279-source/Alaska-pay.git

# 5. Push
git push -u origin master
```

---

## Solution 4: Use GitHub Desktop (No Commands)

1. Download: https://desktop.github.com/
2. Install and sign in
3. Click **File** → **Add Local Repository**
4. Select your Alaska-pay folder
5. Click **Publish repository**
6. Name: `Alaska-pay`
7. Click **Publish Repository**

---

## Troubleshooting

### Error: "Repository not found"
**Cause:** Repository doesn't exist on GitHub yet

**Fix:** Create it first using Solution 2

### Error: "Permission denied"
**Cause:** Not authenticated

**Fix:** 
```bash
# Use personal access token
git remote set-url origin https://YOUR_TOKEN@github.com/aliyu5279-source/Alaska-pay.git
```

Or use GitHub Desktop (easier)

### Error: "Branch master not found"
**Fix:**
```bash
git branch -M master
git push -u origin master
```

---

## Quick Reference

### Check what remote you have:
```bash
git remote -v
```

### Change remote URL:
```bash
git remote set-url origin https://github.com/aliyu5279-source/Alaska-pay.git
```

### Force push (if needed):
```bash
git push -u origin master --force
```

---

## Need Help?

1. **Verify repository exists:** Go to https://github.com/aliyu5279-source/Alaska-pay
2. **If 404 error:** Repository doesn't exist - create it first
3. **If exists:** Use Solution 1 to fix remote URL

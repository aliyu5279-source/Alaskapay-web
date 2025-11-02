# Setup Node.js First - Complete Beginner Guide

## ⚠️ You Need Node.js Before Running This Project

Your system doesn't have Node.js installed yet. Follow these simple steps:

---

## Step 1: Install Node.js

### For Windows:
1. Go to: https://nodejs.org/
2. Click the **green button** that says "Download Node.js (LTS)"
3. Wait for the download to finish
4. Double-click the downloaded file (node-v20.x.x-x64.msi)
5. Click "Next" → "Next" → "Next" → "Install"
6. Wait for installation to complete
7. Click "Finish"

### For Mac:
1. Go to: https://nodejs.org/
2. Click the **green button** that says "Download Node.js (LTS)"
3. Open the downloaded .pkg file
4. Follow the installation wizard
5. Enter your password when asked

### For Linux:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora
sudo dnf install nodejs

# Arch Linux
sudo pacman -S nodejs npm
```

---

## Step 2: Verify Node.js is Installed

Open a **NEW** terminal/command prompt and type:

```bash
node --version
```

You should see something like: `v20.11.0`

Then type:
```bash
npm --version
```

You should see something like: `10.2.4`

✅ If you see version numbers, Node.js is installed correctly!

---

## Step 3: Now Install Project Dependencies

Navigate to your project folder:

```bash
cd path/to/your/project
```

Then run:

```bash
npm install
```

This will download all required packages (may take 2-5 minutes).

---

## Step 4: Start the Development Server

After npm install completes successfully, run:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Step 5: View Your Project

Open your web browser and go to:

**http://localhost:5173**

🎉 Your project should now be running!

---

## Common Issues & Solutions

### Issue: "npm is not recognized"
**Solution:** Restart your computer after installing Node.js, then try again.

### Issue: "Permission denied" (Mac/Linux)
**Solution:** Don't use `sudo`. If it still fails:
```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Issue: "EACCES" error
**Solution:** 
```bash
npm cache clean --force
npm install
```

### Issue: Port 5173 already in use
**Solution:** Kill the process or use a different port:
```bash
npm run dev -- --port 3000
```

---

## What is Node.js?

Node.js is a JavaScript runtime that allows you to run JavaScript code on your computer (not just in browsers). It includes:
- **Node.js**: Runs JavaScript
- **npm**: Package manager (installs project dependencies)

Think of it like this:
- Your project is a car 🚗
- Node.js is the engine 🔧
- npm is the tool that installs all the parts ⚙️

---

## Next Steps After Setup

1. ✅ Install Node.js (you're here)
2. ✅ Run `npm install`
3. ✅ Run `npm run dev`
4. 🌐 View at http://localhost:5173
5. 🚀 Deploy to get a public link (see SIMPLE_DEPLOY.md)

---

## Need Help?

If you're still stuck:
1. Make sure you installed the **LTS version** from nodejs.org
2. Restart your computer after installation
3. Open a **NEW** terminal window
4. Try the commands again

---

## Quick Reference Card

```bash
# Check if Node.js is installed
node --version
npm --version

# Install project dependencies
npm install

# Start development server
npm run dev

# Stop the server
Press Ctrl + C
```

Save this guide and refer back to it anytime! 📖

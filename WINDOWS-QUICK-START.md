# 🚀 AlaskaPay - Windows 10 Quick Start Guide

## ✅ Step 1: Verify Node.js Installation

Open **Command Prompt** or **PowerShell** and run:
```bash
node --version
npm --version
```

You should see version numbers (e.g., v20.x.x and 10.x.x)

---

## 🎯 Step 2: Start the Application

### **EASIEST METHOD** - Double-Click to Start:
1. Find `START-WINDOWS.bat` in your project folder
2. **Double-click** it
3. Wait for installation (first time only, takes 2-3 minutes)
4. Browser will open automatically at http://localhost:5173

### **MANUAL METHOD** - Using Command Line:
1. Open **Command Prompt** in project folder
2. Run: `npm install` (first time only)
3. Run: `npm run dev`
4. Open browser to: http://localhost:5173

---

## 🔍 Step 3: Verify Everything Works

### You should see:
✅ AlaskaPay homepage loads
✅ Navigation menu works
✅ No error messages in browser console (F12)

### Test these features:
1. Click "Sign Up" - form should appear
2. Click "Login" - login form should appear
3. Navigate through menu items
4. Check footer links work

---

## 🛠️ Troubleshooting

### "Port 5173 already in use"
- Close other terminals running the app
- Or change port: `npm run dev -- --port 3000`

### "Module not found" errors
- Delete `node_modules` folder
- Run `npm install` again

### Browser shows blank page
- Check terminal for errors
- Press F12 in browser, check Console tab
- Try: `npm run build` then `npm run preview`

---

## 📱 Access from Phone (Same WiFi)

1. Find your PC's IP: `ipconfig` (look for IPv4)
2. On phone browser: `http://YOUR-IP:5173`
3. Example: `http://192.168.1.100:5173`

---

## 🎉 You're Ready!

The app is now running. To stop it:
- Press `Ctrl + C` in the terminal
- Close the terminal window

**Next Steps:** Check the README.md for features and configuration!

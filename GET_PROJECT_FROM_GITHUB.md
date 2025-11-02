# 📥 Get AlaskaPay Project from GitHub

## Step 1: Install Git (If Not Installed)

### Windows:
1. Download: https://git-scm.com/download/win
2. Run installer → Click "Next" until finished
3. Open **Command Prompt** or **Git Bash**

### Mac:
```bash
# Install using Homebrew
brew install git

# Or download from: https://git-scm.com/download/mac
```

### Linux:
```bash
sudo apt install git
```

---

## Step 2: Find Your GitHub Repository URL

1. Go to **https://github.com**
2. Log in to your account
3. Find your **AlaskaPay** repository
4. Click the green **"Code"** button
5. Copy the HTTPS URL (looks like: `https://github.com/USERNAME/alaskapay.git`)

---

## Step 3: Clone the Project

```bash
# Navigate to where you want the project
cd Desktop

# Clone your repository (replace with YOUR URL)
git clone https://github.com/YOUR_USERNAME/alaskapay.git

# Enter the project folder
cd alaskapay
```

---

## Step 4: Install Node.js (Required!)

**Check if installed:**
```bash
node --version
npm --version
```

**If not installed:**
- Windows/Mac: https://nodejs.org (Download LTS version)
- Linux: `sudo apt install nodejs npm`

---

## Step 5: Install Project Dependencies

```bash
npm install
```

This will take 2-5 minutes.

---

## Step 6: Set Up Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env file with your API keys
# (Use Notepad, VS Code, or any text editor)
```

---

## Step 7: Run the Project

```bash
npm run dev
```

Open browser: **http://localhost:5173**

---

## 🆘 Troubleshooting

**"git is not recognized"**
→ Install Git (Step 1)

**"npm is not recognized"**
→ Install Node.js (Step 4)

**"Permission denied"**
→ Run as Administrator (Windows) or use `sudo` (Mac/Linux)

**Can't find repository**
→ Make sure you're logged into GitHub and have access

---

## 📚 Next Steps

- [SETUP_NODE_FIRST.md](./SETUP_NODE_FIRST.md) - Node.js setup guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deploy online
- [README.md](./README.md) - Main documentation

---

## Need Help?

**Email:** support@alaskapay.ng  
**Documentation:** Check the guides in your project folder

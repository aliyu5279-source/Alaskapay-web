@echo off
echo 🔧 Fixing Netlify build configuration...

REM Add all changes
git add .

REM Commit changes
git commit -m "Fix: Update Netlify build configuration to resolve package.json error"

REM Push to GitHub
git push origin main

echo ✅ Changes pushed to GitHub!
echo 🚀 Netlify will automatically redeploy your site
echo.
echo 📍 Check your deployment at: https://app.netlify.com
echo.
echo Your site will be live in 2-3 minutes!
pause

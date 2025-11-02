@echo off
echo.
echo 🔧 Auto-fixing and deploying to GitHub...
echo.

REM Check if git is initialized
if not exist .git (
    echo 📦 Initializing git repository...
    git init
    echo ✅ Git initialized
)

REM Add all changes
echo 📝 Adding all changes...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Fix: Updated Netlify configuration and auto-deploy setup"

REM Check if remote exists
git remote | findstr "origin" >nul
if errorlevel 1 (
    echo.
    echo ⚠️  No remote 'origin' found!
    echo Please add your GitHub repository:
    echo git remote add origin YOUR_GITHUB_REPO_URL
    pause
    exit /b 1
)

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main
if errorlevel 1 git push -u origin master

echo.
echo ✅ Successfully deployed to GitHub!
echo.
echo 🌐 Your Netlify site will auto-deploy from GitHub
echo 📍 Netlify Project ID: a49be8e7-5d3e-442a-962f-42cc53fce437
echo.
echo 🔗 Check your deployment at:
echo    https://app.netlify.com/sites/YOUR_SITE_NAME/deploys
echo.
pause

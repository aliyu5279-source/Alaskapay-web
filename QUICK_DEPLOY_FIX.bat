@echo off
REM Quick Deploy Fix for Vercel Blank Page (Windows)
REM This script will commit and push the fix to trigger automatic Vercel deployment

echo.
echo ================================
echo AlaskaPay - Quick Deploy Fix
echo ================================
echo.

REM Check if git is initialized
if not exist .git (
    echo Error: Not a git repository
    echo Please run: git init
    pause
    exit /b 1
)

echo Staging changes...
git add src/App.tsx FIX_VERCEL_BLANK_PAGE.md QUICK_DEPLOY_FIX.sh QUICK_DEPLOY_FIX.bat

echo.
echo Committing fix...
git commit -m "Fix Vercel blank page - remove BrowserRouter basename"

echo.
echo Pushing to repository...
git push origin main

echo.
echo ================================
echo Fix deployed successfully!
echo ================================
echo.
echo Vercel will automatically rebuild in ~2 minutes
echo Check your app at: https://alaskapayment-xh2y.vercel.app/
echo.
echo Monitor deployment at: https://vercel.com/dashboard
echo.
pause

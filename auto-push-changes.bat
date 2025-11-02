@echo off
echo.
echo ========================================
echo    AlaskaPay - Automatic Git Push
echo ========================================
echo.

echo Adding all changes...
git add .

echo.
echo Committing changes...
git commit -m "Fix: Remove BrowserRouter basename to fix Vercel blank page issue"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo    Changes Pushed Successfully!
echo ========================================
echo.
echo Vercel will automatically deploy your app
echo Check: https://alaskapayment-xh2y.vercel.app/
echo.
echo Deployment takes 1-2 minutes
echo Refresh your browser after completion
echo.
pause

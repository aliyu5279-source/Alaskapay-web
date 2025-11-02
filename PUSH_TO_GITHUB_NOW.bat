@echo off
echo ========================================
echo PUSHING TO GITHUB - AlaskaPay
echo ========================================
echo.

REM Remove git lock file if exists
if exist .git\index.lock (
    echo Removing git lock file...
    del .git\index.lock
    echo Lock file removed!
    echo.
)

REM Check if remote exists
git remote -v | findstr origin >nul 2>&1
if %errorlevel% equ 0 (
    echo Remote already exists, updating URL...
    git remote set-url origin https://github.com/aliyu5279-source/alaskapayment.git
) else (
    echo Adding remote origin...
    git remote add origin https://github.com/aliyu5279-source/alaskapayment.git
)

echo.
echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "Enable admin panel and update features"

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo DONE! Check Vercel - it should auto-deploy
echo ========================================
pause

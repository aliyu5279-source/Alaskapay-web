@echo off
echo ========================================
echo Pushing Changes to GitHub
echo ========================================
echo.

echo Step 1: Adding all changes...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add changes
    pause
    exit /b 1
)
echo ✓ Changes added successfully
echo.

echo Step 2: Committing changes...
git commit -m "Fix: Currency display now shows Naira, increased transaction limits to 50k"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit changes
    pause
    exit /b 1
)
echo ✓ Changes committed successfully
echo.

echo Step 3: Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo Trying 'master' branch instead...
    git push origin master
    if %errorlevel% neq 0 (
        echo ERROR: Failed to push changes
        pause
        exit /b 1
    )
)
echo ✓ Changes pushed successfully
echo.

echo ========================================
echo SUCCESS! Changes pushed to GitHub
echo Vercel will auto-deploy in 2-3 minutes
echo ========================================
echo.
pause

@echo off
echo ========================================
echo AUTOMATIC DEPLOYMENT TO VERCEL
echo ========================================
echo.

echo [Step 1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo ✓ Node.js found
echo.

echo [Step 2/4] Installing Vercel CLI...
call npm install -g vercel
echo ✓ Vercel CLI installed
echo.

echo [Step 3/4] Building your project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Build successful
echo.

echo [Step 4/4] Deploying to Vercel...
echo You will need to:
echo 1. Login to Vercel (browser will open)
echo 2. Follow the prompts
echo.
call vercel --prod
echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo Your live URL is shown above
echo ========================================
pause

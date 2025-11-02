@echo off
echo ========================================
echo AUTOMATIC SETUP AND DEPLOY
echo ========================================
echo.

echo [Step 1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [Step 2/5] Cleaning npm cache...
call npm cache clean --force
echo ✓ Cache cleaned
echo.

echo [Step 3/5] Installing dependencies (this may take 2-5 minutes)...
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: npm install failed!
    echo Trying alternative method...
    call npm install --legacy-peer-deps
    if errorlevel 1 (
        echo Still failed. Please check your internet connection.
        pause
        exit /b 1
    )
)
echo ✓ Dependencies installed
echo.

echo [Step 4/5] Starting development server...
echo Your app will open at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server when ready to deploy
echo.
start http://localhost:5173
call npm run dev

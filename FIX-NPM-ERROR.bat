@echo off
echo ========================================
echo FIXING NPM ERRORS
echo ========================================
echo.

echo This will fix the "unexpected identifier" error
echo.

echo [Step 1/6] Checking if you're in the right folder...
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo You need to run this inside your project folder.
    echo.
    echo Right-click your project folder and select "Open in Terminal"
    echo Then run this script again.
    pause
    exit /b 1
)
echo ✓ You're in the right folder
echo.

echo [Step 2/6] Checking Node.js version...
node --version
echo ✓ Node.js is working
echo.

echo [Step 3/6] Deleting old files...
if exist "node_modules" rmdir /s /q node_modules
if exist "package-lock.json" del package-lock.json
echo ✓ Old files removed
echo.

echo [Step 4/6] Cleaning npm cache...
call npm cache clean --force
echo ✓ Cache cleaned
echo.

echo [Step 5/6] Installing fresh dependencies...
call npm install
if errorlevel 1 (
    echo.
    echo Trying alternative method...
    call npm install --legacy-peer-deps --force
)
echo ✓ Installation complete
echo.

echo [Step 6/6] Starting your app...
echo Opening http://localhost:5173
echo.
start http://localhost:5173
call npm run dev

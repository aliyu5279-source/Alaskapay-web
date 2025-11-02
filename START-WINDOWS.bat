@echo off
echo ========================================
echo   STARTING YOUR PROJECT
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install

echo.
echo [2/3] Starting development server...
echo.
echo ========================================
echo   YOUR PROJECT WILL OPEN AT:
echo   http://localhost:5173
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause

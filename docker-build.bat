@echo off
REM Docker Build and Deploy Script for Windows
REM One-command Docker deployment

echo.
echo ================================
echo   AlaskaPay Docker Build
echo ================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed!
    echo Please install Docker Desktop from: https://www.docker.com/get-started
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [OK] Docker is installed and running
echo.

REM Build production image
echo Building production Docker image...
docker build -t alaskapay-app:latest .

if %errorlevel% neq 0 (
    echo ERROR: Docker build failed!
    pause
    exit /b 1
)

echo.
echo [OK] Build complete!
echo.

REM Stop and remove existing container
echo Stopping existing container...
docker stop alaskapay-app 2>nul
docker rm alaskapay-app 2>nul

echo.
echo Starting container...
docker run -d --name alaskapay-app -p 8080:8080 --restart unless-stopped alaskapay-app:latest

echo.
echo ================================
echo   SUCCESS!
echo ================================
echo.
echo Your app is running at:
echo   http://localhost:8080
echo.
echo View logs:
echo   docker logs -f alaskapay-app
echo.
echo Stop container:
echo   docker stop alaskapay-app
echo.
pause

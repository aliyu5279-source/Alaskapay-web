# PowerShell Script to Push Changes to GitHub
# This will automatically commit and push your changes

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AlaskaPay - Auto Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Step 1: Adding all changes..." -ForegroundColor Green
git add .

Write-Host "Step 2: Committing changes..." -ForegroundColor Green
git commit -m "Fix Vercel blank page - Remove GitHub Pages scripts"

Write-Host "Step 3: Pushing to GitHub..." -ForegroundColor Green
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Changes pushed to GitHub" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Vercel will automatically deploy in 1-2 minutes" -ForegroundColor Cyan
    Write-Host "Check: https://alaskapayment-1vcy.vercel.app/" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host "Try manually: git push origin main" -ForegroundColor Yellow
}

Write-Host ""
pause

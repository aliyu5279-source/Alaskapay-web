# AlaskaPay - Quick Push to GitHub (PowerShell)
# This script saves and uploads your changes

Write-Host "🚀 AlaskaPay - Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "📥 Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Add all changes
Write-Host "📦 Saving all changes..." -ForegroundColor Yellow
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to add files" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Commit changes
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m "Fix Vercel blank page - remove external Capacitor dependencies"

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ No changes to commit (or commit failed)" -ForegroundColor Yellow
}

# Push to GitHub
Write-Host "☁️ Uploading to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try these fixes:" -ForegroundColor Yellow
    Write-Host "1. Run: git config --global user.email 'your@email.com'" -ForegroundColor White
    Write-Host "2. Run: git config --global user.name 'Your Name'" -ForegroundColor White
    Write-Host "3. Check your internet connection" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "✅ SUCCESS! Changes pushed to GitHub" -ForegroundColor Green
Write-Host ""
Write-Host "⏱️ Vercel is now deploying (1-2 minutes)..." -ForegroundColor Cyan
Write-Host "🌐 Check: https://alaskapayment-1vcy.vercel.app/" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"

@echo off
echo === Fixing package.json Git Issues ===

if not exist package.json (
    echo ERROR: package.json not found!
    exit /b 1
)

echo ✓ package.json found
echo.

echo === package.json Info ===
dir package.json
echo.

echo Removing package.json from Git cache...
git rm --cached package.json 2>nul

echo Force adding package.json...
git add -f package.json

echo.
echo === Git Status ===
git status package.json

echo.
echo Committing package.json...
git commit -m "Fix: Force add package.json to repository"

echo.
echo Pushing to remote...
git push origin main

echo.
echo === Done! ===
echo Now try deploying again on Netlify or use Vercel instead
echo.
echo For Vercel deployment, run: npm install -g vercel ^&^& vercel --prod
pause

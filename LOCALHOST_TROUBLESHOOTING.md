# 🔧 Localhost Connection Troubleshooting

## Quick Fixes (Try These First)

### 1. **Check Browser Console for Errors**
- Open browser DevTools: Press `F12` or `Ctrl+Shift+I`
- Go to Console tab
- Look for red error messages
- Share any errors you see

### 2. **Try Different URL Formats**
```
http://localhost:5178/
http://localhost:5178/Alaska-pay/
http://127.0.0.1:5178/
```

### 3. **Clear Browser Cache**
- Press `Ctrl+Shift+Delete`
- Clear cached images and files
- Or try Incognito/Private mode: `Ctrl+Shift+N`

### 4. **Restart Dev Server**
```bash
# Stop server: Ctrl+C in terminal
npm run dev
```

### 5. **Check Firewall**
- Windows Defender might be blocking port 5178
- Allow Node.js through firewall when prompted

### 6. **Try Different Browser**
- Chrome, Firefox, or Edge
- Sometimes one browser works when others don't

## Common Issues

### Issue: "This site can't be reached"
**Solution:** Server isn't actually running
```bash
# Kill all Node processes
taskkill /F /IM node.exe
# Restart
npm run dev
```

### Issue: Blank white page
**Solution:** JavaScript error - check console (F12)

### Issue: "Cannot GET /Alaska-pay"
**Solution:** Routing issue - use http://localhost:5178/ instead

## Still Not Working?

1. Share screenshot of terminal output
2. Share screenshot of browser console (F12)
3. Try: `npm install` then `npm run dev`

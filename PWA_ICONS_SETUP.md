# AlaskaPay PWA Icons Setup Guide

## Overview
AlaskaPay now has a complete Progressive Web App (PWA) icon configuration that enables users to install the app on their mobile devices with the AlaskaPay logo appearing correctly on home screens.

## Generated PWA Icons

### Icon Sizes
1. **192x192 pixels** - Standard PWA icon
   - URL: `https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1761336944349_fcc7303a.webp`
   - Purpose: Any/Maskable
   - Used for: Android home screen, app drawer

2. **512x512 pixels** - High-resolution PWA icon
   - URL: `https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1761336946640_52aa12f8.webp`
   - Purpose: Any/Maskable
   - Used for: Splash screens, high-DPI displays, iOS home screen

## Manifest.json Configuration

The `public/manifest.json` file has been updated with:

```json
{
  "name": "AlaskaPay - Digital Payment Platform by Alaska Mega Plus Nigeria Ltd",
  "short_name": "AlaskaPay",
  "icons": [
    {
      "src": "192x192 icon URL",
      "sizes": "192x192",
      "type": "image/webp",
      "purpose": "any maskable"
    },
    {
      "src": "512x512 icon URL",
      "sizes": "512x512",
      "type": "image/webp",
      "purpose": "any maskable"
    }
  ],
  "theme_color": "#14b8a6",
  "background_color": "#111827",
  "display": "standalone"
}
```

## HTML Meta Tags

Updated `index.html` with proper icon references:

```html
<!-- Favicon -->
<link rel="icon" type="image/webp" href="192x192 icon" />

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" href="512x512 icon" />
<link rel="apple-touch-icon" sizes="192x192" href="192x192 icon" />
<link rel="apple-touch-icon" sizes="512x512" href="512x512 icon" />

<!-- Social Media -->
<meta property="og:image" content="512x512 icon" />
<meta name="twitter:image" content="512x512 icon" />
```

## PWA Installation

### Android
1. Open AlaskaPay in Chrome/Edge
2. Tap the menu (⋮) → "Add to Home screen"
3. The AlaskaPay logo will appear on your home screen
4. Tap to launch as a standalone app

### iOS
1. Open AlaskaPay in Safari
2. Tap the Share button (□↑)
3. Scroll down and tap "Add to Home Screen"
4. The AlaskaPay logo will appear on your home screen
5. Tap to launch as a web app

### Desktop (Chrome/Edge)
1. Open AlaskaPay in browser
2. Look for the install icon (⊕) in the address bar
3. Click "Install" to add to desktop/taskbar
4. Launch as a standalone app

## App Shortcuts

The PWA includes quick shortcuts for:
- **Dashboard** - View your wallet and transactions
- **Pay Bills** - Quick access to bill payments
- **Admin** - Admin dashboard (for authorized users)

Long-press the app icon on Android to access these shortcuts.

## Features Enabled

✅ **Standalone Display** - Runs in its own window without browser UI
✅ **Theme Color** - Teal (#14b8a6) status bar on Android
✅ **Splash Screen** - Uses 512x512 icon for loading screen
✅ **Maskable Icons** - Adapts to different device shapes (rounded, squircle, etc.)
✅ **Offline Ready** - Service worker enables offline functionality
✅ **App Shortcuts** - Quick actions from home screen
✅ **Portrait Orientation** - Optimized for mobile use

## Testing PWA Installation

### Chrome DevTools
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Manifest" to verify icons load correctly
4. Check "Service Workers" for offline capability

### Lighthouse Audit
1. Open DevTools → Lighthouse tab
2. Select "Progressive Web App" category
3. Run audit to verify PWA compliance
4. Should score 90+ for installability

## Icon Design Specifications

- **Style**: Modern fintech design
- **Elements**: Mountain peak with payment symbol
- **Colors**: Blue and teal gradient (#14b8a6)
- **Format**: WebP (optimized for web)
- **Background**: Suitable for both light and dark themes
- **Safe Zone**: 10% padding from edges for maskable icons

## Troubleshooting

### Icon Not Showing
- Clear browser cache and reload
- Verify manifest.json is accessible at `/manifest.json`
- Check browser console for manifest errors

### Can't Install App
- Ensure HTTPS is enabled (required for PWA)
- Verify service worker is registered
- Check that manifest.json has valid JSON syntax

### Wrong Icon Appears
- Uninstall the app and reinstall
- Clear site data in browser settings
- Wait a few minutes for CDN cache to update

## Browser Support

- ✅ Chrome/Edge (Android, Desktop, iOS)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Android, Desktop)
- ✅ Samsung Internet
- ✅ Opera

## Next Steps

1. **Test Installation** - Install on multiple devices to verify icons
2. **Monitor Analytics** - Track PWA installation rates
3. **Update Icons** - Refresh icons if branding changes
4. **Add Screenshots** - Include app screenshots in manifest for better install prompts

## Resources

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Maskable.app Icon Editor](https://maskable.app/)

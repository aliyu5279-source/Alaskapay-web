# 🎨 App Icons & Splash Screens Setup

## Quick Setup (3 Steps)

```bash
# 1. Install Capacitor Assets
npm install -D @capacitor/assets

# 2. Add your source images to resources/
# - resources/icon.png (1024x1024)
# - resources/splash.png (2732x2732)

# 3. Generate all sizes
npx @capacitor/assets generate
```

## 📐 Design Requirements

### App Icon (icon.png)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Color Space**: RGB
- **Design Tips**:
  - Simple, recognizable design
  - Works well at small sizes (16x16 to 1024x1024)
  - No text (hard to read when small)
  - Use Alaska Pay brand colors (#0EA5E9)
  - Avoid fine details that disappear at small sizes
  - Test on different backgrounds (light/dark)

### Splash Screen (splash.png)
- **Size**: 2732x2732 pixels (largest iPad Pro)
- **Format**: PNG
- **Safe Area**: Center 1200x1200 pixels
- **Design Tips**:
  - Logo centered in safe area
  - Solid background color (#0EA5E9)
  - Keep it simple (users see it briefly)
  - Match app's visual identity

## 🎨 Design Templates

### Option 1: Use Alaska Pay Branding
Create icon with:
- Background: Gradient from #0EA5E9 to #0284C7
- Logo: White "AP" monogram or Alaska Pay symbol
- Style: Modern, minimal, professional

### Option 2: Design Tools
- **Figma**: Free, browser-based
- **Adobe Illustrator**: Professional vector tool
- **Sketch**: macOS design tool
- **Canva**: Easy templates

## 📦 What Gets Generated

### iOS (20+ files)
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
├── App-Icon-20x20@1x.png
├── App-Icon-20x20@2x.png
├── App-Icon-20x20@3x.png
├── App-Icon-29x29@1x.png
├── App-Icon-29x29@2x.png
├── App-Icon-29x29@3x.png
├── App-Icon-40x40@1x.png
├── App-Icon-40x40@2x.png
├── App-Icon-40x40@3x.png
├── App-Icon-60x60@2x.png
├── App-Icon-60x60@3x.png
├── App-Icon-76x76@1x.png
├── App-Icon-76x76@2x.png
├── App-Icon-83.5x83.5@2x.png
└── App-Icon-1024x1024@1x.png

ios/App/App/Assets.xcassets/Splash.imageset/
├── splash-2732x2732.png
├── splash-2732x2732-1.png
└── splash-2732x2732-2.png
```

### Android (9+ files)
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
├── mipmap-xxxhdpi/ic_launcher.png (192x192)
├── drawable/splash.png
├── drawable-land-mdpi/splash.png
├── drawable-land-hdpi/splash.png
└── ... (more splash variants)
```

## 🔧 Advanced Configuration

### Custom Colors
```bash
npx @capacitor/assets generate \
  --iconBackgroundColor '#0EA5E9' \
  --splashBackgroundColor '#0EA5E9'
```

### iOS Only
```bash
npx @capacitor/assets generate --ios
```

### Android Only
```bash
npx @capacitor/assets generate --android
```

### Custom Paths
```bash
npx @capacitor/assets generate \
  --iconPath ./custom/path/icon.png \
  --splashPath ./custom/path/splash.png
```

## ✅ Verification Checklist

### iOS
- [ ] Open Xcode: `npx cap open ios`
- [ ] Check Assets.xcassets/AppIcon.appiconset
- [ ] All icon sizes present (no missing icons warning)
- [ ] Check Assets.xcassets/Splash.imageset
- [ ] Run on simulator - icon appears on home screen
- [ ] Launch app - splash screen displays correctly

### Android
- [ ] Open Android Studio: `npx cap open android`
- [ ] Check res/mipmap-*/ic_launcher.png files
- [ ] Check res/drawable*/splash.png files
- [ ] Run on emulator - icon appears in app drawer
- [ ] Launch app - splash screen displays correctly

## 🎯 Testing on Devices

### iOS Simulator
```bash
npx cap run ios
# Check home screen for icon
# Launch app to see splash screen
```

### Android Emulator
```bash
npx cap run android
# Check app drawer for icon
# Launch app to see splash screen
```

## 🐛 Troubleshooting

### Icons Not Updating
```bash
# iOS - Clean build
cd ios/App
rm -rf Pods Podfile.lock DerivedData
pod install
cd ../..
npx cap sync ios

# Android - Clean build
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Splash Screen Not Showing
Check `capacitor.config.ts`:
```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: '#0EA5E9',
    showSpinner: false,
    splashFullScreen: true,
    splashImmersive: true
  }
}
```

### Wrong Colors
Regenerate with correct colors:
```bash
npx @capacitor/assets generate \
  --iconBackgroundColor '#YOUR_COLOR' \
  --splashBackgroundColor '#YOUR_COLOR'
```

## 📱 Platform-Specific Notes

### iOS
- App Store requires 1024x1024 icon
- No transparency in App Store icon
- Rounded corners applied automatically
- Splash screen uses storyboard (auto-generated)

### Android
- Adaptive icons supported (API 26+)
- Launcher icon can have transparency
- Different densities for different screen sizes
- Splash screen uses drawable resources

## 🎨 Design Resources

### Free Icon Tools
- [Figma](https://figma.com) - Free design tool
- [Canva](https://canva.com) - Templates available
- [IconKitchen](https://icon.kitchen) - Android icon generator

### Inspiration
- [Dribbble](https://dribbble.com/tags/app-icon) - App icon designs
- [Behance](https://behance.net) - Professional designs
- App Store - Browse popular finance apps

### Color Palette
Alaska Pay brand colors:
- Primary: `#0EA5E9` (Sky Blue)
- Dark: `#0284C7` (Blue)
- Accent: `#14B8A6` (Teal)
- Background: `#111827` (Dark Gray)

## 📚 Additional Resources

- [iOS Human Interface Guidelines - App Icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Android Icon Design Guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher)
- [Capacitor Assets Documentation](https://github.com/ionic-team/capacitor-assets)

## 🚀 Next Steps

After generating icons and splash screens:
1. ✅ Verify in Xcode and Android Studio
2. ✅ Test on simulators/emulators
3. ✅ Test on physical devices
4. ✅ Prepare store screenshots
5. ✅ Submit to TestFlight/Internal Testing

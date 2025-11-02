# App Resources

This directory contains source assets for generating app icons and splash screens.

## Required Files

Place the following files in this directory:

### icon.png
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Purpose**: App icon for iOS and Android
- **Download**: https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760031189061_c9f71b18.webp

### splash.png
- **Size**: 2732x2732 pixels (centered content in 1200x1200 safe area)
- **Format**: PNG
- **Purpose**: Splash screen for iOS and Android
- **Download**: https://d64gsuwffb70l.cloudfront.net/68e1fc3eae390c5be0b91092_1760031189863_efedac71.webp

## Generate Assets

After placing the files, run:

```bash
npm run resources
```

This will automatically generate all required sizes for:
- iOS app icons (all sizes)
- Android app icons (all densities)
- iOS splash screens (all device sizes)
- Android splash screens (all densities)

## Manual Setup

If you prefer to use custom colors or settings:

```bash
npx @capacitor/assets generate \
  --iconBackgroundColor '#0066FF' \
  --iconBackgroundColorDark '#0052CC' \
  --splashBackgroundColor '#0066FF' \
  --splashBackgroundColorDark '#0052CC'
```

## Output Locations

Generated assets will be placed in:
- `ios/App/App/Assets.xcassets/` - iOS icons and splash screens
- `android/app/src/main/res/` - Android icons and splash screens

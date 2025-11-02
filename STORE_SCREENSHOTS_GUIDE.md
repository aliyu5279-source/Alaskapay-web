# App Store Screenshot Generation Guide

## iOS Screenshot Requirements

### Sizes Required
1. **6.7" Display (iPhone 15 Pro Max)**: 1290 x 2796 px
2. **6.5" Display (iPhone 14 Plus)**: 1284 x 2778 px
3. **5.5" Display (iPhone 8 Plus)**: 1242 x 2208 px
4. **12.9" iPad Pro**: 2048 x 2732 px

### Screenshot Recommendations
- **Minimum**: 3 screenshots
- **Maximum**: 10 screenshots
- **Format**: PNG or JPEG
- **Color Space**: RGB

### Screenshot Order (Best Practices)
1. **Hero Shot**: Main dashboard/wallet view
2. **Key Feature 1**: Send money/transfer
3. **Key Feature 2**: Virtual cards
4. **Key Feature 3**: Bill payments
5. **Security**: Biometric/security features
6. **Social Proof**: Testimonials/ratings

## Android Screenshot Requirements

### Sizes Required
1. **Phone**: 1080 x 1920 px (minimum)
2. **7" Tablet**: 1200 x 1920 px
3. **10" Tablet**: 1600 x 2560 px

### Screenshot Recommendations
- **Minimum**: 2 screenshots
- **Maximum**: 8 screenshots
- **Format**: PNG or JPEG (24-bit)
- **Max Size**: 8MB per screenshot

## Automated Screenshot Generation

### iOS (Fastlane Snapshot)
```bash
cd ios/App
fastlane screenshots
```

### Android (Fastlane Screengrab)
```bash
cd android
fastlane screenshots
```

## Screenshot Design Best Practices

### 1. Add Text Overlays
- Highlight key features
- Use large, readable fonts (min 40pt)
- Keep text concise (5-7 words max)
- Use brand colors

### 2. Show Real Content
- Use realistic data (not Lorem Ipsum)
- Show successful transactions
- Display positive balances
- Include user-friendly UI

### 3. Maintain Consistency
- Same device frames across all screenshots
- Consistent status bar (full battery, signal)
- Same time (9:41 AM for iOS)
- Uniform background colors

### 4. Localization
- Create screenshots for each supported language
- Translate overlay text
- Use culturally appropriate content

## Tools for Screenshot Enhancement

### Fastlane Frameit
```bash
fastlane frameit
```
Adds device frames around screenshots

### Design Tools
- **Figma**: Create mockups with text overlays
- **Sketch**: Design screenshot templates
- **Canva**: Quick screenshot editing

## ASO Screenshot Tips

1. **First Screenshot is Critical**: 70% of users only see the first image
2. **Show Value Immediately**: Feature most important functionality first
3. **Use Captions**: Add descriptive text to explain features
4. **A/B Test**: Try different screenshot orders
5. **Update Regularly**: Refresh screenshots with new features

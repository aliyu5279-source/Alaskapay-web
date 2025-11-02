# Universal Deep Linking System - AlaskaPay

Complete deep linking implementation for seamless app-to-app navigation, web-to-app transitions, and promotional campaigns.

## 🔗 Supported Link Types

### 1. Payment Links
```
https://alaskapay.com/pay/request?amount=5000&description=Dinner
alaskapay://pay/request?amount=5000&description=Dinner
```

### 2. Referral Links
```
https://alaskapay.com/referral/JOHN2024
alaskapay://referral/JOHN2024
```

### 3. Transfer Links
```
https://alaskapay.com/transfer?to=+2348012345678&amount=1000
alaskapay://transfer?to=+2348012345678&amount=1000
```

### 4. Bill Payment Links
```
https://alaskapay.com/bills/electricity?provider=EKEDC
alaskapay://bills/electricity?provider=EKEDC
```

### 5. Virtual Card Links
```
https://alaskapay.com/cards/create
alaskapay://cards/create
```

### 6. Promotional Campaign Links
```
https://alaskapay.com/promo/SUMMER2024?discount=20
alaskapay://promo/SUMMER2024?discount=20
```

### 7. KYC Verification Links
```
https://alaskapay.com/kyc/verify
alaskapay://kyc/verify
```

### 8. Support Links
```
https://alaskapay.com/support/ticket?id=12345
alaskapay://support/ticket?id=12345
```

## 📱 iOS Universal Links Setup

### 1. Apple App Site Association File
File: `public/.well-known/apple-app-site-association`

```json
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAM_ID.com.alaskapay.app",
      "paths": [
        "/pay/*",
        "/referral/*",
        "/transfer",
        "/bills/*",
        "/cards/*",
        "/promo/*",
        "/kyc/*",
        "/support/*"
      ]
    }]
  },
  "webcredentials": {
    "apps": ["TEAM_ID.com.alaskapay.app"]
  }
}
```

### 2. iOS Entitlements Configuration
Add to `ios/App/App/App.entitlements`:

```xml
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:alaskapay.com</string>
    <string>applinks:www.alaskapay.com</string>
</array>
```

### 3. iOS Info.plist Configuration
Add to `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>alaskapay</string>
        </array>
    </dict>
</array>
```

## 🤖 Android App Links Setup

### 1. Asset Links File
File: `public/.well-known/assetlinks.json`

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.alaskapay.app",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

### 2. Get SHA256 Fingerprint
```bash
# Debug keystore
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Release keystore
keytool -list -v -keystore /path/to/release.keystore -alias your-alias
```

### 3. Android Manifest Configuration
Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    
    <data android:scheme="https" />
    <data android:scheme="http" />
    <data android:host="alaskapay.com" />
    <data android:host="www.alaskapay.com" />
    
    <data android:pathPrefix="/pay" />
    <data android:pathPrefix="/referral" />
    <data android:pathPrefix="/transfer" />
    <data android:pathPrefix="/bills" />
    <data android:pathPrefix="/cards" />
    <data android:pathPrefix="/promo" />
    <data android:pathPrefix="/kyc" />
    <data android:pathPrefix="/support" />
</intent-filter>

<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    
    <data android:scheme="alaskapay" />
</intent-filter>
```

## 🌐 Web Fallback Configuration

### 1. Netlify Redirects
File: `_redirects`

```
/pay/*    /index.html   200
/referral/*    /index.html   200
/transfer    /index.html   200
/bills/*    /index.html   200
/cards/*    /index.html   200
/promo/*    /index.html   200
/kyc/*    /index.html   200
/support/*    /index.html   200
```

### 2. Smart Banner for App Install
Add to `index.html`:

```html
<meta name="apple-itunes-app" content="app-id=YOUR_APP_ID">
<meta name="google-play-app" content="app-id=com.alaskapay.app">
```

## 📊 Deep Link Analytics

Track deep link performance:

```typescript
await deepLinkService.trackLink({
  link_id: 'payment_12345',
  user_id: 'user_123',
  device_type: 'mobile',
  app_installed: true,
  converted: true,
  timestamp: new Date().toISOString()
});
```

## 🧪 Testing Deep Links

### iOS Simulator
```bash
xcrun simctl openurl booted "alaskapay://pay/request?amount=1000"
xcrun simctl openurl booted "https://alaskapay.com/referral/TEST123"
```

### Android Emulator
```bash
adb shell am start -W -a android.intent.action.VIEW -d "alaskapay://pay/request?amount=1000"
adb shell am start -W -a android.intent.action.VIEW -d "https://alaskapay.com/referral/TEST123"
```

### Web Testing
```javascript
// Test in browser console
window.location.href = 'https://alaskapay.com/pay/request?amount=5000';
```

## 🔒 Security Best Practices

1. **Validate All Parameters**: Always validate and sanitize deep link parameters
2. **Require Authentication**: Sensitive actions should require user authentication
3. **Rate Limiting**: Implement rate limiting for payment and transfer links
4. **Expiring Links**: Add expiration timestamps to time-sensitive links
5. **HTTPS Only**: Always use HTTPS for universal links

## 📱 Usage in Components

### Generate Payment Link
```typescript
import { PaymentLinkGenerator } from '@/components/deeplink/PaymentLinkGenerator';

<PaymentLinkGenerator />
```

### Generate Referral Link
```typescript
import { ReferralLinkGenerator } from '@/components/deeplink/ReferralLinkGenerator';

<ReferralLinkGenerator />
```

### Handle Incoming Links
```typescript
import { DeepLinkHandler } from '@/components/deeplink/DeepLinkHandler';

// Add to App.tsx
<DeepLinkHandler />
```

## 🚀 Deployment Checklist

- [ ] Upload apple-app-site-association to domain root
- [ ] Upload assetlinks.json to domain root
- [ ] Configure iOS entitlements with Team ID
- [ ] Add SHA256 fingerprints to assetlinks.json
- [ ] Test universal links on physical devices
- [ ] Set up analytics tracking
- [ ] Configure smart banners
- [ ] Test fallback URLs
- [ ] Verify HTTPS certificates
- [ ] Test all link types

## 📈 Marketing Use Cases

1. **SMS Campaigns**: Send payment request links via SMS
2. **Email Marketing**: Include referral links in newsletters
3. **Social Media**: Share promotional campaign links
4. **QR Codes**: Generate QR codes for payment links
5. **Push Notifications**: Deep link to specific features
6. **Influencer Marketing**: Track referral performance

## 🛠️ Troubleshooting

### iOS Links Not Working
- Verify Team ID in apple-app-site-association
- Check entitlements configuration
- Ensure HTTPS is properly configured
- Test on physical device (not simulator)

### Android Links Not Working
- Verify SHA256 fingerprint matches
- Check autoVerify="true" in manifest
- Test with `adb shell dumpsys package domain-preferred-apps`
- Ensure assetlinks.json is accessible

### Web Fallback Issues
- Check _redirects configuration
- Verify routing in React app
- Test with different browsers
- Check console for errors

## 📞 Support

For deep linking issues, contact: support@alaskapay.com

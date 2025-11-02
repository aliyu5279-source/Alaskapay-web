# Crash Reporting & Monitoring Setup

## Overview
Alaska Pay uses Firebase Crashlytics for real-time crash reporting and monitoring across iOS, Android, and web platforms.

## Features Implemented
- ✅ Real-time crash reporting
- ✅ Error boundaries for React components
- ✅ Global error handlers
- ✅ User context tracking
- ✅ Breadcrumb logging
- ✅ Source map support
- ✅ Alert notifications for critical errors

## Installation

### 1. Install Dependencies

```bash
# Install Firebase Crashlytics for Capacitor
npm install @capacitor-firebase/crashlytics

# iOS specific
npx cap sync ios
cd ios/App
pod install
cd ../..

# Android specific
npx cap sync android
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Add iOS and Android apps
4. Download configuration files:
   - iOS: `GoogleService-Info.plist`
   - Android: `google-services.json`

#### iOS Configuration
```bash
# Place GoogleService-Info.plist in ios/App/App/
cp GoogleService-Info.plist ios/App/App/

# Update ios/App/App/Info.plist
# Add Crashlytics run script in Xcode build phases
```

#### Android Configuration
```bash
# Place google-services.json in android/app/
cp google-services.json android/app/

# Update android/build.gradle
# Add: classpath 'com.google.gms:google-services:4.4.0'
# Add: classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'

# Update android/app/build.gradle
# Add: apply plugin: 'com.google.gms.google-services'
# Add: apply plugin: 'com.google.firebase.crashlytics'
```

### 3. Enable Crashlytics in Firebase Console
1. Navigate to Crashlytics in Firebase Console
2. Click "Enable Crashlytics"
3. Follow setup wizard

## Usage

### Basic Error Logging
```typescript
import { crashReporting } from '@/lib/crashReporting';

try {
  // Your code
} catch (error) {
  crashReporting.logError(error as Error, {
    screen: 'PaymentScreen',
    action: 'process_payment',
    amount: 100,
  });
}
```

### Using the Hook
```typescript
import { useCrashReporting } from '@/hooks/useCrashReporting';

function MyComponent() {
  const { logError, logMessage, recordBreadcrumb } = useCrashReporting();

  const handlePayment = async () => {
    recordBreadcrumb('Payment initiated', { amount: 100 });
    
    try {
      await processPayment();
      logMessage('Payment successful', 'info');
    } catch (error) {
      logError(error as Error, { action: 'payment_failed' });
    }
  };

  return <button onClick={handlePayment}>Pay</button>;
}
```

### Error Boundaries
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### Custom Fallback UI
```typescript
<ErrorBoundary
  fallback={<CustomErrorScreen />}
  onError={(error, errorInfo) => {
    // Custom error handling
    console.log('Error caught:', error);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## Source Maps Configuration

### Vite Configuration
Update `vite.config.ts`:
```typescript
export default defineConfig({
  build: {
    sourcemap: true, // Enable source maps
  },
});
```

### Upload Source Maps to Firebase
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Upload source maps after build
firebase crashlytics:symbols:upload \
  --app=YOUR_APP_ID \
  dist/assets/*.js.map
```

## Alert Notifications

### Email Alerts
1. Go to Firebase Console → Crashlytics
2. Click Settings (gear icon)
3. Add email addresses for alerts
4. Configure alert thresholds

### Slack Integration
```bash
# Install Firebase Slack app
# Go to Firebase Console → Integrations → Slack
# Connect your Slack workspace
# Select channels for alerts
```

### Custom Webhooks
```typescript
// In src/lib/crashReporting.ts
private async sendToBackend(errorData: any): Promise<void> {
  try {
    // Send to Slack webhook
    await fetch('YOUR_SLACK_WEBHOOK_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 Critical Error: ${errorData.message}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Error:* ${errorData.message}\n*User:* ${errorData.user.userId}\n*Platform:* ${errorData.platform}`,
            },
          },
        ],
      }),
    });
  } catch (err) {
    console.error('Failed to send alert:', err);
  }
}
```

## Testing

### Test Crash Reporting
```typescript
// Add a test button in development
<button onClick={() => {
  throw new Error('Test crash');
}}>
  Test Crash
</button>

// Test async error
<button onClick={async () => {
  await Promise.reject(new Error('Test async error'));
}}>
  Test Async Error
</button>
```

### Verify in Firebase Console
1. Trigger test crash
2. Wait 5-10 minutes
3. Check Firebase Console → Crashlytics
4. Verify crash appears in dashboard

## Best Practices

### 1. Add Context to Errors
```typescript
crashReporting.logError(error, {
  userId: user.id,
  screen: 'WalletScreen',
  action: 'withdraw_funds',
  amount: withdrawAmount,
  balance: currentBalance,
});
```

### 2. Use Breadcrumbs
```typescript
// Track user journey
recordBreadcrumb('User opened wallet');
recordBreadcrumb('User clicked withdraw button');
recordBreadcrumb('Amount entered: 100');
// Error occurs here - breadcrumbs help debug
```

### 3. Log Non-Fatal Errors
```typescript
// Log warnings that don't crash the app
crashReporting.logMessage('API rate limit approaching', 'warning');
```

### 4. Set User Identifiers
```typescript
// Automatically done via useCrashReporting hook
// Or manually:
crashReporting.setUser(user.id, user.email);
```

### 5. Clear User Data on Logout
```typescript
// Automatically done via useCrashReporting hook
// Or manually:
crashReporting.clearUser();
```

## Monitoring Dashboard

### Key Metrics to Track
- Crash-free users percentage
- Most common crashes
- Crashes by app version
- Crashes by device/OS
- Time to crash after app open

### Setting Up Alerts
1. **Critical Errors**: Alert immediately
   - Payment failures
   - Authentication errors
   - Data loss errors

2. **High Priority**: Alert within 1 hour
   - API failures
   - Network errors
   - UI crashes

3. **Medium Priority**: Daily digest
   - Minor UI glitches
   - Non-critical warnings

## Phase 1 Testing Checklist

- [ ] Firebase project created and configured
- [ ] iOS app added to Firebase with GoogleService-Info.plist
- [ ] Android app added to Firebase with google-services.json
- [ ] Crashlytics enabled in Firebase Console
- [ ] Test crash triggered and verified in dashboard
- [ ] Source maps uploaded and working
- [ ] Email alerts configured
- [ ] Slack integration set up (optional)
- [ ] Error boundaries tested
- [ ] User context tracking verified
- [ ] Breadcrumbs logging tested
- [ ] Global error handlers working
- [ ] Unhandled promise rejections caught

## Troubleshooting

### Crashes Not Appearing
- Wait 5-10 minutes for first crash to appear
- Check Firebase Console → Crashlytics → Enable Crashlytics
- Verify google-services.json / GoogleService-Info.plist are correct
- Check build logs for Crashlytics initialization

### Source Maps Not Working
- Ensure `sourcemap: true` in vite.config.ts
- Upload source maps after each build
- Verify app version matches uploaded maps

### iOS Build Errors
- Run `pod install` in ios/App directory
- Clean build folder in Xcode
- Verify GoogleService-Info.plist is in correct location

### Android Build Errors
- Sync Gradle files
- Check google-services.json location
- Verify Crashlytics plugin in build.gradle

## Resources
- [Firebase Crashlytics Docs](https://firebase.google.com/docs/crashlytics)
- [Capacitor Firebase Plugin](https://github.com/capawesome-team/capacitor-firebase)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

## Support
For issues or questions, contact the development team or check the Firebase Console for detailed crash reports.

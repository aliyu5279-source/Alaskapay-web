# Biometric Authentication System

## Overview
Alaska Pay now supports biometric authentication (Face ID/Touch ID for iOS, fingerprint for Android) using Capacitor's Native Biometric plugin.

## Features Implemented

### 1. Biometric Login
- Users can log in using Face ID, Touch ID, or fingerprint
- Credentials are securely stored in the device's keychain/keystore
- Biometric login button appears on login screen when available

### 2. High-Value Transaction Authentication
- Transactions over $500 require biometric or PIN confirmation
- Configurable per user in settings
- Automatic prompt before processing payment

### 3. PIN Fallback
- 4-digit PIN as backup authentication method
- Used when biometrics fail or unavailable
- Securely stored in database

### 4. User Settings
- Toggle biometric login on/off
- Enable/disable transaction authentication
- Set up PIN fallback
- Available in User Profile > Security tab

## Installation

### Install Capacitor Plugin
```bash
npm install capacitor-native-biometric
npx cap sync
```

### iOS Setup
Permissions are already configured in `ios/App/App/Info.plist`:
- NSFaceIDUsageDescription: "Use Face ID to authenticate"

### Android Setup
Permissions are already configured in `android/app/src/main/AndroidManifest.xml`:
- USE_BIOMETRIC
- USE_FINGERPRINT

## Database Schema
Added to `profiles` table:
- `biometric_enabled` (boolean): Whether biometric login is enabled
- `transaction_auth_enabled` (boolean): Require auth for high-value transactions
- `has_pin` (boolean): Whether user has set up PIN
- `pin_hash` (text): Hashed PIN for fallback authentication

## Components

### useBiometricAuth Hook
Location: `src/hooks/useBiometricAuth.ts`
- Check biometric availability
- Authenticate user
- Save/retrieve/delete credentials

### BiometricSettings Component
Location: `src/components/BiometricSettings.tsx`
- Toggle biometric login
- Toggle transaction authentication
- Set up PIN fallback

### BiometricConfirmation Component
Location: `src/components/bill/BiometricConfirmation.tsx`
- Modal for high-value transaction confirmation
- Biometric or PIN authentication
- Used in PayBillModal

## Usage

### In Login Form
```typescript
import { useBiometricAuth } from '@/hooks/useBiometricAuth';

const { isAvailable, authenticate, getCredentials } = useBiometricAuth();

// Show biometric button if available
{isAvailable && (
  <Button onClick={handleBiometricLogin}>
    <Fingerprint /> Login with Biometrics
  </Button>
)}
```

### In Payment Flow
```typescript
// Check if transaction requires authentication
const totalAmount = parseFloat(amount) + fee;
if (transactionAuthEnabled && totalAmount > 500) {
  setShowBiometric(true);
  return;
}

// Show BiometricConfirmation modal
<BiometricConfirmation
  open={showBiometric}
  onClose={() => setShowBiometric(false)}
  onConfirm={processPayment}
  amount={total}
/>
```

## Security Notes

1. Credentials are stored in native secure storage (Keychain/Keystore)
2. PIN is hashed before storage (use bcrypt in production)
3. Biometric authentication uses device's secure enclave
4. Transaction authentication threshold ($500) is configurable
5. Failed authentication attempts are logged

## Testing

### Web Browser
Biometric features are disabled in web browsers. The app will show "Not available on this device".

### iOS Simulator
Face ID can be tested in simulator:
1. Features > Face ID > Enrolled
2. Features > Face ID > Matching Face (to simulate success)

### Android Emulator
Fingerprint can be tested:
1. Settings > Security > Fingerprint
2. Use adb command to simulate: `adb -e emu finger touch 1`

## Configuration

Edit `capacitor.config.ts` to customize:
```typescript
NativeBiometric: {
  useFallback: true,
  fallbackTitle: 'Use PIN',
  fallbackMessage: 'Enter your PIN to authenticate'
}
```

## Future Enhancements
- Biometric re-authentication timeout
- Multiple biometric methods support
- Biometric authentication for app unlock
- Admin controls for authentication requirements

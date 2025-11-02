# Native Biometric Authentication System

## Overview
Alaska Pay now includes comprehensive native biometric authentication support for mobile and desktop platforms with fallback mechanisms, secure storage, and seamless MFA integration.

## Features

### Supported Biometric Methods
- **iOS**: Face ID, Touch ID
- **Android**: Fingerprint, Face Recognition, Iris Scanning
- **macOS**: Touch ID
- **Windows**: Windows Hello
- **Web**: WebAuthn/FIDO2

### Security Features
- Secure enclave storage for credentials
- Hardware-backed key storage
- Biometric template protection
- Anti-spoofing measures
- Device binding

### Fallback Mechanisms
- 4-digit PIN authentication
- Password authentication
- SMS verification (if enabled)
- Backup codes

## Database Schema

### Tables Created
1. **biometric_devices** - Registered biometric devices
2. **biometric_auth_logs** - Authentication attempt logs
3. **user_pins** - Secure PIN storage with hashing

## Components

### BiometricAuthModal
Modal component for biometric authentication with PIN fallback.

```tsx
import { BiometricAuthModal } from '@/components/biometric/BiometricAuthModal';

<BiometricAuthModal
  open={showAuth}
  onClose={() => setShowAuth(false)}
  onSuccess={handleAuthSuccess}
  reason="Confirm transaction"
  allowPinFallback={true}
/>
```

### DeviceManagement
Component for viewing and managing registered biometric devices.

```tsx
import { DeviceManagement } from '@/components/biometric/DeviceManagement';

<DeviceManagement />
```

### BiometricSettings
Comprehensive settings page with tabbed interface for biometric configuration.

```tsx
import { BiometricSettings } from '@/components/BiometricSettings';

<BiometricSettings />
```

## Hooks

### useBiometricAuth
Hook for biometric authentication operations.

```tsx
import { useBiometricAuth } from '@/hooks/useBiometricAuth';

const {
  isAvailable,
  biometryType,
  authenticate,
  saveCredentials,
  getCredentials,
  deleteCredentials,
  registerDevice,
  getDevices,
  revokeDevice,
} = useBiometricAuth();

// Check availability
if (isAvailable) {
  console.log('Biometric type:', biometryType);
}

// Authenticate
const success = await authenticate('Verify your identity');

// Save credentials securely
await saveCredentials(username, password);

// Get saved credentials
const creds = await getCredentials();

// Register current device
await registerDevice();

// Get all registered devices
const devices = await getDevices();

// Revoke device access
await revokeDevice(deviceId);
```

## Service Layer

### BiometricService
Core service for biometric operations.

```typescript
import { BiometricService } from '@/services/biometricService';

// Check availability
const { available, biometryType } = await BiometricService.isAvailable();

// Authenticate
const success = await BiometricService.authenticate('Verify identity');

// Register device
const device = await BiometricService.registerDevice(userId);

// Log authentication attempt
await BiometricService.logAuthAttempt(
  userId,
  deviceId,
  'login',
  true
);

// Get user devices
const devices = await BiometricService.getDevices(userId);

// Revoke device
await BiometricService.revokeDevice(deviceId, userId);
```

## Integration with MFA

Biometric authentication seamlessly integrates with the existing MFA system:

1. **Risk-Based Authentication**: High-risk actions trigger biometric verification
2. **Step-Up Authentication**: Sensitive operations require biometric confirmation
3. **Transaction Signing**: Large transactions require biometric approval
4. **MFA Enrollment**: Biometrics can be used during MFA setup

## Usage Examples

### Login with Biometrics

```tsx
const handleBiometricLogin = async () => {
  const { isAvailable } = await BiometricService.isAvailable();
  
  if (!isAvailable) {
    // Fall back to password
    return;
  }

  const success = await BiometricService.authenticate('Log in to Alaska Pay');
  
  if (success) {
    const credentials = await BiometricService.getCredentials();
    if (credentials) {
      await signIn(credentials.username, credentials.password);
    }
  }
};
```

### Transaction Authorization

```tsx
const handleTransactionAuth = async (amount: number) => {
  // Check if biometric auth is required
  const requiresBiometric = amount > 500;
  
  if (requiresBiometric) {
    const success = await authenticate(
      `Authorize transaction of $${amount}`
    );
    
    if (!success) {
      throw new Error('Authentication failed');
    }
  }
  
  // Proceed with transaction
  await processTransaction();
};
```

### Enable Biometric Login

```tsx
const enableBiometricLogin = async () => {
  // First authenticate to confirm identity
  const authenticated = await authenticate('Enable biometric login');
  
  if (!authenticated) return;
  
  // Save credentials securely
  await saveCredentials(user.email, userPassword);
  
  // Register device
  await registerDevice();
  
  // Update profile
  await supabase
    .from('profiles')
    .update({ biometric_enabled: true })
    .eq('id', user.id);
};
```

### Set PIN Fallback

```tsx
const setPINFallback = async (pin: string) => {
  // Validate PIN
  if (pin.length !== 4 || !/^\d+$/.test(pin)) {
    throw new Error('PIN must be 4 digits');
  }
  
  // Hash PIN before storing
  const salt = crypto.randomBytes(16).toString('hex');
  const pinHash = await hashPIN(pin, salt);
  
  // Store in database
  await supabase.from('user_pins').upsert({
    user_id: user.id,
    pin_hash: pinHash,
    salt,
  });
  
  // Store locally for quick access
  localStorage.setItem('userPin', pin);
};
```

## Platform-Specific Configuration

### iOS (Capacitor)
```json
{
  "plugins": {
    "NativeBiometric": {
      "biometryType": "faceId",
      "fallbackTitle": "Use PIN",
      "disableBackup": false
    }
  }
}
```

### Android (Capacitor)
```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
```

## Security Best Practices

1. **Never Store Raw Biometric Data**: Only use system APIs
2. **Implement Rate Limiting**: Prevent brute force attacks on PIN
3. **Use Secure Storage**: Leverage platform secure enclaves
4. **Log All Attempts**: Track authentication for security auditing
5. **Implement Lockout**: Lock account after failed attempts
6. **Require Re-authentication**: For sensitive operations
7. **Support Device Revocation**: Allow users to remove devices
8. **Encrypt Stored Credentials**: Even in secure storage

## Error Handling

```typescript
try {
  const success = await authenticate('Verify identity');
  if (!success) {
    // User cancelled or authentication failed
    showPINFallback();
  }
} catch (error) {
  if (error.code === 'BIOMETRIC_LOCKED_OUT') {
    // Too many failed attempts
    showLockedOutMessage();
  } else if (error.code === 'BIOMETRIC_NOT_ENROLLED') {
    // No biometrics enrolled
    promptEnrollment();
  }
}
```

## Testing

### Unit Tests
```bash
npm test -- biometricService.test.ts
```

### Integration Tests
```bash
npm test -- biometric-auth.test.ts
```

### Manual Testing Checklist
- [ ] Biometric authentication on iOS
- [ ] Biometric authentication on Android
- [ ] PIN fallback works correctly
- [ ] Device registration and revocation
- [ ] Authentication logging
- [ ] Rate limiting on PIN attempts
- [ ] Secure credential storage
- [ ] WebAuthn on desktop browsers

## Troubleshooting

### Biometrics Not Available
- Ensure device has biometric hardware
- Check system settings for enrolled biometrics
- Verify app permissions

### Authentication Fails
- Check biometric enrollment
- Verify device is not locked out
- Test PIN fallback

### Credentials Not Saved
- Verify secure storage permissions
- Check platform-specific requirements
- Test on physical device (not simulator)

## Future Enhancements

1. **Behavioral Biometrics**: Typing patterns, swipe gestures
2. **Continuous Authentication**: Background identity verification
3. **Multi-Modal Biometrics**: Combine multiple methods
4. **Liveness Detection**: Prevent spoofing attacks
5. **Biometric Consent Management**: Granular permissions
6. **Cross-Device Sync**: Trusted device network

## Support

For issues or questions:
- Check documentation: `/docs/biometric-auth`
- Contact support: support@alaskapay.com
- GitHub Issues: [Report Bug](https://github.com/alaskapay/issues)

# Advanced Multi-Factor Authentication System

## Overview
Alaska Pay now features a comprehensive MFA system with multiple authentication methods, trusted device management, and risk-based authentication.

## Features

### 1. TOTP/HOTP Support
- **Authenticator Apps**: Google Authenticator, Authy, 1Password, Microsoft Authenticator
- **QR Code Generation**: Easy setup with QR code scanning
- **Manual Entry**: Fallback option for manual secret key entry
- **6-digit codes**: Standard TOTP with 30-second validity window

### 2. Hardware Security Keys (WebAuthn/FIDO2)
- **YubiKey Support**: Full support for YubiKey devices
- **Platform Authenticators**: Touch ID, Face ID, Windows Hello
- **USB Security Keys**: Any FIDO2-compliant USB security key
- **Highest Security**: Phishing-resistant authentication

### 3. SMS Fallback
- **International Support**: Works with any phone number
- **Backup Method**: Available when primary methods are unavailable
- **6-digit codes**: Sent via SMS with 10-minute expiration

### 4. Backup Codes
- **10 Single-Use Codes**: Each code works only once
- **Download/Copy**: Save codes securely
- **Emergency Access**: Use when all other methods fail

### 5. Trusted Device Management
- **Device Fingerprinting**: Unique identification for each device
- **30-Day Trust**: Skip MFA on trusted devices for 30 days
- **Remote Revocation**: Revoke trust from any device remotely
- **Activity Tracking**: See when each device was last used

### 6. Risk-Based Authentication
- **Dynamic MFA Requirements**: MFA triggered based on risk level
- **Risk Factors**:
  - Unrecognized device
  - New location
  - Recent failed login attempts
  - Unusual activity patterns
- **Risk Scores**: 0-100 scale with automatic thresholds

## Database Schema

### mfa_methods
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- method_type: TEXT (totp, webauthn, sms, backup_codes)
- method_name: TEXT
- is_primary: BOOLEAN
- is_enabled: BOOLEAN
- credential_id: TEXT (for WebAuthn)
- public_key: TEXT (for WebAuthn)
- totp_secret: TEXT (for TOTP)
- phone_number: TEXT (for SMS)
- last_used_at: TIMESTAMPTZ
```

### trusted_devices
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key)
- device_name: TEXT
- device_fingerprint: TEXT (unique identifier)
- is_trusted: BOOLEAN
- trust_expires_at: TIMESTAMPTZ
- last_used_at: TIMESTAMPTZ
```

### mfa_backup_codes
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key)
- code_hash: TEXT (SHA-256 hash)
- is_used: BOOLEAN
- used_at: TIMESTAMPTZ
```

### mfa_authentication_logs
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key)
- method_type: TEXT
- success: BOOLEAN
- risk_score: INTEGER
- ip_address: INET
- device_fingerprint: TEXT
```

## Usage

### Setting Up MFA

```typescript
import { MFASetupWizard } from '@/components/mfa/MFASetupWizard';

function MyComponent() {
  return (
    <MFASetupWizard
      open={showWizard}
      onClose={() => setShowWizard(false)}
      onComplete={() => console.log('MFA setup complete')}
    />
  );
}
```

### Managing MFA Methods

```typescript
import { MFAManagement } from '@/components/mfa/MFAManagement';

function SecuritySettings() {
  return <MFAManagement />;
}
```

### Risk-Based Authentication

```typescript
import { useRiskBasedAuth } from '@/hooks/useRiskBasedAuth';

function LoginPage() {
  const { riskAssessment } = useRiskBasedAuth();
  
  if (riskAssessment?.requiresMFA) {
    // Show MFA challenge
  }
}
```

## Security Best Practices

1. **Multiple Methods**: Encourage users to set up at least 2 methods
2. **Backup Codes**: Always generate backup codes after first MFA setup
3. **Regular Review**: Users should review trusted devices monthly
4. **Primary Method**: Set most secure method (WebAuthn) as primary
5. **SMS as Backup**: Only use SMS as a fallback, not primary method

## Components

- `MFASetupWizard`: Main setup wizard with tabs for all methods
- `TOTPSetup`: QR code generation and verification
- `WebAuthnSetup`: Hardware security key registration
- `SMSSetup`: Phone number configuration
- `BackupCodesSetup`: Generate and download backup codes
- `MFAManagement`: Dashboard for managing all methods and devices

## API Methods

### mfaService

```typescript
// TOTP
setupTOTP(methodName?: string)
verifyTOTP(methodId: string, token: string)

// WebAuthn
registerWebAuthn(methodName: string)

// SMS
setupSMS(phoneNumber: string)

// Backup Codes
generateBackupCodes()

// Methods Management
getMethods()
deleteMethod(methodId: string)

// Trusted Devices
getTrustedDevices()
trustDevice(deviceName: string, trustDays?: number)
revokeDevice(deviceId: string)

// Risk Assessment
calculateRiskScore()
getDeviceFingerprint()
```

## Testing

Test all MFA methods:
1. TOTP with Google Authenticator
2. WebAuthn with YubiKey or platform authenticator
3. SMS with real phone number
4. Backup codes download and usage
5. Device trust and revocation
6. Risk-based triggers

## Future Enhancements

- Biometric authentication (fingerprint, face recognition)
- Push notifications for authentication
- Geolocation-based risk assessment
- Machine learning for anomaly detection
- Time-based access restrictions
- IP whitelisting/blacklisting

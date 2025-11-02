# Two-Factor Authentication (2FA) Setup Guide

## Overview
Alaska Pay now includes Two-Factor Authentication (2FA) using TOTP (Time-based One-Time Password) for enhanced account security.

## Features
- ✅ TOTP-based 2FA using authenticator apps
- ✅ QR code generation for easy setup
- ✅ 10 backup codes for account recovery
- ✅ Seamless integration with login flow
- ✅ User-friendly settings interface

## How It Works

### For Users

#### Enabling 2FA
1. Log in to your Alaska Pay account
2. Navigate to Profile → Security tab
3. Click "Enable 2FA"
4. Scan the QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
5. Save the backup codes in a secure location
6. Enter the 6-digit code from your app to verify
7. 2FA is now enabled!

#### Logging In with 2FA
1. Enter your email and password as usual
2. You'll be prompted for a 6-digit code
3. Open your authenticator app and enter the current code
4. If you don't have access to your app, click "Use backup code" and enter one of your saved backup codes

#### Disabling 2FA
1. Go to Profile → Security tab
2. Click "Disable 2FA"
3. Your account will return to password-only authentication

### For Developers

#### Database Schema
```sql
CREATE TABLE two_factor_auth (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  enabled BOOLEAN DEFAULT false,
  secret TEXT,
  backup_codes TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Edge Functions
- **setup-2fa**: Generates TOTP secret, backup codes, and otpauth URL
- **verify-2fa-code**: Verifies TOTP codes and backup codes

#### Components
- **TwoFactorSettings**: Settings interface for enabling/disabling 2FA
- **TwoFactorVerification**: Login verification prompt for 2FA codes

## Security Features

### TOTP Implementation
- 30-second time window
- 6-digit codes
- Clock skew tolerance (±1 time step)
- Base32-encoded secrets

### Backup Codes
- 10 unique 8-character codes generated per user
- One-time use (removed after successful authentication)
- Stored securely in the database
- Can be regenerated if lost (by disabling and re-enabling 2FA)

### Best Practices
1. Always save backup codes in a secure location
2. Use a reputable authenticator app
3. Enable 2FA on all important accounts
4. Don't share your secret key or QR code
5. Keep your authenticator app device secure

## Supported Authenticator Apps
- Google Authenticator (iOS/Android)
- Microsoft Authenticator (iOS/Android)
- Authy (iOS/Android/Desktop)
- 1Password (with TOTP support)
- LastPass Authenticator
- Any TOTP-compatible app

## Troubleshooting

### Code Not Working
- Ensure your device's time is synchronized
- Check that you're entering the current code (they expire every 30 seconds)
- Try the backup code option if authenticator is unavailable

### Lost Access to Authenticator
- Use one of your backup codes to log in
- Disable and re-enable 2FA to generate new codes
- Contact support if you've lost both authenticator and backup codes

### QR Code Not Scanning
- Increase screen brightness
- Try manual entry using the secret key
- Ensure your authenticator app is up to date

## Technical Details

### TOTP Algorithm
- Algorithm: HMAC-SHA1
- Time Step: 30 seconds
- Code Length: 6 digits
- Secret Length: 32 characters (Base32)

### Security Considerations
- Secrets are stored encrypted in the database
- Backup codes are hashed before storage
- 2FA verification happens server-side via edge functions
- Failed attempts are logged for security monitoring

## Future Enhancements
- SMS-based 2FA as alternative
- Hardware security key support (WebAuthn)
- Trusted device management
- 2FA recovery via email
- Admin-enforced 2FA for all users

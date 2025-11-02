# Two-Factor Authentication Security Alerts

## Overview
Alaska Pay automatically sends security alert emails whenever users enable, disable, or modify their two-factor authentication settings.

## Features Implemented

### 1. 2FA Enabled Alert
- Sent when user successfully enables 2FA
- Includes device information, IP address, location, and timestamp
- Confirms enhanced account security

### 2. 2FA Disabled Alert
- Sent when user disables 2FA
- Warns about reduced account security
- Includes device information, IP address, location, and timestamp

### 3. Backup Codes Regenerated Alert
- Sent when user regenerates backup codes
- Reminds user to save codes securely
- Includes device information, IP address, location, and timestamp

## Email Template
All alerts include:
- Action performed (enabled/disabled/backup codes regenerated)
- Device information
- IP address
- Geographic location
- Timestamp
- Warning if unauthorized access suspected

## Testing
1. Navigate to Profile → Security → Two-Factor Authentication
2. Enable 2FA - check email for alert
3. Regenerate backup codes - check email for alert
4. Disable 2FA - check email for alert

## Security Benefits
- Users immediately notified of 2FA changes
- Helps detect unauthorized account access
- Provides audit trail of security modifications
- Encourages users to keep 2FA enabled

# Password Change Security Alerts

## Overview
Alaska Pay automatically sends security alert emails when users change their passwords, including detailed device, IP address, location, and timestamp information.

## Features
- **Automatic Email Alerts**: Sent immediately after password change
- **IP Address Tracking**: Captures the IP address of the device
- **Device Information**: Includes browser and OS details
- **Location Tracking**: Approximate geographic location
- **Timestamp**: Exact time of password change

## Implementation

### 1. Change Password Component
Located in `src/components/ChangePasswordForm.tsx`
- Validates new password (minimum 6 characters)
- Confirms password match
- Updates password via Supabase Auth
- Automatically triggers security alert with metadata

### 2. Email Template
Added to `src/lib/emailTemplates.ts` and `supabase/functions/send-security-alert/index.ts`
- Professional green-themed success design
- Displays device, IP, location, and timestamp
- Warning message if unauthorized
- Link to review account security

### 3. User Profile Integration
Password change form added to Security tab in User Profile (`src/components/auth/UserProfile.tsx`)

## Usage

### For Users
1. Navigate to Profile → Security tab
2. Enter new password and confirm
3. Click "Change Password"
4. Receive instant security alert email with details

### Testing
```javascript
// User changes password
await supabase.auth.updateUser({ password: 'newpassword123' });

// Alert automatically sent with:
// - Device: "Chrome 120.0 on Windows 10"
// - IP: "192.168.1.100"
// - Location: "New York, US"
// - Timestamp: "2025-10-05 08:00:00"
```

## Security Benefits
- Users immediately notified of password changes
- Unauthorized changes detected quickly
- Complete audit trail with IP and device info
- Helps prevent account takeover attacks

## Email Alert Details
**Subject**: 🔒 Password Changed Successfully

**Contains**:
- Device information (browser/OS)
- IP address
- Geographic location
- Exact timestamp
- Warning if unauthorized
- Link to account security settings

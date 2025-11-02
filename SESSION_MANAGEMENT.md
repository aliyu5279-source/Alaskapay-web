# Session Management Guide

Alaska Pay includes comprehensive session management features that allow users to track and control all active sessions across different devices.

## Features

### 1. Active Session Viewing
- View all active sessions with detailed information
- Device type detection (Desktop, Mobile, Tablet)
- Browser and operating system identification
- IP address and approximate location
- Last active timestamp
- Session creation date

### 2. Device Tracking
Sessions automatically track:
- **Browser**: Chrome, Firefox, Safari, etc.
- **Operating System**: Windows, macOS, Linux, Android, iOS
- **Device Type**: Automatically detected from user agent
- **Location**: Approximate location based on IP address

### 3. Remote Logout
- Revoke any session remotely from the Sessions tab
- Current session is protected (cannot be revoked)
- Instant session termination
- Security notifications on revocation

### 4. Session Timeout Settings
Users can configure:
- **Automatic Logout**: 15 min, 30 min, 1h, 2h, 4h, 8h, 24h
- **Remember Device**: Stay logged in on trusted devices
- Per-user customizable settings

## How It Works

### Session Creation
When a user logs in:
1. Supabase authentication creates an auth session
2. Session tracking edge function is called
3. Device info, location, and metadata are stored
4. Session token is saved in localStorage

### Session Updates
- Sessions update their `last_active_at` timestamp on activity
- Automatic cleanup of expired sessions
- Real-time session status monitoring

### Session Revocation
When revoking a session:
1. User clicks "Revoke" on any non-current session
2. Edge function marks session as inactive
3. User is logged out on that device
4. Session removed from active list

## Database Schema

### sessions table
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- session_token: TEXT (unique)
- device_info: JSONB (browser, os)
- ip_address: TEXT
- location: TEXT
- user_agent: TEXT
- last_active_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- expires_at: TIMESTAMPTZ
- is_active: BOOLEAN
```

### session_settings table
```sql
- user_id: UUID (primary key)
- timeout_minutes: INTEGER
- remember_device: BOOLEAN
- updated_at: TIMESTAMPTZ
```

## Edge Functions

### create-session
Creates a new session record when user logs in.
- Parses user agent for device info
- Fetches location from IP address
- Stores session metadata

### manage-sessions
Handles session operations:
- **list**: Get all active sessions for a user
- **revoke**: Deactivate a specific session
- **update**: Update last_active_at timestamp

## Usage

### Accessing Session Management
1. Log in to your account
2. Navigate to Profile (top right menu)
3. Click on the "Sessions" tab
4. View all active sessions

### Revoking a Session
1. In the Sessions tab, find the session to revoke
2. Click the "Revoke" button
3. Confirm the action
4. The session will be immediately terminated

### Configuring Timeout
1. In the Sessions tab, scroll to "Session Timeout"
2. Select your preferred timeout duration
3. Toggle "Remember this device" if desired
4. Click "Save Settings"

## Security Best Practices

1. **Regular Review**: Check active sessions regularly
2. **Revoke Unknown Sessions**: If you see unfamiliar devices, revoke immediately
3. **Use Timeout**: Set appropriate timeout for your security needs
4. **Monitor Location**: Verify session locations match your activity
5. **Combine with 2FA**: Use two-factor authentication for extra security

## Troubleshooting

### Sessions Not Appearing
- Ensure you're logged in
- Check browser console for errors
- Verify edge functions are deployed

### Cannot Revoke Current Session
- This is by design for security
- Log out normally to end current session

### Location Shows "Unknown"
- IP geolocation may fail for some IPs
- VPN/proxy users may see generic locations
- This doesn't affect functionality

## Technical Notes

- Sessions use Supabase auth tokens for tracking
- Row Level Security (RLS) ensures users only see their own sessions
- IP geolocation uses ipapi.co service
- Device detection is based on user agent parsing

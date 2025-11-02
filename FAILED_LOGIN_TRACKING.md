# Failed Login Attempt Tracking

## Overview
Automatic tracking and alerting system for failed login attempts with IP address tracking and email notifications.

## Features
- **Automatic Tracking**: Every failed login attempt is logged with IP and device info
- **Smart Counter**: Tracks consecutive attempts, resets after 1 hour or successful login
- **Alert Threshold**: Sends security email after 3 consecutive failed attempts
- **IP Detection**: Uses ipify.org API to detect login attempt IP addresses
- **User Agent Tracking**: Records browser and device information

## Database Table

### failed_login_attempts
```sql
- id: UUID (primary key)
- email: TEXT (email address of login attempt)
- ip_address: TEXT (IP address of attempt)
- user_agent: TEXT (browser/device information)
- attempt_count: INTEGER (consecutive failed attempts)
- last_attempt_at: TIMESTAMPTZ (timestamp of last attempt)
- created_at: TIMESTAMPTZ (first attempt timestamp)
```

## Edge Function

### track-failed-login
Tracks failed login attempts and returns alert status.

**Request:**
```javascript
await supabase.functions.invoke('track-failed-login', {
  body: {
    email: 'user@example.com',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...'
  }
});
```

**Response:**
```javascript
{
  success: true,
  attemptCount: 3,
  shouldAlert: true  // true when attemptCount >= 3
}
```

## Integration

### LoginForm Component
The LoginForm automatically:
1. Tracks failed login attempts on authentication error
2. Gets user's IP address via ipify.org API
3. Records browser user agent
4. Sends security alert email after 3 failed attempts
5. Clears failed attempts on successful login

### Security Alert Email
When 3+ failed attempts detected, sends email with:
- Number of failed attempts
- IP address of attempts
- Device/browser information
- Timestamp of attempts
- Instructions to secure account

## Automatic Reset Logic

### Time-Based Reset
- Counter resets to 1 if last attempt was >1 hour ago
- Prevents false alerts from attempts spread over time

### Success-Based Reset
- All failed attempt records deleted on successful login
- Ensures clean slate for legitimate users

## IP Address Detection

Uses free ipify.org API:
```javascript
const response = await fetch('https://api.ipify.org?format=json');
const { ip } = await response.json();
```

**Note**: In production, consider using a more robust IP detection service or server-side detection.

## User Agent Tracking

Captures browser user agent:
```javascript
const userAgent = navigator.userAgent;
// Example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"
```

## Security Considerations

1. **Rate Limiting**: Consider adding rate limiting to prevent abuse
2. **Account Lockout**: Consider temporary account lockout after many attempts
3. **IP Whitelisting**: Allow users to whitelist trusted IP addresses
4. **Geographic Restrictions**: Alert on attempts from unusual locations

## Testing

### Test Failed Login Tracking
1. Attempt to login with wrong password 3 times
2. Check that security alert email is sent
3. Login successfully
4. Verify failed attempts are cleared

### Test Time Reset
1. Make 2 failed attempts
2. Wait 1+ hour
3. Make another failed attempt
4. Verify counter reset to 1 (no alert sent)

## Future Enhancements
- [ ] Account lockout after X attempts
- [ ] CAPTCHA after failed attempts
- [ ] IP-based rate limiting
- [ ] Geographic anomaly detection
- [ ] Admin dashboard for monitoring attempts

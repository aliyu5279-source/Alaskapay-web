# Activity Logging System

## Overview
Comprehensive activity logging system that tracks all user actions with timestamps, IP addresses, device info, and location data.

## Features
- **Automatic Tracking**: Login, logout, profile updates, settings changes
- **Detailed Information**: IP address, device info, user agent, location
- **Searchable Interface**: Filter by action type, date range, and search terms
- **Real-time Updates**: Activity logs update instantly

## Database Schema

### activity_logs Table
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- action_type: TEXT (login, logout, transaction, settings, profile, security)
- action_details: JSONB (additional context)
- ip_address: TEXT
- device_info: TEXT
- user_agent: TEXT
- location: TEXT
- created_at: TIMESTAMP
```

## Edge Functions

### log-activity
Logs user activities with IP and device detection.

**Request:**
```json
{
  "userId": "user-uuid",
  "actionType": "login",
  "actionDetails": { "description": "User logged in" },
  "deviceInfo": "Mozilla/5.0...",
  "location": "San Francisco, CA"
}
```

### get-activity-logs
Retrieves activity logs with filtering.

**Request:**
```json
{
  "userId": "user-uuid",
  "actionType": "login",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "limit": 100
}
```

## Usage

### View Activity Logs
1. Go to Profile → Activity tab
2. View all account activities
3. Filter by action type or date range
4. Search by keywords

### Action Types
- **login**: User authentication events
- **logout**: Sign out events
- **transaction**: Financial activities
- **settings**: Configuration changes
- **profile**: Profile updates
- **security**: Security-related actions

## Automatic Logging
The system automatically logs:
- Login attempts (successful/failed)
- Logout events
- Profile information updates
- Settings changes
- Security modifications
- Transaction activities

## Manual Logging
To log custom activities:
```typescript
await supabase.functions.invoke('log-activity', {
  body: {
    userId: user.id,
    actionType: 'custom',
    actionDetails: { description: 'Custom action' },
    deviceInfo: navigator.userAgent,
    location: 'Unknown'
  }
});
```

## Security
- Row Level Security (RLS) enabled
- Users can only view their own logs
- Service role required for insertions
- IP addresses and device info tracked

## Troubleshooting

### Logs Not Appearing
- Check user authentication
- Verify edge functions are deployed
- Check browser console for errors

### Missing Information
- IP address detected server-side
- Device info from user agent
- Location can be enhanced with geolocation API

## Future Enhancements
- Geolocation API integration
- Export logs to CSV
- Email alerts for suspicious activity
- Advanced analytics dashboard

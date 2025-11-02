# Push Notification System for Mobile Admin App

## Overview
Real-time push notification system for Alaska Pay admin dashboard that sends critical alerts to mobile devices.

## Features

### 1. **Notification Types**
- ❌ Failed Transactions
- 🔒 Security Alerts
- 💰 High-Value Payments (configurable threshold)
- ⚠️ System Errors
- 📝 User Reports
- 👤 New User Signups
- 📊 Daily Digest (9 AM summary)

### 2. **Notification Preferences**
Admins can customize:
- Which notification types to receive
- High-value payment threshold
- Sound on/off
- Vibration on/off
- Quiet hours (e.g., 10 PM - 8 AM)

### 3. **Notification History**
- View all received notifications
- Filter by read/unread status
- Mark as read/unread
- Action buttons to view related content
- Delete notifications
- Badge indicators for priority

### 4. **Device Management**
- Multiple device support
- Auto-detect device type (iPhone, Android, etc.)
- Manage active subscriptions
- One-click enable/disable

## Database Tables

### `push_subscriptions`
Stores device push notification endpoints:
```sql
- id (UUID)
- user_id (UUID) - Admin user
- endpoint (TEXT) - Push service endpoint
- p256dh (TEXT) - Encryption key
- auth (TEXT) - Auth secret
- device_name (TEXT) - e.g., "iPhone", "Android"
- user_agent (TEXT)
- is_active (BOOLEAN)
- created_at, last_used_at
```

### `push_notification_preferences`
Admin notification settings:
```sql
- user_id (UUID)
- failed_transactions (BOOLEAN)
- security_alerts (BOOLEAN)
- high_value_payments (BOOLEAN)
- high_value_threshold (DECIMAL)
- system_errors (BOOLEAN)
- user_reports (BOOLEAN)
- new_user_signups (BOOLEAN)
- daily_digest (BOOLEAN)
- sound_enabled (BOOLEAN)
- vibration_enabled (BOOLEAN)
- quiet_hours_enabled (BOOLEAN)
- quiet_hours_start, quiet_hours_end (TIME)
```

### `push_notification_history`
Track all sent notifications:
```sql
- id (UUID)
- user_id (UUID)
- title, body (TEXT)
- type (TEXT) - notification category
- priority (TEXT) - normal/high
- data (JSONB) - additional metadata
- action_url (TEXT) - deep link
- is_read, is_clicked (BOOLEAN)
- sent_at, read_at, clicked_at (TIMESTAMPTZ)
```

## Edge Functions

### `send-push-notification`
Sends push notifications to admin devices.

**Request:**
```json
{
  "userId": "uuid",
  "title": "Failed Transaction",
  "body": "Transaction #12345 failed",
  "type": "failed-transactions",
  "priority": "high",
  "data": { "transactionId": "12345" },
  "actionUrl": "/admin/transactions/12345"
}
```

**Features:**
- Checks user preferences before sending
- Respects quiet hours
- Sends to all active devices
- Logs to notification history
- Returns delivery status

### `subscribe-push-notifications`
Manages device subscriptions.

**Subscribe:**
```json
{
  "action": "subscribe",
  "subscription": {
    "endpoint": "https://...",
    "keys": { "p256dh": "...", "auth": "..." }
  },
  "deviceName": "iPhone",
  "userAgent": "Mozilla/5.0..."
}
```

**Unsubscribe:**
```json
{
  "action": "unsubscribe",
  "subscription": { "endpoint": "https://..." }
}
```

## Client Integration

### Enable Notifications
```typescript
import { pushNotifications } from '@/lib/pushNotifications';

// Request permission
const permission = await pushNotifications.requestPermission();

if (permission === 'granted') {
  // Subscribe to push notifications
  await pushNotifications.subscribe();
}
```

### Check Subscription Status
```typescript
const subscription = await pushNotifications.getSubscription();
const isSubscribed = !!subscription;
```

### Disable Notifications
```typescript
await pushNotifications.unsubscribe();
```

## Service Worker

The service worker (`public/service-worker.js`) handles:
- Push event reception
- Notification display
- Click handling with deep links
- Background sync for offline actions

**Push Event:**
```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  });
});
```

**Click Event:**
```javascript
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.actionUrl || '/admin';
  clients.openWindow(url);
});
```

## Triggering Notifications

### From Edge Functions
```typescript
// In any edge function
await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseKey}`
  },
  body: JSON.stringify({
    userId: adminUserId,
    title: 'Security Alert',
    body: 'Suspicious login attempt detected',
    type: 'security-alerts',
    priority: 'high',
    actionUrl: '/admin/audit'
  })
});
```

### From Database Triggers
```sql
CREATE OR REPLACE FUNCTION notify_failed_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Get all admin users
  -- Call send-push-notification edge function
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## UI Components

### PushNotificationSettings
Located at `/admin/push-settings`
- Enable/disable push notifications
- Configure notification types
- Set high-value threshold
- Sound & vibration controls
- Quiet hours configuration

### PushNotificationHistory
Located at `/admin/push-history`
- View all notifications
- Filter by read/unread
- Mark all as read
- Action buttons for each notification
- Delete notifications

## Best Practices

1. **Respect User Preferences**: Always check preferences before sending
2. **Quiet Hours**: Don't disturb users during configured quiet times
3. **Priority Levels**: Use "high" priority sparingly for critical alerts
4. **Action URLs**: Always provide deep links for quick access
5. **Clear Titles**: Make notification purpose immediately clear
6. **Batch Updates**: Group similar notifications to avoid spam

## Testing

### Test Notification
```typescript
await supabase.functions.invoke('send-push-notification', {
  body: {
    userId: 'your-user-id',
    title: 'Test Notification',
    body: 'This is a test',
    type: 'system-errors',
    priority: 'normal'
  }
});
```

### Check Browser Support
```typescript
const supported = 'Notification' in window && 
                  'serviceWorker' in navigator && 
                  'PushManager' in window;
```

## Troubleshooting

**Notifications not appearing:**
1. Check browser notification permissions
2. Verify service worker is registered
3. Check subscription is active in database
4. Verify user preferences allow notification type

**Service worker not registering:**
1. Must be served over HTTPS (or localhost)
2. Check browser console for errors
3. Verify service-worker.js is accessible

**Push not received:**
1. Check device is online
2. Verify subscription hasn't expired
3. Check browser is running (some browsers require this)

## Security

- All subscriptions tied to authenticated users
- Row Level Security (RLS) enabled on all tables
- Preferences only modifiable by owner
- Service role key used for server-side operations
- VAPID keys for secure push delivery

## Future Enhancements

- [ ] Rich notifications with images
- [ ] Notification grouping/threading
- [ ] Scheduled notifications
- [ ] Notification templates
- [ ] Analytics on notification engagement
- [ ] Multi-language support
- [ ] Custom notification sounds

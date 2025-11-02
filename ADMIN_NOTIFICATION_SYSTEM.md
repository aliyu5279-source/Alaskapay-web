# Real-Time Admin Notification System

## Overview
Real-time notification system for admins with toast alerts, notification bell icon, unread counts, and mark-as-read functionality using Supabase real-time subscriptions.

## Features
- **Real-time Notifications**: Instant alerts via Supabase subscriptions
- **Notification Bell**: Icon with unread count badge in admin dashboard
- **Dropdown Panel**: Scrollable list of recent notifications
- **Severity Levels**: Info (blue), Warning (yellow), Critical (red)
- **Toast Alerts**: Automatic toasts for critical/warning events
- **Mark as Read**: Individual and bulk mark-as-read functionality

## Database Table

### admin_notifications
```sql
- id (UUID)
- admin_id (UUID, nullable for broadcast)
- notification_type (TEXT): 'large_transaction', 'failed_login', 'account_suspension', 'service_outage'
- severity (TEXT): 'info', 'warning', 'critical'
- title (TEXT)
- message (TEXT)
- resource_type (TEXT): 'transaction', 'user', 'service', 'login'
- resource_id (TEXT)
- metadata (JSONB)
- read_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

## Edge Function

### create-admin-notification
Creates admin notifications for critical events.

**Usage:**
```typescript
await supabase.functions.invoke('create-admin-notification', {
  body: {
    notification_type: 'large_transaction',
    severity: 'warning',
    title: 'Large Transaction Detected',
    message: 'Transaction of ₦50,000 by user@example.com',
    resource_type: 'transaction',
    resource_id: 'txn_123',
    metadata: { amount: 50000, userId: 'user_id' }
  }
});
```

## Components

### AdminNotificationBell
Located in admin dashboard header. Shows:
- Bell icon with unread count badge
- Dropdown with last 20 notifications
- Real-time updates via Supabase subscriptions
- Click notification to mark as read
- "Mark all read" button

## Integration Examples

### From Admin Tabs
```typescript
import { supabase } from '@/lib/supabase';

// Create notification for large transaction
await supabase.functions.invoke('create-admin-notification', {
  body: {
    notification_type: 'large_transaction',
    severity: 'warning',
    title: 'Large Transaction Alert',
    message: `Transaction of ₦${amount} requires review`,
    resource_type: 'transaction',
    resource_id: transactionId
  }
});
```

## Notification Types

1. **large_transaction** - Transactions above threshold
2. **failed_login** - Multiple failed login attempts
3. **account_suspension** - User account suspended
4. **service_outage** - Service availability issues

## Real-time Subscription
Automatically listens for new notifications and updates UI instantly with toast alerts for critical events.

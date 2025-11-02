# Real-Time Fraud Alert System

## Overview
Alaska Pay's real-time fraud alert system provides instant notifications to administrators when high-risk transactions are detected, enabling immediate response to potential fraud.

## Features

### 1. Multi-Channel Alerts
- **Email Alerts**: Sent to all admin users for risk scores > 70
- **SMS Alerts**: Critical alerts sent via Twilio for risk scores > 85
- **Push Notifications**: Browser push notifications for real-time updates
- **Dashboard Alerts**: Live notification panel with sound alerts

### 2. Real-Time Notification Panel
Located in the admin dashboard header, provides:
- Live updates via Supabase realtime subscriptions
- Visual badge showing unacknowledged alert count
- Animated pulse effect for urgent alerts
- Sound notifications (can be toggled)
- Quick-action buttons for immediate response

### 3. Quick Actions
Admins can take immediate action on flagged transactions:
- **Approve**: Mark transaction as legitimate
- **Block**: Block the transaction immediately
- **Review**: Open full fraud detection tab for detailed analysis

## Database Schema

### fraud_alerts Table
```sql
- id: UUID (primary key)
- transaction_id: UUID (reference to fraud flag)
- admin_id: UUID (admin who received alert)
- alert_type: TEXT (email, sms, push, dashboard)
- risk_score: INTEGER
- transaction_amount: DECIMAL
- user_id: UUID
- alert_message: TEXT
- sent_at: TIMESTAMPTZ
- acknowledged: BOOLEAN
- acknowledged_at: TIMESTAMPTZ
- acknowledged_by: UUID
- action_taken: TEXT (approved, blocked, under_review, false_positive)
```

## Alert Triggers

### High Risk (Score 70-84)
- Email alerts to all admins
- Dashboard notification with sound
- Push notification

### Critical Risk (Score 85+)
- All high-risk alerts PLUS
- SMS alerts to admins with phone numbers
- Elevated priority in notification panel

## Configuration

### Email Alerts (SendGrid)
Set in Supabase secrets:
```
SENDGRID_API_KEY=your_key_here
```

### SMS Alerts (Twilio)
Set in Supabase secrets:
```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Admin Phone Numbers
Update admin profiles with phone numbers:
```sql
UPDATE profiles 
SET phone = '+1234567890'
WHERE role = 'admin' AND email = 'admin@example.com';
```

## Usage

### For Administrators

1. **Viewing Alerts**
   - Click the bell icon in the admin dashboard header
   - Red badge shows count of unacknowledged alerts
   - Alerts auto-refresh in real-time

2. **Taking Action**
   - **Approve**: Transaction proceeds normally
   - **Block**: Transaction is blocked, user notified
   - **Review**: Opens full fraud detection interface

3. **Managing Notifications**
   - Sound alerts can be toggled on/off
   - Alerts auto-dismiss when acknowledged
   - Full history available in Fraud Detection tab

### Alert Message Format
```
HIGH RISK TRANSACTION DETECTED!

Risk Score: 85
Amount: $5,000
User: John Doe (john@example.com)
Reasons: High velocity, Unusual amount, New device

Review immediately in admin dashboard.
```

## Integration with Fraud Detection

The alert system integrates with:
- **check-fraud-risk**: Automatically sends alerts when risk > 70
- **review-fraud-flag**: Processes quick actions from notification panel
- **Fraud Detection Tab**: Full transaction review interface

## Testing

### Simulate High-Risk Transaction
```javascript
// In browser console or test script
await supabase.functions.invoke('check-fraud-risk', {
  body: {
    userId: 'user-id',
    amount: 5000,
    transactionType: 'transfer',
    deviceInfo: { fingerprint: 'new-device-123' },
    ipAddress: '192.168.1.1',
    locationData: { country: 'US', city: 'New York' }
  }
});
```

### Manual Alert Creation (Testing)
```sql
INSERT INTO fraud_alerts (
  transaction_id,
  alert_type,
  risk_score,
  transaction_amount,
  user_id,
  alert_message
) VALUES (
  'transaction-flag-id',
  'dashboard',
  85,
  5000.00,
  'user-id',
  'Test alert message'
);
```

## Best Practices

1. **Response Time**: Aim to review high-risk alerts within 5 minutes
2. **False Positives**: Mark as false positive to improve detection
3. **Phone Numbers**: Keep admin phone numbers updated for SMS alerts
4. **Sound Alerts**: Enable during active monitoring periods
5. **Alert Fatigue**: Adjust risk thresholds if too many false positives

## Monitoring

Track alert effectiveness:
```sql
-- Alert response times
SELECT 
  AVG(EXTRACT(EPOCH FROM (acknowledged_at - sent_at))/60) as avg_response_minutes,
  alert_type
FROM fraud_alerts
WHERE acknowledged = true
GROUP BY alert_type;

-- Action distribution
SELECT 
  action_taken,
  COUNT(*) as count,
  AVG(risk_score) as avg_risk
FROM fraud_alerts
WHERE action_taken IS NOT NULL
GROUP BY action_taken;
```

## Troubleshooting

### Alerts Not Appearing
1. Check admin role in profiles table
2. Verify Supabase realtime is enabled
3. Check browser console for errors
4. Ensure RLS policies allow admin access

### Email Alerts Not Sending
1. Verify SENDGRID_API_KEY is set
2. Check SendGrid account status
3. Review edge function logs

### SMS Alerts Not Sending
1. Verify Twilio credentials are set
2. Check admin phone numbers are in E.164 format (+1234567890)
3. Verify Twilio account has SMS credits

### Sound Not Playing
1. Check browser autoplay policies
2. Verify alert-sound.mp3 file exists
3. User must interact with page first (browser security)

## Security Considerations

- Alert messages contain sensitive transaction data
- Only admins can view fraud alerts (RLS enforced)
- SMS messages use abbreviated format for security
- All actions are logged in audit trail
- Phone numbers are stored securely in profiles table

## Future Enhancements

- [ ] Configurable alert thresholds per admin
- [ ] Alert escalation for unacknowledged alerts
- [ ] Mobile app push notifications
- [ ] Slack/Teams integration
- [ ] Alert templates for different risk types
- [ ] Machine learning for alert prioritization

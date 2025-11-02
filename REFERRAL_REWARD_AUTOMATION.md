# Referral Reward Automation System

## Overview

Alaska Pay's automated referral reward processing system monitors qualifying transactions, automatically approves rewards based on configurable rules, sends notifications, and handles reward expiration with fraud detection integration.

## Features

### 1. Automated Reward Processing
- **Transaction Monitoring**: Automatically detects qualifying transactions
- **Rule-Based Approval**: Configurable rules for automatic reward approval
- **Fraud Integration**: Checks fraud scores before approving rewards
- **KYC Verification**: Optional KYC requirement for high-value rewards

### 2. Configurable Reward Rules
- **Rule Types**:
  - First Transaction: Reward for referee's first transaction
  - Transaction Amount: Reward based on transaction value
  - Transaction Count: Reward after N transactions
  - Time-Based: Rewards with expiration windows
  - Custom: Flexible rule conditions

- **Reward Calculation**:
  - Fixed amount rewards
  - Percentage-based rewards
  - Maximum reward caps
  - Minimum transaction thresholds

### 3. Batch Processing
- **Approval Processing**: Auto-approve pending rewards with low fraud scores
- **Expiration Handling**: Automatically expire rewards past time window
- **Notification Batches**: Send expiration warnings in bulk
- **Performance Logging**: Track batch processing metrics

### 4. Multi-Channel Notifications
- **Email Notifications**: Reward approval, pending, and expiration alerts
- **Push Notifications**: Real-time mobile notifications
- **Notification History**: Track all sent notifications
- **Delivery Status**: Monitor email bounces and failures

### 5. Fraud Detection Integration
- **Risk Scoring**: Check fraud scores before approval
- **Auto-Flagging**: Flag high-risk rewards for manual review
- **Fraud Alerts**: Notify admins of suspicious rewards
- **Review Workflow**: Manual approval for flagged rewards

## Database Schema

### Tables Created
```sql
- referral_reward_rules: Configurable reward rules
- referral_rewards_pending: Pending reward queue
- referral_reward_notifications: Notification history
- referral_reward_expirations: Expired rewards tracking
- referral_batch_processing_logs: Batch processing logs
```

## Edge Functions

### 1. process-referral-transaction
Automatically processes transactions and creates pending rewards.

**Trigger**: Call after each transaction
```javascript
await supabase.functions.invoke('process-referral-transaction', {
  body: {
    transaction_id: 'txn_123',
    user_id: 'user_id',
    amount: 100.00,
    transaction_type: 'payment'
  }
});
```

### 2. batch-process-rewards
Batch processes pending rewards, expirations, and notifications.

**Usage**: Run via cron job or manual trigger
```javascript
// Auto-approve pending rewards
await supabase.functions.invoke('batch-process-rewards', {
  body: { processing_type: 'approval' }
});

// Process expirations
await supabase.functions.invoke('batch-process-rewards', {
  body: { processing_type: 'expiration' }
});

// Send expiration warnings
await supabase.functions.invoke('batch-process-rewards', {
  body: { processing_type: 'notification' }
});
```

### 3. manage-reward-rules
Manage reward rules configuration.

**Actions**: list, create, update, delete, toggle

## Admin Interface

### Reward Rules Manager
- Create and edit reward rules
- Configure rule conditions and amounts
- Toggle rules active/inactive
- Set priority for rule evaluation

### Reward Processing Dashboard
- Real-time stats (pending, approved, expired, flagged)
- Manual batch processing triggers
- Batch processing logs and history
- Performance metrics

### Integration with Referral Management
Access via Admin Dashboard → Referral Management → Automation tab

## Setup Instructions

### 1. Database Setup
The tables are automatically created. Verify with:
```sql
SELECT * FROM referral_reward_rules;
```

### 2. Create Initial Reward Rules
Navigate to Admin → Referral Management → Reward Rules:
1. Click "Add Rule"
2. Configure rule type and conditions
3. Set reward amount or percentage
4. Enable auto-approval if desired
5. Save rule

### 3. Configure Batch Processing
Set up cron jobs for automated processing:

**Hourly Approval Processing**:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/batch-process-rewards \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"processing_type":"approval"}'
```

**Daily Expiration Check**:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/batch-process-rewards \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"processing_type":"expiration"}'
```

### 4. Integrate Transaction Processing
Add to your transaction completion handler:
```typescript
// After successful transaction
await supabase.functions.invoke('process-referral-transaction', {
  body: {
    transaction_id: transaction.id,
    user_id: user.id,
    amount: transaction.amount,
    transaction_type: transaction.type
  }
});
```

## Best Practices

### Rule Configuration
1. **Start Conservative**: Begin with manual approval and low limits
2. **Test Thoroughly**: Test rules with small amounts first
3. **Monitor Fraud**: Watch fraud flags closely in first weeks
4. **Adjust Gradually**: Increase automation based on fraud rates

### Fraud Prevention
1. **KYC Requirements**: Require KYC for rewards over $50
2. **Fraud Thresholds**: Auto-flag rewards with fraud score > 70
3. **Manual Review**: Review all flagged rewards before approval
4. **Pattern Detection**: Monitor for unusual referral patterns

### Performance Optimization
1. **Batch Size**: Process 100 rewards per batch
2. **Frequency**: Run approval batch every hour
3. **Off-Peak**: Schedule heavy processing during low-traffic hours
4. **Monitoring**: Set up alerts for batch failures

### Notification Strategy
1. **Immediate**: Send approval notifications immediately
2. **7-Day Warning**: Notify 7 days before expiration
3. **Batch Sending**: Group notifications to reduce API calls
4. **Delivery Tracking**: Monitor bounce rates and adjust

## Monitoring

### Key Metrics
- Pending reward count
- Auto-approval rate
- Fraud flag rate
- Average processing time
- Notification delivery rate

### Alerts
Set up alerts for:
- High fraud flag rate (>10%)
- Batch processing failures
- Large pending queue (>1000)
- High notification bounce rate (>5%)

## Troubleshooting

### Rewards Not Auto-Approving
1. Check rule configuration is active
2. Verify fraud score is below threshold
3. Confirm KYC requirements are met
4. Review batch processing logs

### Notifications Not Sending
1. Check SendGrid API key configuration
2. Verify email templates exist
3. Review notification history for errors
4. Check email suppression list

### High Fraud Flags
1. Review fraud detection rules
2. Adjust fraud score thresholds
3. Implement additional verification
4. Monitor referral patterns

## Security Considerations

1. **Admin Only**: Reward rule management restricted to admins
2. **Fraud Checks**: All rewards pass through fraud detection
3. **Audit Logging**: All rule changes logged
4. **Rate Limiting**: Batch processing limited to prevent abuse
5. **Data Privacy**: User data encrypted and access controlled

# Webhook Management System

## Overview
Comprehensive webhook system for Alaska Pay that allows admins to configure external webhooks for fraud alerts, transaction events, and KYC updates with retry logic, delivery tracking, and templates for popular services.

## Database Tables

### webhook_endpoints
Stores webhook endpoint configurations:
- `id`: UUID primary key
- `name`: Webhook name
- `url`: Endpoint URL
- `event_types`: Array of event types to trigger
- `authentication_type`: none, api_key, bearer_token, hmac_signature
- `authentication_secret`: Secret for authentication
- `template_type`: slack, discord, custom
- `retry_enabled`: Enable automatic retries
- `max_retries`: Maximum retry attempts (default: 3)
- `timeout_seconds`: Request timeout (default: 30)

### webhook_delivery_logs
Tracks all webhook delivery attempts:
- `webhook_endpoint_id`: Reference to endpoint
- `event_type`: Event that triggered webhook
- `delivery_status`: pending, success, failed, retrying
- `attempt_number`: Current attempt number
- `response_status`: HTTP response code
- `duration_ms`: Request duration
- `error_message`: Error details if failed
- `next_retry_at`: Scheduled retry time

### webhook_statistics
Aggregated daily statistics per webhook:
- `webhook_endpoint_id`: Reference to endpoint
- `date`: Statistics date
- `total_deliveries`: Total attempts
- `successful_deliveries`: Success count
- `failed_deliveries`: Failure count
- `avg_response_time_ms`: Average response time

## Edge Functions

### manage-webhooks
CRUD operations for webhook endpoints:
- **create**: Create new webhook
- **update**: Update existing webhook
- **delete**: Remove webhook
- **list**: Get all webhooks

### test-webhook
Test webhook endpoint with sample payload:
- Sends test event to verify configuration
- Returns response status and duration
- Validates authentication

## Features

### Event Types
- `fraud_alert`: High-risk transaction detected
- `transaction_created`: New transaction
- `kyc_submitted`: KYC verification submitted
- `kyc_approved`: KYC approved
- `kyc_rejected`: KYC rejected

### Templates

**Slack Template:**
```json
{
  "text": "🚨 FRAUD ALERT",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Event:* fraud_alert\n*Time:* 2025-10-09T11:18:00Z"
      }
    }
  ]
}
```

**Discord Template:**
```json
{
  "content": "🚨 **FRAUD ALERT**",
  "embeds": [{
    "title": "fraud_alert",
    "description": "Event details...",
    "color": 15158332,
    "timestamp": "2025-10-09T11:18:00Z"
  }]
}
```

### Authentication Methods
1. **None**: No authentication
2. **API Key**: X-API-Key header
3. **Bearer Token**: Authorization header
4. **HMAC Signature**: X-Webhook-Signature header (planned)

### Retry Logic
- Exponential backoff: 2^n minutes
- Attempt 1: Immediate
- Attempt 2: 2 minutes later
- Attempt 3: 4 minutes later
- Max attempts: Configurable (default 3)

## Admin Interface

### Webhook Management Tab
- **Endpoints**: List and manage webhooks
- **Delivery Logs**: View delivery history
- **Statistics**: Performance metrics

### Actions
- Create webhook with template selection
- Test webhook endpoint
- Enable/disable webhooks
- View delivery logs and errors
- Monitor success rates

## Integration

### Triggering Webhooks
```typescript
import { triggerWebhook } from '@/lib/webhookService';

// Trigger webhook for fraud alert
await triggerWebhook('fraud_alert', {
  transaction_id: 'txn_123',
  user_id: 'user_456',
  risk_score: 85,
  reason: 'High velocity detected'
});
```

### Usage in Fraud Detection
Webhooks are automatically triggered when:
- Risk score > 70 (fraud_alert event)
- Transaction created (transaction_created event)
- KYC status changes (kyc_submitted, kyc_approved, kyc_rejected events)

## Setup Guide

### 1. Create Webhook Endpoint
1. Navigate to Admin Dashboard → Webhooks
2. Click "Create Webhook"
3. Enter webhook details:
   - Name: "Production Slack Alerts"
   - URL: Your webhook URL
   - Template: Select Slack/Discord/Custom
   - Event Types: Select events to monitor
   - Authentication: Configure if needed

### 2. Test Webhook
1. Click test button on webhook
2. Verify test payload is received
3. Check response status and duration

### 3. Monitor Deliveries
1. View Delivery Logs tab
2. Filter by status (success/failed/retrying)
3. Review error messages for failures

### 4. Analyze Statistics
1. View Statistics tab
2. Monitor success rates
3. Track average response times
4. Identify problematic webhooks

## Popular Service URLs

### Slack
1. Create Incoming Webhook in Slack
2. Copy webhook URL: `https://hooks.slack.com/services/...`
3. Use Slack template type

### Discord
1. Create webhook in Discord channel settings
2. Copy webhook URL: `https://discord.com/api/webhooks/...`
3. Use Discord template type

### Custom Services
- Use Custom template
- Configure authentication as needed
- Define custom payload structure

## Security Best Practices

1. **Use HTTPS**: Always use secure URLs
2. **Authentication**: Enable API key or bearer token
3. **Secret Rotation**: Regularly update secrets
4. **IP Whitelisting**: Restrict webhook sources
5. **Signature Verification**: Validate webhook signatures

## Monitoring

### Key Metrics
- **Success Rate**: Percentage of successful deliveries
- **Response Time**: Average webhook response time
- **Failure Rate**: Percentage of failed deliveries
- **Retry Rate**: Percentage requiring retries

### Alerts
- High failure rate (>20%)
- Slow response times (>5s)
- Consecutive failures (>5)

## Troubleshooting

### Common Issues

**Webhook Not Triggering:**
- Verify webhook is active
- Check event types are selected
- Confirm URL is correct

**Authentication Failures:**
- Verify secret is correct
- Check authentication type matches endpoint
- Test with curl/Postman first

**Timeouts:**
- Increase timeout_seconds
- Check endpoint performance
- Verify network connectivity

**High Failure Rate:**
- Review error messages in logs
- Test endpoint manually
- Check endpoint availability

## API Reference

### Create Webhook
```typescript
const { data } = await supabase.functions.invoke('manage-webhooks', {
  body: {
    action: 'create',
    webhook: {
      name: 'My Webhook',
      url: 'https://example.com/webhook',
      event_types: ['fraud_alert'],
      template_type: 'custom',
      authentication_type: 'api_key',
      authentication_secret: 'secret_key'
    }
  }
});
```

### Test Webhook
```typescript
const { data } = await supabase.functions.invoke('test-webhook', {
  body: { webhookId: 'webhook_id' }
});
```

### Trigger Webhook
```typescript
import { triggerWebhook } from '@/lib/webhookService';

await triggerWebhook('fraud_alert', {
  // Event data
});
```

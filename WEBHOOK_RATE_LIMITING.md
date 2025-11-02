# Webhook Rate Limiting System

## Overview
Alaska Pay's webhook system includes comprehensive rate limiting to prevent overwhelming external endpoints with too many requests. This ensures reliable delivery while respecting recipient capacity.

## Features

### 1. Configurable Rate Limits
- **Max Requests Per Minute**: Set maximum webhook deliveries per minute
- **Burst Protection**: Limit short-term request spikes
- **Custom Windows**: Configure rate limit window duration (10-3600 seconds)
- **Per-Webhook Configuration**: Each endpoint can have unique limits

### 2. Queue Management
- **Automatic Queuing**: Rate-limited requests are automatically queued
- **Exponential Backoff**: Failed deliveries retry with increasing delays
- **Priority Processing**: Queued webhooks processed in order
- **Max Retry Attempts**: Configurable retry limit (default: 5 attempts)

### 3. Throttling Statistics
- **Real-Time Metrics**: Live view of throttling events
- **Request Volume**: 24-hour request tracking
- **Throttle Rate**: Percentage of requests throttled
- **Queue Status**: Current queue depth and average wait time
- **Success Rates**: Delivery success vs. failure rates

## Database Schema

### webhook_endpoints (updated)
```sql
rate_limit_enabled BOOLEAN DEFAULT false
max_requests_per_minute INTEGER DEFAULT 100
burst_limit INTEGER DEFAULT 10
rate_limit_window_seconds INTEGER DEFAULT 60
```

### webhook_rate_limit_tracking
```sql
id UUID PRIMARY KEY
webhook_id UUID REFERENCES webhook_endpoints(id)
window_start TIMESTAMPTZ
request_count INTEGER
throttled_count INTEGER
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### webhook_queue
```sql
id UUID PRIMARY KEY
webhook_id UUID REFERENCES webhook_endpoints(id)
event_type TEXT
payload JSONB
scheduled_for TIMESTAMPTZ
status TEXT -- queued, processing, delivered, failed
attempts INTEGER
created_at TIMESTAMPTZ
processed_at TIMESTAMPTZ
```

## Configuration

### Enable Rate Limiting
1. Navigate to Admin Dashboard → Webhooks
2. Click the Settings icon on any webhook
3. Toggle "Enable Rate Limiting"
4. Configure limits:
   - Max Requests Per Minute (1-1000)
   - Burst Limit (1-100)
   - Window Duration (10-3600 seconds)
5. Click "Save Configuration"

### Recommended Settings

**High-Volume Endpoints (Slack, Discord)**
- Max Requests: 60/minute
- Burst Limit: 10
- Window: 60 seconds

**Custom APIs**
- Max Requests: 100/minute
- Burst Limit: 20
- Window: 60 seconds

**Rate-Sensitive Services**
- Max Requests: 30/minute
- Burst Limit: 5
- Window: 60 seconds

## How It Works

### Request Flow
1. Webhook event triggered
2. Check if rate limiting enabled
3. Query current window request count
4. If under limit: deliver immediately
5. If over limit: queue for later delivery
6. Update tracking metrics

### Queue Processing
- Cron job runs every minute via `process-webhook-queue` edge function
- Processes up to 50 queued webhooks per run
- Respects rate limits during queue processing
- Implements exponential backoff for retries

### Retry Logic
- Attempt 1: Immediate (if not rate limited)
- Attempt 2: +2 minutes
- Attempt 3: +4 minutes
- Attempt 4: +8 minutes
- Attempt 5: +16 minutes
- After 5 attempts: Marked as failed

## Monitoring

### Admin Dashboard
View real-time statistics for each webhook:
- Total requests (24h)
- Throttled requests count
- Throttle rate percentage
- Current queue depth
- Average wait time

### Delivery Logs
All rate-limited deliveries are logged with:
- Original trigger time
- Queue entry time
- Actual delivery time
- Delay duration
- Final status

## API Integration

### Check Rate Limit Status
```typescript
import { checkRateLimit } from '@/lib/webhookRateLimiter';

const result = await checkRateLimit(webhookId, {
  enabled: true,
  maxRequestsPerMinute: 100,
  burstLimit: 10,
  windowSeconds: 60
});

if (!result.allowed) {
  console.log(`Rate limited. Reset at: ${result.resetAt}`);
}
```

### Queue Webhook Manually
```typescript
import { queueWebhook } from '@/lib/webhookRateLimiter';

await queueWebhook(
  webhookId,
  'fraud_alert',
  { transaction_id: '123', risk_score: 85 },
  60 // delay in seconds
);
```

## Best Practices

1. **Start Conservative**: Begin with lower limits and increase as needed
2. **Monitor Metrics**: Watch throttle rates and adjust accordingly
3. **Test Endpoints**: Use webhook testing to verify rate limit behavior
4. **Document Limits**: Communicate rate limits to webhook consumers
5. **Plan for Bursts**: Set burst limits to handle traffic spikes
6. **Review Queue**: Regularly check queue depth for bottlenecks

## Troubleshooting

### High Throttle Rate
- Increase max requests per minute
- Extend rate limit window
- Add more webhook endpoints to distribute load

### Growing Queue
- Check endpoint availability
- Verify rate limits aren't too restrictive
- Review retry attempts and backoff strategy

### Failed Deliveries
- Verify endpoint URL and authentication
- Check endpoint rate limit policies
- Review error messages in delivery logs

## Cron Setup

Add to your cron scheduler:
```bash
# Process webhook queue every minute
* * * * * curl -X POST https://your-project.supabase.co/functions/v1/process-webhook-queue \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Or use Supabase Cron (if available):
```sql
SELECT cron.schedule(
  'process-webhook-queue',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/process-webhook-queue',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

# System Health Monitoring

## Overview
Comprehensive system health monitoring for production readiness with automated checks, metrics tracking, and alerting.

## Features

### 1. Service Health Checks
- **Supabase Database**: Connection and query performance
- **Stripe API**: Payment gateway availability
- **Paystack API**: Nigerian payment processor status
- **SendGrid**: Email delivery service health
- **Response Time Tracking**: Monitor latency for all services

### 2. System Metrics
- **Active Users**: Real-time user count
- **Transaction Success Rate**: Payment completion percentage
- **Error Rate**: Application errors per minute
- **API Response Times**: Average latency tracking
- **Database Performance**: Query execution times

### 3. Automated Monitoring
- **Scheduled Health Checks**: Run every 5 minutes via cron
- **Real-time Alerts**: Instant notifications for service degradation
- **Historical Data**: 30-day retention for trend analysis

## Setup

### 1. Deploy Health Check Function

```bash
supabase functions deploy health-check
```

### 2. Schedule Automated Checks

Create a cron job in Supabase Dashboard:

```sql
-- Go to Database → Cron Jobs → Create new job
SELECT cron.schedule(
  'health-check-5min',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/health-check',
    headers := jsonb_build_object('Authorization', 'Bearer YOUR_ANON_KEY')
  );
  $$
);
```

### 3. Configure Alerts

Set up email alerts for critical issues:

```sql
CREATE OR REPLACE FUNCTION notify_health_issues()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'down' THEN
    PERFORM net.http_post(
      url := 'https://YOUR_PROJECT.supabase.co/functions/v1/send-alert',
      headers := jsonb_build_object('Authorization', 'Bearer YOUR_SERVICE_KEY'),
      body := jsonb_build_object(
        'service', NEW.service_name,
        'status', NEW.status,
        'error', NEW.error_message
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER health_alert_trigger
AFTER INSERT ON health_check_logs
FOR EACH ROW EXECUTE FUNCTION notify_health_issues();
```

## Dashboard Access

Navigate to: **Admin Dashboard → System Health**

### View Options
- **Service Status**: Current health of all services
- **Response Times**: Latency metrics
- **Error Logs**: Recent failures and issues
- **Historical Trends**: Performance over time

## Monitoring Best Practices

### 1. Daily Checks
- Review dashboard every morning
- Check for any degraded services
- Verify all response times < 1000ms

### 2. Alert Response
- Acknowledge alerts within 15 minutes
- Investigate root cause immediately
- Document resolution steps

### 3. Performance Baselines
- **Healthy Response Time**: < 500ms
- **Degraded**: 500ms - 2000ms
- **Critical**: > 2000ms or service down

### 4. Uptime Targets
- **Database**: 99.9% uptime
- **Payment APIs**: 99.5% uptime
- **Email Service**: 99% uptime

## Metrics to Monitor

### Critical Metrics
1. **Transaction Success Rate**: Should be > 95%
2. **API Error Rate**: Should be < 1%
3. **Database Query Time**: Should be < 100ms average
4. **Active User Sessions**: Track for capacity planning

### Warning Signs
- Response times increasing over time
- Error rate spike (> 5%)
- Multiple service degradations
- Database connection pool exhaustion

## Integration with Existing Systems

### Fraud Detection
Health monitoring integrates with fraud detection to track:
- Fraud check response times
- Rule evaluation performance
- Alert delivery success

### Payment Processing
Monitor payment gateway health:
- Stripe webhook delivery
- Paystack transaction processing
- Commission calculation timing

### Email Delivery
Track email service performance:
- SendGrid API availability
- Email delivery success rate
- Bounce rate monitoring

## Troubleshooting

### Service Shows as Down
1. Check service provider status page
2. Verify API keys are valid
3. Check network connectivity
4. Review error logs for details

### High Response Times
1. Check database query performance
2. Review API rate limits
3. Verify server resources
4. Consider caching strategies

### Missing Health Data
1. Verify cron job is running
2. Check edge function logs
3. Ensure database permissions correct
4. Review RLS policies

## Production Checklist

- [ ] Health check function deployed
- [ ] Cron job scheduled (every 5 minutes)
- [ ] Alert notifications configured
- [ ] Dashboard accessible to admins
- [ ] Baseline metrics established
- [ ] On-call rotation defined
- [ ] Incident response plan documented
- [ ] Uptime monitoring tool integrated (optional)

## External Monitoring (Recommended)

Consider adding third-party uptime monitoring:

1. **UptimeRobot** (Free): https://uptimerobot.com
   - Monitor main application URL
   - Check every 5 minutes
   - Email/SMS alerts

2. **Pingdom**: https://pingdom.com
   - Advanced monitoring
   - Performance insights
   - Global check locations

3. **Better Uptime**: https://betteruptime.com
   - Status page creation
   - Incident management
   - Team notifications

## Next Steps

1. Set up external uptime monitoring
2. Configure PagerDuty for critical alerts
3. Create incident response playbook
4. Schedule weekly health reviews
5. Implement automated remediation for common issues

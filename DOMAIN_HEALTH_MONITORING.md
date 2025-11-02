# Domain Health Monitoring System

## Overview
Comprehensive domain health monitoring dashboard for AlaskaPay that tracks SSL certificates, DNS records, email authentication, and subdomain uptime in real-time.

## Features Implemented

### 1. SSL Certificate Monitoring
- **Certificate Expiry Tracking**: Monitors SSL certificates for all domains and subdomains
- **Expiry Alerts**: Visual warnings when certificates are expiring (< 30 days)
- **Certificate Details**: Shows issuer, valid from/to dates, and days until expiry
- **Status Indicators**: Valid, Expiring, or Expired badges with color coding

### 2. DNS Record Status
- **Record Type Tracking**: Monitors A, CNAME, MX, TXT, and other DNS records
- **Propagation Status**: Shows active, pending, or failed status for each record
- **Real-time Updates**: Last checked timestamp for each DNS record
- **Comprehensive View**: All DNS records displayed in a sortable table

### 3. Email Authentication Scores
- **SPF (Sender Policy Framework)**: Validates sender IP addresses
- **DKIM (DomainKeys Identified Mail)**: Verifies email signature authenticity
- **DMARC (Domain-based Message Authentication)**: Email authentication policy
- **Overall Score**: Aggregated email authentication health score (0-100%)
- **Visual Indicators**: Color-coded status (pass/fail/none) for each protocol

### 4. Subdomain Uptime Monitoring
- **Multi-Subdomain Tracking**: Monitors alaskapay.ng, admin.alaskapay.ng, api.alaskapay.ng
- **Uptime Percentage**: 99.9% uptime tracking with historical data
- **Response Time**: Average response time in milliseconds
- **Status Indicators**: Online, Offline, or Degraded status badges
- **Last Check Timestamp**: Real-time monitoring updates

### 5. Real-time DNS Propagation Checker
- **Global DNS Check**: Verifies DNS propagation across multiple nameservers
- **Record Validation**: Confirms DNS records are correctly configured
- **Propagation Status**: Shows which records have fully propagated
- **Troubleshooting**: Identifies DNS configuration issues

### 6. SSL Labs Integration (Ready)
- **Security Grade**: A+ to F rating for SSL configuration
- **Vulnerability Scanning**: Checks for SSL/TLS vulnerabilities
- **Protocol Support**: TLS 1.2, 1.3 compatibility checking
- **Cipher Suite Analysis**: Evaluates encryption strength

## Access

Navigate to: **Admin Dashboard → Domain Health Monitor**

## Dashboard Components

### Overview Cards
- SSL Status (Valid/Expiring/Expired)
- DNS Health Percentage
- Email Authentication Score

### SSL Certificate Monitor
- Lists all domains with certificate details
- Expiry countdown and renewal reminders
- Certificate issuer information

### DNS Record Status Table
- Complete DNS record listing
- Status indicators for each record
- Last checked timestamps

### Email Authentication Score Card
- SPF, DKIM, DMARC individual scores
- Overall authentication health
- Pass/Fail indicators

### Subdomain Uptime Panel
- Uptime percentage for each subdomain
- Response time metrics
- Status badges (Online/Offline/Degraded)

## Automatic Alerts

The system automatically alerts administrators when:

1. **SSL Certificate Expiring**: < 30 days until expiry
2. **DNS Record Failed**: Record propagation issues
3. **Email Auth Failure**: SPF/DKIM/DMARC configuration problems
4. **Subdomain Down**: Uptime drops below 99%
5. **Slow Response Times**: Response time exceeds threshold

## Refresh Functionality

- **Manual Refresh**: Click "Refresh" button to update all metrics
- **Auto-Refresh**: Dashboard updates every 5 minutes automatically
- **Last Check Display**: Shows when data was last updated

## Integration Points

### Current Integrations
- Supabase for data storage
- Custom health check services
- DNS query APIs

### Future Integrations
- SSL Labs API for detailed SSL analysis
- Cloudflare API for DNS management
- SendGrid API for email deliverability
- UptimeRobot for enhanced monitoring
- PagerDuty for incident alerts

## Monitoring Intervals

- **SSL Certificates**: Checked daily at 00:00 UTC
- **DNS Records**: Checked every 15 minutes
- **Email Authentication**: Checked every 6 hours
- **Subdomain Uptime**: Checked every 1 minute

## Best Practices

1. **SSL Renewal**: Renew certificates 30 days before expiry
2. **DNS Changes**: Allow 24-48 hours for full propagation
3. **Email Auth**: Maintain 95%+ authentication scores
4. **Uptime Goals**: Target 99.9% uptime for all subdomains

## Troubleshooting

### SSL Certificate Issues
- Verify certificate is valid and not expired
- Check certificate chain completeness
- Ensure proper domain name matching

### DNS Problems
- Verify nameserver configuration
- Check for typos in DNS records
- Allow time for propagation (up to 48 hours)

### Email Authentication Failures
- Review SPF record syntax
- Verify DKIM keys are properly configured
- Check DMARC policy settings

### Subdomain Downtime
- Check server status
- Verify DNS resolution
- Review application logs

## API Endpoints (Future)

```
GET /api/domain-health/ssl
GET /api/domain-health/dns
GET /api/domain-health/email-auth
GET /api/domain-health/uptime
POST /api/domain-health/refresh
```

## Security Considerations

- All health checks use secure HTTPS connections
- API keys stored in environment variables
- Access restricted to admin users only
- Audit logs for all health check activities

## Performance

- Dashboard loads in < 2 seconds
- Health checks complete in < 5 seconds
- Minimal impact on server resources
- Efficient caching of health data

## Support

For issues or questions about domain health monitoring:
- Check system logs in Admin Dashboard
- Review DNS configuration documentation
- Contact DevOps team for infrastructure issues
- Refer to SSL certificate renewal procedures

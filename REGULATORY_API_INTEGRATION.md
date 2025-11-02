# Regulatory API Integration Guide

## Overview
Alaska Pay integrates with CBN (Central Bank of Nigeria) and NITDA (National Information Technology Development Agency) APIs for automated regulatory report submission with retry logic and confirmation tracking.

## Features
- ✅ Automated report formatting per regulatory specifications
- ✅ Electronic submission to CBN and NITDA APIs
- ✅ Confirmation receipt handling and storage
- ✅ Intelligent retry logic for failed submissions
- ✅ Submission queue management
- ✅ Audit trail for all submissions
- ✅ Real-time submission status tracking

## Database Schema

### regulatory_submissions
Tracks all regulatory report submissions:
- `report_id`: Link to regulatory_reports table
- `regulatory_body`: CBN, NITDA, FIRS, etc.
- `submission_type`: monthly, quarterly, annual, incident
- `status`: pending, submitted, confirmed, failed, retrying
- `submission_reference`: Reference number from regulatory body
- `confirmation_receipt`: Full receipt data (JSONB)
- `retry_count`: Number of retry attempts
- `error_message`: Last error if failed

### submission_retry_queue
Manages retry queue for failed submissions:
- `submission_id`: Link to regulatory_submissions
- `scheduled_for`: When to retry
- `priority`: Higher = process first
- `payload`: Submission data
- `status`: queued, processing, completed, failed

### submission_audit_trail
Complete audit log of all submission activities

## API Configuration

### Environment Variables Required

```bash
# CBN API Configuration
CBN_API_URL=https://api.cbn.gov.ng/submissions
CBN_API_KEY=your_cbn_api_key_here
CBN_INSTITUTION_CODE=ALASKA_PAY_001

# NITDA API Configuration
NITDA_API_URL=https://api.nitda.gov.ng/compliance
NITDA_API_KEY=your_nitda_api_key_here
NITDA_ORGANIZATION_ID=ALASKA_PAY_ORG
```

## Report Format Specifications

### CBN Monthly Transaction Report
```json
{
  "institutionCode": "ALASKA_PAY_001",
  "reportType": "monthly_transaction_report",
  "reportingPeriod": "2025-01",
  "submissionDate": "2025-02-01T00:00:00Z",
  "totalTransactions": 15000,
  "totalVolume": 450000000,
  "transactionBreakdown": [
    {
      "type": "transfer",
      "count": 8000,
      "volume": 250000000
    },
    {
      "type": "bill_payment",
      "count": 5000,
      "volume": 150000000
    }
  ]
}
```

### CBN Quarterly Compliance Report
```json
{
  "institutionCode": "ALASKA_PAY_001",
  "reportType": "quarterly_compliance",
  "reportingPeriod": "Q1-2025",
  "submissionDate": "2025-04-15T00:00:00Z",
  "complianceScore": 95,
  "violations": [],
  "remediationActions": []
}
```

### NITDA Annual Data Protection Report
```json
{
  "organizationId": "ALASKA_PAY_ORG",
  "reportType": "annual_data_protection",
  "reportingPeriod": "2024",
  "submissionDate": "2025-01-31T00:00:00Z",
  "dataProtectionMetrics": {
    "dataBreaches": 0,
    "dataSubjectRequests": 45,
    "consentRecords": 12500,
    "securityIncidents": []
  },
  "complianceStatus": "compliant"
}
```

## Usage

### Submit Report to CBN
```typescript
import { submitRegulatoryReport } from '@/lib/regulatorySubmission';

const result = await submitRegulatoryReport(
  reportId,
  'CBN',
  'monthly_transaction_report'
);

if (result.success) {
  console.log('Submitted:', result.referenceNumber);
} else {
  console.error('Failed:', result.error);
}
```

### Retry Failed Submission
```typescript
import { retrySubmission } from '@/lib/regulatorySubmission';

const result = await retrySubmission(submissionId);
```

### Monitor Submission Queue
Navigate to Admin > Compliance > Submissions tab to:
- View all submissions and their status
- Manually retry failed submissions
- Download confirmation receipts
- Monitor retry queue
- View submission statistics

## Retry Logic

### Automatic Retry Schedule
- **Attempt 1**: Immediate
- **Attempt 2**: After 5 minutes
- **Attempt 3**: After 30 minutes
- **Attempt 4**: After 2 hours
- **Attempt 5**: After 24 hours

### Priority Queue
Submissions are prioritized by:
1. Deadline proximity (urgent deadlines first)
2. Regulatory body (CBN > NITDA > Others)
3. Report type (mandatory > optional)

## Error Handling

### Common Errors
- **Network Timeout**: Auto-retry after delay
- **Invalid Format**: Alert admin, manual review required
- **Authentication Failed**: Check API keys
- **Rate Limit**: Queue for later submission
- **Duplicate Submission**: Log and skip

### Alert Notifications
Admins receive alerts for:
- Failed submissions after 3 retries
- Authentication errors
- Format validation failures
- Approaching submission deadlines

## Confirmation Receipts

All successful submissions receive:
- Unique reference number
- Submission timestamp
- Confirmation code
- Receipt data (stored in JSONB)

Receipts can be downloaded as PDF from the Submissions tab.

## Compliance Dashboard

Access via: **Admin Panel > Compliance > Submissions**

Features:
- Real-time submission status
- Retry queue monitoring
- Success/failure statistics
- Confirmation receipt downloads
- Manual retry triggers
- Audit trail viewing

## Testing

### Development Mode
In development, submissions use simulated API responses:
- 90% success rate
- Mock reference numbers
- Simulated network delays

### Production Checklist
- [ ] Obtain CBN API credentials
- [ ] Obtain NITDA API credentials
- [ ] Configure environment variables
- [ ] Test submission with sandbox APIs
- [ ] Verify receipt handling
- [ ] Test retry logic
- [ ] Configure alert notifications

## Security

### API Key Management
- Store keys in Supabase secrets
- Never expose in frontend code
- Rotate keys quarterly
- Use different keys for dev/prod

### Data Protection
- Encrypt submission payloads
- Log all API interactions
- Maintain audit trail
- Secure confirmation receipts

## Support

For API integration issues:
- CBN: [email protected]
- NITDA: [email protected]

## Next Steps

1. **Obtain API Credentials**: Contact CBN and NITDA
2. **Configure Environment**: Add API keys to Supabase
3. **Test Submissions**: Use sandbox endpoints
4. **Enable Automation**: Schedule automated submissions
5. **Monitor Performance**: Review submission success rates
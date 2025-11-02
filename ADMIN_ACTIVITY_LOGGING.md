# Admin Activity Logging System

## Overview
Comprehensive activity logging system that tracks all administrative actions performed in the admin portal for compliance, security auditing, and accountability.

## Features
- **Comprehensive Action Tracking**: Logs 25+ action types including user modifications, transaction approvals, settings changes, and data exports
- **Detailed Metadata**: Captures admin ID, action type, target resource, changes made, IP address, user agent, and timestamp
- **Searchable Interface**: Advanced filtering by action type, status, date range, and search terms
- **CSV Export**: Export filtered logs for compliance reporting and external analysis
- **Real-time Updates**: Activity logs update in real-time as actions are performed
- **Row-Level Security**: Only admins can view activity logs

## Database Schema

### admin_activity_logs Table
```sql
- id: UUID (Primary Key)
- admin_id: UUID (References auth.users)
- action_type: VARCHAR(100)
- target_resource: VARCHAR(255)
- target_id: VARCHAR(255)
- changes_made: JSONB
- ip_address: INET
- user_agent: TEXT
- status: VARCHAR(50) - 'success', 'failed', 'pending'
- error_message: TEXT
- metadata: JSONB
- created_at: TIMESTAMPTZ
```

## Action Types
- User Management: user_created, user_updated, user_deleted, user_suspended
- Transactions: transaction_approved, transaction_rejected, transaction_refunded
- KYC: kyc_approved, kyc_rejected, kyc_reviewed
- Settings: settings_updated, role_changed, permissions_updated
- Data: data_exported, report_generated, bulk_operation
- Webhooks: webhook_configured
- API: api_key_created, api_key_revoked
- Fraud: fraud_rule_updated
- Commission: commission_processed, withdrawal_approved
- Email: template_created, template_updated, campaign_sent
- Segments: segment_created, automation_triggered
- System: system_config_changed

## Usage

### Logging an Activity
```typescript
import { logAdminActivity } from '@/lib/adminActivityLogger';

// Log user update
await logAdminActivity({
  actionType: 'user_updated',
  targetResource: 'users',
  targetId: userId,
  changesMade: { email: 'new@email.com' },
  metadata: { reason: 'User request' }
});

// Log failed action
await logAdminActivity({
  actionType: 'transaction_approved',
  targetResource: 'transactions',
  targetId: transactionId,
  status: 'failed',
  errorMessage: 'Insufficient balance'
});
```

### Viewing Activity Logs
Navigate to **Admin Portal → Activity Logs** to:
- Search logs by keyword
- Filter by action type
- Filter by status (success/failed/pending)
- Filter by date range
- Export filtered results to CSV

## Integration Examples
See `src/lib/adminActivityExamples.ts` for integration patterns.

## Security
- RLS policies restrict log access to admin users only
- IP address and user agent tracking for security auditing
- Immutable logs (no update/delete policies)
- Automatic timestamp recording

## Compliance
Activity logs support compliance requirements by:
- Maintaining audit trail of all administrative actions
- Recording who performed what action and when
- Tracking changes to sensitive data
- Providing exportable reports for auditors

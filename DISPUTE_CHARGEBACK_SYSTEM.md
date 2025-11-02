# Transaction Dispute & Chargeback System

## Overview
Comprehensive system for users to report fraudulent or incorrect transactions, upload evidence, communicate with support, and receive refunds with full audit trail.

## Database Schema

### Tables Created
1. **transaction_disputes** - Main dispute records
2. **dispute_evidence** - Evidence files (images, PDFs)
3. **dispute_messages** - Communication thread
4. **dispute_audit_logs** - Complete audit trail
5. **dispute_statistics** - Analytics and metrics

### Storage Bucket
- **dispute-evidence** - Secure storage for evidence documents

## User Features

### Creating a Dispute
```typescript
// Users can create disputes from transaction history
import { CreateDisputeModal } from '@/components/disputes/CreateDisputeModal';

// Dispute types:
- unauthorized: Unauthorized Transaction
- incorrect_amount: Incorrect Amount
- duplicate: Duplicate Charge
- service_not_received: Service Not Received
- quality_issue: Quality Issue
- other: Other
```

### Tracking Disputes
```typescript
// View all disputes with status
import { DisputesList } from '@/components/disputes/DisputesList';

// Statuses:
- pending: Awaiting review
- under_review: Being reviewed
- investigating: Under investigation
- resolved: Resolved without refund
- rejected: Dispute rejected
- refunded: Refund processed
- closed: Case closed
```

### Evidence Upload
- Upload multiple files (images, PDFs)
- Secure storage in Supabase
- View uploaded evidence
- Add evidence after dispute creation

### Communication
- Message thread with support team
- Real-time updates
- Internal notes (admin only)
- Attachment support

## Admin Features

### Dispute Management Dashboard
```typescript
// Admin panel at: /admin -> Disputes tab
import { DisputeManagementTab } from '@/components/admin/DisputeManagementTab';
```

### Admin Actions
1. **Review Disputes**
   - View all dispute details
   - Access evidence files
   - Read communication history

2. **Status Updates**
   - Move to under_review
   - Investigate further
   - Resolve without refund
   - Reject dispute
   - Process refund

3. **Process Refunds**
   - Automatic refund transaction creation
   - Wallet balance update
   - Notification to user
   - Audit trail logging

4. **Analytics**
   - Total disputes
   - Pending count
   - Resolution rate
   - Refund amounts

## Audit Trail

Every action is logged:
- Dispute creation
- Status changes
- Evidence uploads
- Messages sent
- Refund processing
- Admin actions

## Integration Points

### From Transaction List
```typescript
// Add dispute button to transactions
<Button onClick={() => openDisputeModal(transaction)}>
  Report Issue
</Button>
```

### From User Dashboard
```typescript
// View disputes section
import { DisputesList } from '@/components/disputes/DisputesList';
import { DisputeDetailModal } from '@/components/disputes/DisputeDetailModal';
```

## Security

### Row Level Security (RLS)
- Users can only view their own disputes
- Users can only create disputes for their transactions
- Evidence access restricted to dispute owner
- Internal messages hidden from users
- Admin access through service role

### File Security
- Private storage bucket
- Signed URLs for access
- File type validation
- Size limits enforced

## Workflow

### User Flow
1. User identifies problematic transaction
2. Opens CreateDisputeModal
3. Selects dispute type
4. Provides reason and description
5. Uploads evidence (optional)
6. Submits dispute
7. Receives confirmation
8. Can add more evidence
9. Communicates with support
10. Receives resolution notification

### Admin Flow
1. Receives notification of new dispute
2. Reviews dispute details
3. Examines evidence
4. Investigates transaction
5. Communicates with user if needed
6. Makes decision:
   - Resolve (no refund)
   - Reject (invalid)
   - Process refund
7. Updates status
8. Adds resolution notes
9. System notifies user

## API Examples

### Create Dispute
```typescript
const { data, error } = await supabase
  .from('transaction_disputes')
  .insert({
    user_id: user.id,
    transaction_id: transactionId,
    dispute_type: 'unauthorized',
    amount: 5000,
    reason: 'Did not authorize this transaction',
    description: 'I did not make this purchase...'
  });
```

### Upload Evidence
```typescript
const { error } = await supabase.storage
  .from('dispute-evidence')
  .upload(`${disputeId}/${fileName}`, file);
```

### Process Refund
```typescript
// Create refund transaction
const { data: refundTx } = await supabase
  .from('transactions')
  .insert({
    user_id: dispute.user_id,
    type: 'refund',
    amount: refundAmount,
    status: 'completed'
  });

// Update dispute
await supabase
  .from('transaction_disputes')
  .update({
    status: 'refunded',
    refund_amount: refundAmount,
    refund_transaction_id: refundTx.id
  })
  .eq('id', disputeId);
```

## Best Practices

### For Users
- Provide detailed descriptions
- Upload clear evidence
- Respond to admin messages promptly
- Be honest and accurate

### For Admins
- Review disputes within 24 hours
- Communicate clearly with users
- Document decisions thoroughly
- Process refunds promptly when approved
- Use priority flags for high-value disputes

## Notifications

### User Notifications
- Dispute created confirmation
- Status change updates
- New admin messages
- Refund processed
- Dispute resolved/rejected

### Admin Notifications
- New dispute created
- User response received
- High-priority disputes
- Evidence uploaded

## Analytics & Reporting

### Metrics Tracked
- Total disputes by period
- Resolution time (average)
- Refund amounts
- Dispute types distribution
- Resolution outcomes
- User satisfaction

### Reports Available
- Daily dispute summary
- Refund reconciliation
- Fraud pattern analysis
- User dispute history
- Category trends

## Future Enhancements
- Automated fraud detection integration
- AI-powered evidence analysis
- Chargeback prevention tools
- Dispute mediation system
- Batch refund processing
- Advanced analytics dashboard

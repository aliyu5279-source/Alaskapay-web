# Payment Receipt Generation System

## Overview
Automated PDF receipt generation system for bill payments with email delivery, download capabilities, and secure storage.

## Features

### Receipt Generation
- **Automatic Creation**: Receipts generated automatically for completed payments
- **Professional Format**: Alaska Pay branded receipts with complete payment details
- **Secure Storage**: Receipts stored in Supabase storage bucket with user-level access control
- **HTML Format**: Receipts generated as HTML for easy viewing and printing

### Receipt Contents
- **Header**: Alaska Pay branding and receipt title
- **Confirmation Number**: Unique reference number (AP-XXXXXXXX format)
- **Payment Details**: Date, time, and status
- **Biller Information**: Biller name and account number
- **Fee Breakdown**: 
  - Payment amount
  - Processing fee (1%)
  - Total charged
- **Footer**: Contact information and support details

### Delivery Methods
1. **Email Delivery**: Automatic email sent upon payment completion
2. **Download**: Users can download receipts from payment history
3. **Re-send**: Option to email receipts again from history

## Database Schema

```sql
-- Added to bill_payments table
ALTER TABLE bill_payments 
ADD COLUMN receipt_url TEXT,
ADD COLUMN receipt_generated_at TIMESTAMPTZ;
```

## Edge Functions

### generate-payment-receipt
Generates HTML receipt and stores in Supabase storage.

**Endpoint**: `/functions/v1/generate-payment-receipt`

**Request**:
```json
{
  "paymentId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "receiptUrl": "user-id/payment-id.html",
  "confirmationNumber": "AP-12345678"
}
```

## Storage Structure

**Bucket**: `payment-receipts` (private)

**Path Format**: `{user_id}/{payment_id}.html`

**Access Control**: Users can only access their own receipts

## Integration Points

### 1. Payment Processing
Receipts are automatically generated when:
- Payment status is "completed"
- Payment is not flagged for review
- Payment is not scheduled for future date

### 2. Email Notifications
Receipt emails are sent via `send-transaction-receipt` function with:
- Payment confirmation
- Receipt attachment/link
- Transaction summary

### 3. Payment History UI
Enhanced with:
- Download button for receipts
- Email button to resend receipts
- Visual indicator when receipt is available

## Usage Examples

### Generate Receipt (Automatic)
```typescript
// Called automatically in process-bill-payment function
await supabase.functions.invoke('generate-payment-receipt', {
  body: { paymentId: payment.id }
});
```

### Download Receipt
```typescript
const { data } = await supabase.storage
  .from('payment-receipts')
  .download(payment.receipt_url);

const url = URL.createObjectURL(data);
// Trigger download
```

### Email Receipt
```typescript
await supabase.functions.invoke('send-transaction-receipt', {
  body: { 
    paymentId: payment.id,
    amount: payment.amount,
    type: 'bill_payment'
  }
});
```

## Security Features

### Storage Security
- **Private Bucket**: Receipts not publicly accessible
- **User Isolation**: Path includes user ID for access control
- **RLS Policies**: Row-level security on bill_payments table

### Data Protection
- **Masked Account Numbers**: Only last 4 digits shown
- **Secure URLs**: Time-limited signed URLs for downloads
- **Audit Trail**: receipt_generated_at timestamp tracked

## Receipt Template

The receipt includes:

```
┌─────────────────────────────────┐
│         Alaska Pay              │
│      Payment Receipt            │
├─────────────────────────────────┤
│ Confirmation: AP-12345678       │
│ Date: Oct 9, 2025 11:53 AM      │
│ Status: Completed               │
├─────────────────────────────────┤
│ Biller Information              │
│ Biller: Electric Company        │
│ Account: ****1234               │
├─────────────────────────────────┤
│ Payment Details                 │
│ Payment Amount      $100.00     │
│ Processing Fee (1%)   $1.00     │
│ Total Charged       $101.00     │
├─────────────────────────────────┤
│ Thank you for using Alaska Pay  │
│ support@alaskapay.com           │
└─────────────────────────────────┘
```

## User Experience

### Payment Flow
1. User completes bill payment
2. Receipt automatically generated
3. Email sent with receipt link
4. Receipt available in payment history

### History View
- Download icon button for completed payments
- Email icon to resend receipt
- Visual indicator showing receipt availability
- Quick access to confirmation numbers

## Monitoring

### Admin Dashboard
Track receipt generation:
- Total receipts generated
- Failed generation attempts
- Storage usage
- Email delivery status

### Metrics
- Receipt generation rate
- Download frequency
- Email open rates
- Storage growth

## Troubleshooting

### Receipt Not Generated
- Check payment status is "completed"
- Verify storage bucket permissions
- Check edge function logs

### Download Failed
- Verify receipt_url exists in database
- Check user has access to file
- Ensure storage bucket is accessible

### Email Not Received
- Check email service status
- Verify user email address
- Check spam folder
- Review email function logs

## Future Enhancements

### Planned Features
- PDF format conversion
- Multi-language support
- Custom branding options
- Batch receipt generation
- Receipt archival system
- Tax reporting integration

### Optimization
- Receipt template caching
- Batch email sending
- Compressed storage
- CDN delivery

## Best Practices

1. **Generate Immediately**: Create receipts right after payment completion
2. **Email Promptly**: Send receipt emails within seconds
3. **Store Securely**: Use private bucket with proper access controls
4. **Monitor Storage**: Track storage usage and implement cleanup policies
5. **Test Regularly**: Verify receipt generation and delivery
6. **Backup Data**: Maintain receipt backups for compliance

## Compliance

- **Record Retention**: Receipts stored indefinitely
- **Audit Trail**: All generation events logged
- **Data Privacy**: User data protected per privacy policy
- **Financial Records**: Meets payment processing standards

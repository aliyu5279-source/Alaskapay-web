# Chargeback Prevention System

## Overview
Alaska Pay's proactive chargeback prevention system uses ML-based risk scoring, pre-dispute alerts, instant resolution options, and automated merchant evidence to reduce chargeback rates and save costs.

## Key Features

### 1. Transaction Risk Analysis
- **Real-time Risk Scoring**: ML-based scoring (0-100) for every transaction
- **Risk Factors**:
  - High velocity (multiple transactions in short time)
  - Unusual transaction amounts
  - Off-hours activity
  - Failed transaction history
  - New account activity
  - Device/location anomalies
- **Risk Levels**: Low, Medium, High, Critical

### 2. Pre-Dispute Alerts
- **Proactive User Notification**: Alert users about suspicious transactions before chargebacks
- **48-Hour Response Window**: Users have time to respond
- **Alert Types**:
  - High Risk Transaction
  - Unusual Activity
  - Merchant Inquiry
  - Pre-Chargeback Warning

### 3. Instant Resolution Options
Users can resolve alerts instantly:
- **Confirm Transaction**: Mark as legitimate
- **Request Refund**: Immediate full/partial refund
- **Report Fraud**: Escalate to dispute
- **Processing Time**: < 5 seconds average

### 4. Gateway Integration
- **Paystack Chargeback API**: Automatic notification sync
- **Flutterwave Disputes**: Real-time webhook integration
- **Stripe Disputes**: Evidence submission automation

### 5. Automated Merchant Evidence
System automatically generates and submits:
- Transaction receipts
- Communication logs
- Proof of delivery
- Terms acceptance records
- Customer signatures
- Tracking information

## Database Schema

### chargeback_risk_scores
```sql
- transaction_id (UUID, FK)
- user_id (UUID, FK)
- risk_score (INTEGER 0-100)
- risk_level (TEXT: low/medium/high/critical)
- risk_factors (JSONB array)
- ml_model_version (TEXT)
```

### pre_dispute_alerts
```sql
- transaction_id (UUID, FK)
- user_id (UUID, FK)
- alert_type (TEXT)
- message (TEXT)
- resolution_options (JSONB array)
- status (TEXT: sent/viewed/resolved/escalated/expired)
- expires_at (TIMESTAMPTZ)
```

### instant_resolutions
```sql
- alert_id (UUID, FK)
- transaction_id (UUID, FK)
- resolution_type (TEXT: full_refund/partial_refund/confirmed/disputed)
- amount (DECIMAL)
- processing_time_seconds (INTEGER)
- prevented_chargeback (BOOLEAN)
```

### gateway_chargeback_notifications
```sql
- gateway (TEXT: paystack/flutterwave/stripe)
- gateway_chargeback_id (TEXT)
- transaction_id (UUID, FK)
- status (TEXT: notification/evidence_required/won/lost)
- evidence_due_date (TIMESTAMPTZ)
- raw_data (JSONB)
```

### merchant_evidence
```sql
- chargeback_notification_id (UUID, FK)
- evidence_type (TEXT)
- evidence_data (JSONB)
- file_url (TEXT)
- auto_generated (BOOLEAN)
- submitted_to_gateway (BOOLEAN)
```

## User Flow

### 1. Transaction Occurs
```
Transaction → Risk Analysis → Risk Score Calculated
```

### 2. High Risk Detection
```
Risk Score ≥ 50 → Pre-Dispute Alert Sent → User Notification
```

### 3. User Response
```
User Views Alert → Selects Resolution → Instant Processing
```

### 4. Resolution Outcomes
- **Confirmed**: Transaction marked as legitimate, risk score updated
- **Refund**: Immediate refund processed, chargeback prevented
- **Disputed**: Escalated to formal dispute process

## Admin Dashboard

### Metrics Displayed
- **Chargeback Rate**: Current percentage
- **Chargebacks Prevented**: Count via instant resolutions
- **Amount Saved**: Total prevented chargeback costs
- **Active Alerts**: Pending user responses
- **Resolution Rate**: % of alerts resolved
- **Average Response Time**: User response speed

### Management Tabs
1. **Pre-Dispute Alerts**: View all sent alerts and statuses
2. **Instant Resolutions**: Track successful preventions
3. **Gateway Chargebacks**: Monitor formal chargebacks
4. **Prevention Rules**: Configure risk scoring rules
5. **Evidence Library**: Manage auto-generated evidence

## API Integration

### Analyze Transaction Risk
```typescript
const { data } = await supabase.functions.invoke('analyze-chargeback-risk', {
  body: { transactionId: 'tx_123' }
});
// Returns: { riskScore, riskLevel, riskFactors, alertSent }
```

### Process Instant Resolution
```typescript
const { data } = await supabase.functions.invoke('process-instant-resolution', {
  body: {
    alertId: 'alert_123',
    resolutionType: 'full_refund',
    userFeedback: 'Did not recognize transaction'
  }
});
```

## Webhook Handlers

### Paystack Chargeback Webhook
```
POST /functions/v1/paystack-webhook
- Receives chargeback notifications
- Creates gateway_chargeback_notifications record
- Triggers evidence generation
- Submits evidence automatically
```

### Flutterwave Dispute Webhook
```
POST /functions/v1/flutterwave-webhook
- Processes dispute events
- Updates dispute status
- Generates required evidence
```

## Prevention Strategies

### 1. Velocity Checks
- Max 5 transactions per hour
- Risk score +20 if exceeded

### 2. Amount Thresholds
- Transactions > ₦50,000 flagged
- Risk score +15 for high amounts

### 3. Time-Based Rules
- Transactions 12am-6am flagged
- Risk score +10 for unusual hours

### 4. Account Age
- Accounts < 7 days old flagged
- Risk score +15 for new accounts

### 5. Failed Transaction History
- 3+ failed transactions flagged
- Risk score +25 for failure history

## Metrics & Analytics

### Daily Metrics Tracked
```sql
- total_transactions
- total_chargebacks
- chargebacks_prevented
- chargeback_rate
- total_chargeback_amount
- amount_saved
- alerts_sent
- alerts_resolved
- instant_resolutions
- average_resolution_time_seconds
- gateway_chargebacks_won
- gateway_chargebacks_lost
```

### Success Metrics
- **Target Chargeback Rate**: < 0.5%
- **Prevention Rate**: > 80% of alerts resolved
- **Response Time**: < 24 hours average
- **Win Rate**: > 60% of gateway disputes won

## Cost Savings

### Chargeback Costs Avoided
- **Chargeback Fee**: ₦2,500 per chargeback
- **Transaction Amount**: Full refund
- **Processing Time**: Admin hours saved
- **Reputation**: Maintain low chargeback ratio

### ROI Calculation
```
Prevented Chargebacks × (Transaction Amount + ₦2,500 fee)
= Total Amount Saved
```

## Best Practices

1. **Respond to Alerts Quickly**: 48-hour window
2. **Provide Detailed Evidence**: Increase win rate
3. **Monitor Risk Patterns**: Adjust rules based on data
4. **User Education**: Explain legitimate transactions
5. **Clear Descriptors**: Use recognizable merchant names

## Testing

### Test High-Risk Transaction
```typescript
// Create transaction with risk factors
const tx = await createTransaction({
  amount: 75000, // High amount
  time: '02:00', // Unusual hour
  accountAge: 3 // New account (days)
});
// Should trigger pre-dispute alert
```

### Test Instant Resolution
```typescript
// Simulate user confirming transaction
await resolveAlert({
  alertId: 'alert_123',
  resolutionType: 'confirmed',
  feedback: 'This was my purchase'
});
// Should prevent chargeback
```

## Compliance

- **PCI DSS**: Secure evidence storage
- **GDPR**: User data protection
- **PSD2**: Strong customer authentication
- **CBN Guidelines**: Nigerian banking regulations

## Future Enhancements

1. **Machine Learning Model**: Train on historical data
2. **Behavioral Biometrics**: Device fingerprinting
3. **3D Secure Integration**: Additional authentication
4. **Merchant Collaboration**: Share fraud patterns
5. **Predictive Analytics**: Forecast chargeback risk

## Support

For chargeback prevention support:
- Email: disputes@alaskapay.com
- Phone: +234-XXX-XXX-XXXX
- Dashboard: Admin → Chargeback Prevention

# 3D Secure (3DS) Authentication System

## Overview

Alaska Pay's 3D Secure authentication system provides an additional layer of security for high-risk card transactions, reducing chargebacks and shifting liability to the card issuer. The system integrates with Paystack's 3DS API and implements dynamic risk-based triggering.

## Key Features

### 1. **Dynamic Risk-Based Triggering**
- Automatic risk score calculation based on transaction amount, velocity, and user behavior
- Configurable thresholds for amount and risk score
- Multiple trigger conditions (new payment method, velocity exceeded, high-risk countries)

### 2. **Seamless Authentication Flow**
- OTP verification via SMS
- Biometric authentication support
- Frictionless authentication for low-risk transactions
- Fallback mechanisms for failed authentication

### 3. **Liability Shift Protection**
- ECI (Electronic Commerce Indicator) tracking
- CAVV (Cardholder Authentication Verification Value) storage
- Automatic liability shift documentation
- Full audit trail for compliance

### 4. **Admin Controls**
- Configurable thresholds and rules
- Exemption management (low-value, trusted beneficiary, recurring)
- Authentication method preferences
- Performance target setting

### 5. **Analytics & Monitoring**
- Success rate tracking
- Average completion time monitoring
- Chargeback prevention metrics
- Method distribution analysis

## Database Schema

### three_ds_authentications
Tracks all 3DS authentication attempts:
- Authentication status and method
- Risk assessment (score, level, trigger)
- Gateway integration data (Paystack reference, response)
- Liability shift indicators (ECI, CAVV, XID)
- Timing metrics (duration, timeout)
- Device fingerprinting and location data

### three_ds_config
Admin configuration for 3DS rules:
- Amount and risk score thresholds
- Dynamic triggering rules
- Allowed authentication methods
- Exemption rules
- Performance targets

### three_ds_metrics
Daily aggregated performance metrics:
- Volume metrics (attempts, success, failed, abandoned)
- Success and completion rates
- Timing statistics (avg, median, p95)
- Risk distribution
- Financial impact (amount authenticated, chargebacks prevented)

## Risk Scoring Algorithm

```javascript
Risk Score Calculation:
- Amount > ₦50,000: +30 points
- Amount > ₦20,000: +20 points
- Amount > ₦10,000: +10 points
- New payment method: +15 points
- Velocity exceeded: +25 points
- Failed attempts: +20 points
- High-risk country: +20 points

Risk Levels:
- 0-24: Low
- 25-49: Medium
- 50-74: High
- 75-100: Critical
```

## Authentication Flow

### 1. Transaction Initiation
```
User initiates payment
  ↓
System calculates risk score
  ↓
Check if 3DS required (amount/risk thresholds)
  ↓
If required: Create 3DS authentication record
  ↓
Initiate Paystack 3DS
```

### 2. User Authentication
```
User redirected to bank's 3DS page
  ↓
User completes authentication (OTP/biometric)
  ↓
Bank validates and returns result
  ↓
System receives callback with authentication status
```

### 3. Transaction Completion
```
Update authentication record with result
  ↓
If successful: Grant liability shift
  ↓
Process transaction with 3DS data
  ↓
Log metrics and audit trail
```

## Paystack Integration

### Initialize 3DS Transaction
```javascript
POST https://api.paystack.co/transaction/initialize
{
  "email": "user@example.com",
  "amount": 5000000, // Amount in kobo
  "currency": "NGN",
  "reference": "3DS_1234567890",
  "metadata": {
    "three_ds_id": "uuid",
    "risk_score": 65
  },
  "channels": ["card"],
  "callback_url": "https://alaskapay.com/3ds-callback"
}
```

### Verify Transaction
```javascript
GET https://api.paystack.co/transaction/verify/:reference

Response includes:
- status: success/failed
- gateway_response: "Successful"
- authorization: {
    authorization_code,
    card_type,
    last4,
    exp_month,
    exp_year
  }
```

## Configuration Options

### Threshold Settings
- **Amount Threshold**: Minimum transaction amount requiring 3DS (default: ₦10,000)
- **Risk Score Threshold**: Minimum risk score requiring 3DS (default: 50)
- **Authentication Timeout**: Maximum time for user to complete 3DS (default: 300 seconds)
- **Max Retry Attempts**: Number of retry attempts allowed (default: 3)

### Trigger Rules
- High-risk countries
- New payment method
- Velocity exceeded
- Amount spike detection
- Failed authentication attempts

### Exemptions
- **Low Value**: Transactions below threshold (default: ₦1,000)
- **Trusted Beneficiary**: Whitelisted recipients
- **Recurring Payments**: Subscription transactions

### Authentication Methods
- OTP (SMS/Email)
- Biometric (fingerprint/face)
- Mobile app authentication
- Password verification
- Frictionless (risk-based exemption)

## Success Metrics

### Performance Targets
- **Success Rate**: 95% or higher
- **Completion Time**: Under 60 seconds average
- **Abandonment Rate**: Below 5%
- **Chargeback Reduction**: 80% or higher

### Key Performance Indicators
- Total authentication attempts
- Successful authentications
- Failed authentications
- Abandoned authentications
- Liability shifts granted
- Chargebacks prevented
- Estimated savings

## Chargeback Prevention Impact

### Liability Shift Benefits
When 3DS authentication is successful:
- Liability shifts from merchant to card issuer
- Chargebacks become issuer's responsibility
- Merchant protected from fraudulent disputes
- Reduced chargeback fees and penalties

### Cost Savings Calculation
```
Average chargeback cost: ₦5,000
Chargebacks prevented per month: 50
Monthly savings: ₦250,000
Annual savings: ₦3,000,000
```

## Compliance & Security

### PCI DSS Compliance
- No card data stored locally
- All authentication via Paystack secure gateway
- Full audit trail maintained
- Encryption for sensitive data

### Data Retention
- Authentication records: 7 years
- Metrics data: 3 years
- Audit logs: 10 years
- User consent: Indefinite

### Privacy Considerations
- User consent for biometric data
- GDPR compliance for EU users
- Data minimization principles
- Right to erasure support

## API Integration

### Frontend Usage
```javascript
import { ThreeDSAuthModal } from '@/components/three-ds/ThreeDSAuthModal';

<ThreeDSAuthModal
  open={showAuth}
  onClose={() => setShowAuth(false)}
  transactionData={{
    amount: 50000,
    currency: 'NGN',
    reference: 'TXN_123',
    description: 'Payment for services'
  }}
  onSuccess={(result) => {
    console.log('3DS Success:', result);
    // Process transaction with liability shift
  }}
  onFailed={(error) => {
    console.log('3DS Failed:', error);
    // Handle authentication failure
  }}
/>
```

### Backend Integration
```javascript
// Check if 3DS is required
const { data: config } = await supabase
  .from('three_ds_config')
  .select('*')
  .eq('is_active', true)
  .single();

const riskScore = calculateRiskScore(transaction);
const requires3DS = transaction.amount >= config.amount_threshold ||
                   riskScore >= config.risk_score_threshold;

if (requires3DS) {
  // Initiate 3DS authentication
  const auth = await initiate3DS(transaction);
  return { requires3ds: true, authUrl: auth.authorizationUrl };
}
```

## Troubleshooting

### Common Issues

**Authentication Timeout**
- Increase timeout in config (default: 300s)
- Check user's network connectivity
- Verify Paystack API availability

**High Abandonment Rate**
- Review user experience flow
- Reduce friction for low-risk users
- Enable frictionless authentication
- Optimize mobile experience

**Low Success Rate**
- Check OTP delivery issues
- Verify SMS provider status
- Review authentication method preferences
- Analyze failure reasons

**Liability Shift Not Granted**
- Verify ECI values received
- Check CAVV data completeness
- Ensure proper Paystack integration
- Review authentication flow logs

## Best Practices

1. **Balance Security & UX**
   - Use risk-based triggering
   - Enable frictionless for low-risk
   - Optimize mobile experience

2. **Monitor Performance**
   - Track success rates daily
   - Set up alerts for anomalies
   - Review abandonment patterns

3. **Regular Configuration Review**
   - Adjust thresholds based on data
   - Update exemption rules
   - Optimize trigger conditions

4. **User Communication**
   - Explain why 3DS is required
   - Provide clear instructions
   - Offer support for issues

5. **Compliance Maintenance**
   - Keep audit trails complete
   - Document configuration changes
   - Regular security reviews

## Future Enhancements

- [ ] 3DS 2.2 protocol support
- [ ] Biometric authentication via WebAuthn
- [ ] Machine learning risk scoring
- [ ] Real-time fraud detection integration
- [ ] Multi-factor authentication options
- [ ] Enhanced mobile SDK
- [ ] White-label authentication UI
- [ ] Advanced analytics dashboard

## Support

For technical support or questions:
- Email: support@alaskapay.com
- Documentation: https://docs.alaskapay.com/3ds
- API Reference: https://api.alaskapay.com/docs

---

**Last Updated**: October 10, 2025
**Version**: 1.0.0
**Status**: Production Ready

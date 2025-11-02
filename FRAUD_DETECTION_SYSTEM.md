# Fraud Detection System

## Overview
Comprehensive velocity-based fraud detection system that monitors transaction patterns and automatically flags suspicious activity.

## Database Tables

### fraud_detection_rules
Configurable fraud detection rules with thresholds and actions.
- `rule_type`: velocity, amount, geographic, device, pattern
- `severity`: low, medium, high, critical
- `action`: flag, block, review, alert
- `threshold_config`: JSON configuration for rule parameters

### transaction_fraud_flags
Records of flagged transactions with risk scores.
- `risk_score`: 0-100 calculated risk level
- `status`: pending, reviewing, approved, rejected, false_positive
- `flag_reason`: Human-readable explanation

### device_fingerprints
Tracks user devices for anomaly detection.
- `fingerprint_hash`: Unique device identifier
- `is_trusted`: Manually approved devices
- `flagged_count`: Number of fraud flags

### transaction_velocity_logs
Tracks all transactions for velocity analysis.

### user_risk_scores
Historical risk score tracking per user.

## Edge Functions

### check-fraud-risk
Real-time fraud risk assessment.
- Checks velocity (transactions per time window)
- Analyzes amount anomalies (deviation from average)
- Detects geographic anomalies
- Validates device trust
- Returns risk score and triggered rules

### manage-fraud-rules
CRUD operations for fraud detection rules.
- list, create, update, delete, toggle rules

### review-fraud-flag
Admin review workflow for flagged transactions.
- Approve, reject, or mark as false positive
- Updates device trust on false positives

## Default Rules
1. High Velocity: >5 transactions in 10 minutes
2. Unusual Amount: 3x user average
3. Geographic Anomaly: >500km in 1 hour
4. New Device High Amount: >$500 on new device
5. Rapid Small Transactions: >10 transactions <$50 in 30 min

## Admin Dashboard
- Fraud analytics with key metrics
- Flagged transactions panel with review workflow
- Rules manager with toggle and configuration
- Risk score visualization

## Integration
Add fraud checks before processing transactions:
```typescript
const { data: riskCheck } = await supabase.functions.invoke('check-fraud-risk', {
  body: { userId, amount, transactionType, deviceInfo, ipAddress, locationData }
});

if (riskCheck.shouldBlock) {
  // Block transaction
} else if (riskCheck.shouldReview) {
  // Flag for manual review
}
```

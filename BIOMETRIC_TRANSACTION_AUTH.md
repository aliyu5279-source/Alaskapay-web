# Biometric Transaction Authentication

## Overview
AlaskaPay now supports biometric authentication (Face ID/Touch ID/Fingerprint) as an alternative to PIN entry for transaction verification across all wallet operations.

## Features

### 1. Biometric Transaction Verification
- Users can enable biometric authentication for transactions in settings
- Automatically prompts for biometric auth when enabled
- Falls back to PIN entry if biometric fails or is unavailable
- Works for all transaction types: transfers, withdrawals, bill payments, and card operations

### 2. User Settings
- **Location**: Dashboard → Security Settings → Biometric Authentication
- **Toggle**: "Use [Face ID/Touch ID/Fingerprint] for Transactions"
- **Description**: "Verify transfers, withdrawals, and payments with biometrics"
- Requires biometric authentication to enable the feature

### 3. Transaction Flow
1. User initiates transaction (transfer, withdrawal, bill payment, card funding)
2. System checks if biometric transaction auth is enabled
3. If enabled:
   - Automatically triggers biometric authentication
   - On success: Transaction proceeds immediately
   - On failure: Falls back to PIN entry with "Please enter your PIN instead" message
4. If disabled or unavailable:
   - Shows standard PIN entry modal

### 4. Supported Operations
- ✅ Wallet transfers (TransferModal)
- ✅ Wallet withdrawals (WithdrawModal)
- ✅ Bill payments (PayBillModal)
- ✅ Virtual card funding (FundCardModal)
- ✅ Virtual card creation (CreateVirtualCardModal)

## Implementation Details

### Database Schema
```sql
-- Added to profiles table
ALTER TABLE profiles 
ADD COLUMN biometric_transaction_auth BOOLEAN DEFAULT false;
```

### Components Updated

#### PINVerificationModal
- Added biometric authentication support
- Auto-triggers biometric auth when enabled
- Shows "Use [Biometric Type]" button
- Displays "Or enter PIN" divider
- Falls back to PIN on biometric failure

#### BiometricSettings
- New toggle: "Use [Biometric Type] for Transactions"
- Requires biometric auth to enable
- Persists preference to database
- Loads setting on component mount

### User Experience

#### With Biometric Enabled
```
1. User clicks "Transfer Funds"
2. PIN modal opens
3. Biometric prompt appears automatically
4. User authenticates with Face ID/Touch ID
5. Transaction proceeds immediately
```

#### Biometric Failure Flow
```
1. User clicks "Transfer Funds"
2. PIN modal opens
3. Biometric prompt appears
4. User cancels or fails biometric
5. Toast: "Authentication Failed - Please enter your PIN instead"
6. PIN entry field available for manual entry
```

#### With Biometric Disabled
```
1. User clicks "Transfer Funds"
2. PIN modal opens
3. Only PIN entry field shown
4. User enters 4-digit PIN
5. Transaction proceeds after verification
```

## Security Features

1. **Biometric Verification Required**: Users must authenticate with biometrics to enable the feature
2. **PIN Fallback**: Always available if biometric fails
3. **Device-Level Security**: Uses native device biometric APIs
4. **Attempt Tracking**: Failed PIN attempts still tracked and locked
5. **SMS Recovery**: "Forgot PIN?" link available for account recovery

## Benefits

### For Users
- **Faster Transactions**: No need to type 4-digit PIN
- **Enhanced Security**: Biometric authentication is more secure than PIN
- **Convenience**: One-touch authentication for all transactions
- **Flexibility**: Can still use PIN if needed

### For Security
- **Multi-Factor**: Combines biometric + device possession
- **Non-Repudiation**: Biometric auth provides strong user identity verification
- **Reduced PIN Exposure**: Less frequent PIN entry reduces shoulder surfing risk
- **Device Binding**: Biometric tied to specific device

## Configuration

### Enable Biometric Transaction Auth
1. Navigate to Dashboard
2. Go to Security Settings
3. Find "Biometric Authentication" section
4. Toggle "Use [Biometric Type] for Transactions"
5. Authenticate with biometrics to confirm
6. Feature is now enabled for all transactions

### Disable Biometric Transaction Auth
1. Navigate to Dashboard
2. Go to Security Settings
3. Find "Biometric Authentication" section
4. Toggle off "Use [Biometric Type] for Transactions"
5. Confirmation toast appears
6. All transactions will now require PIN entry

## Technical Implementation

### Biometric Check Flow
```typescript
const checkBiometricSettings = async () => {
  if (!isAvailable) return;
  
  const { data } = await supabase
    .from('profiles')
    .select('biometric_transaction_auth')
    .eq('id', user.id)
    .single();

  if (data?.biometric_transaction_auth) {
    setBiometricEnabled(true);
    setShowBiometricOption(true);
    handleBiometricAuth(); // Auto-trigger
  }
};
```

### Biometric Authentication
```typescript
const handleBiometricAuth = async () => {
  const success = await authenticate('Verify transaction');
  if (success) {
    onVerified();
    onOpenChange(false);
  } else {
    toast({ 
      title: 'Authentication Failed', 
      description: 'Please enter your PIN instead',
      variant: 'destructive' 
    });
  }
};
```

## Compatibility

### Supported Platforms
- ✅ iOS (Face ID, Touch ID)
- ✅ Android (Fingerprint, Face Authentication)
- ❌ Web (Falls back to PIN only)

### Biometric Types
- **Face ID** (iOS)
- **Touch ID** (iOS)
- **Fingerprint** (Android)
- **Face Authentication** (Android)
- **Iris Authentication** (Android)

## Best Practices

1. **Always Provide PIN Fallback**: Never force biometric-only authentication
2. **Clear Error Messages**: Inform users why biometric failed and next steps
3. **Auto-Trigger**: Automatically show biometric prompt when enabled
4. **Visual Feedback**: Show biometric button and divider in UI
5. **Graceful Degradation**: Work seamlessly on devices without biometric support

## Future Enhancements

1. **Biometric-Only Mode**: Option to disable PIN fallback for high-security users
2. **Transaction Amount Threshold**: Require biometric only for amounts over threshold
3. **Time-Based Requirements**: Require re-authentication after certain time period
4. **Multi-Biometric Support**: Support multiple biometric types on same device
5. **Biometric Analytics**: Track biometric success/failure rates

## Related Documentation
- [BIOMETRIC_AUTH.md](BIOMETRIC_AUTH.md) - Biometric login system
- [TRANSACTION_PIN_INTEGRATION.md](TRANSACTION_PIN_INTEGRATION.md) - PIN verification system
- [VIRTUAL_CARD_PIN_INTEGRATION.md](VIRTUAL_CARD_PIN_INTEGRATION.md) - Card operation PIN verification

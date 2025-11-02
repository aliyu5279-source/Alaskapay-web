# 💳 In-App Purchase Setup - Complete Guide

## Overview
AlaskaPay offers two premium subscription tiers with enhanced features and benefits.

## Subscription Tiers

### Premium Tier 1 (₦999/month)
**Product IDs**:
- iOS: `com.alaskapay.premium.tier1`
- Android: `premium_tier_1`

**Benefits**:
- Higher transaction limits (₦100,000/day → ₦500,000/day)
- Priority customer support (24/7 chat)
- Zero transfer fees (save ₦50 per transfer)
- Advanced analytics dashboard
- Transaction export (CSV, PDF)
- Custom categories
- Budget alerts
- No ads

**Free Trial**: 7 days

### Premium Tier 2 (₦2,999/month)
**Product IDs**:
- iOS: `com.alaskapay.premium.tier2`
- Android: `premium_tier_2`

**Benefits**:
- All Tier 1 benefits
- Unlimited transactions
- Dedicated account manager
- API access for developers
- Custom financial reports
- White-label options
- Early access to new features
- Priority feature requests
- Advanced fraud protection

**Free Trial**: 14 days

## iOS Setup (App Store Connect)

### 1. Create Subscription Group
```
Group Name: AlaskaPay Premium
Reference Name: alaskapay_premium_group
```

### 2. Add Subscriptions

**Tier 1**:
```
Reference Name: Premium Tier 1
Product ID: com.alaskapay.premium.tier1
Duration: 1 month
Price: ₦999 (or equivalent in other currencies)
Free Trial: 7 days
Subscription Group: AlaskaPay Premium
```

**Tier 2**:
```
Reference Name: Premium Tier 2
Product ID: com.alaskapay.premium.tier2
Duration: 1 month
Price: ₦2,999
Free Trial: 14 days
Subscription Group: AlaskaPay Premium
```

### 3. Localization
Add descriptions for each subscription:
```
Display Name: Premium Tier 1
Description: Unlock higher limits, priority support, and zero fees. Perfect for frequent users.

Display Name: Premium Tier 2
Description: Ultimate AlaskaPay experience with unlimited transactions, API access, and dedicated support.
```

### 4. App Store Server Notifications
```
URL: https://your-api.alaskapay.com/webhooks/apple-subscriptions
Version: Version 2
```

### 5. Subscription Status URL
```
URL: https://alaskapay.com/subscription/manage
```

## Android Setup (Google Play Console)

### 1. Create Subscriptions

**Tier 1**:
```
Product ID: premium_tier_1
Name: Premium Tier 1
Description: Higher limits, priority support, zero fees
Base plans:
  - Monthly (₦999)
  - Free trial: 7 days
  - Grace period: 3 days
  - Auto-renewing: Yes
```

**Tier 2**:
```
Product ID: premium_tier_2
Name: Premium Tier 2
Description: Unlimited transactions, API access, dedicated support
Base plans:
  - Monthly (₦2,999)
  - Free trial: 14 days
  - Grace period: 3 days
  - Auto-renewing: Yes
```

### 2. Subscription Benefits
```
Tier 1 Benefits:
• Higher transaction limits
• Priority support
• Zero transfer fees
• Advanced analytics
• Transaction export

Tier 2 Benefits:
• All Tier 1 benefits
• Unlimited transactions
• API access
• Custom reports
• Dedicated manager
```

### 3. Real-time Developer Notifications
```
Topic name: alaskapay-subscriptions
Enable notifications: Yes
```

### 4. Subscription Deep Links
```
Tier 1: https://play.google.com/store/account/subscriptions?sku=premium_tier_1&package=com.alaskapay.app
Tier 2: https://play.google.com/store/account/subscriptions?sku=premium_tier_2&package=com.alaskapay.app
```

## Implementation

### iOS (Swift/React Native)
```swift
// In your iOS app
import StoreKit

class SubscriptionManager {
    static let shared = SubscriptionManager()
    
    let productIDs = [
        "com.alaskapay.premium.tier1",
        "com.alaskapay.premium.tier2"
    ]
    
    func purchaseSubscription(productID: String) {
        // Purchase logic
    }
    
    func restorePurchases() {
        // Restore logic
    }
    
    func checkSubscriptionStatus() {
        // Check status
    }
}
```

### Android (Kotlin/React Native)
```kotlin
// In your Android app
import com.android.billingclient.api.*

class SubscriptionManager(private val context: Context) {
    private lateinit var billingClient: BillingClient
    
    fun initializeBilling() {
        billingClient = BillingClient.newBuilder(context)
            .setListener(purchaseUpdateListener)
            .enablePendingPurchases()
            .build()
    }
    
    fun purchaseSubscription(productId: String) {
        // Purchase logic
    }
    
    fun checkSubscriptionStatus() {
        // Check status
    }
}
```

### React Native (Capacitor)
```typescript
import { Purchases } from '@revenuecat/purchases-capacitor';

// Initialize RevenueCat
await Purchases.configure({
  apiKey: 'your_revenuecat_api_key',
  appUserID: userId
});

// Purchase subscription
const purchaseSubscription = async (productId: string) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage({
      identifier: productId
    });
    
    // Verify purchase on backend
    await verifyPurchase(customerInfo);
  } catch (error) {
    console.error('Purchase failed:', error);
  }
};

// Check subscription status
const checkSubscription = async () => {
  const { customerInfo } = await Purchases.getCustomerInfo();
  return customerInfo.entitlements.active['premium'] !== undefined;
};
```

## Backend Verification

### Server-Side Validation (Required)
```typescript
// Supabase Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { platform, receipt, userId } = await req.json();
  
  if (platform === 'ios') {
    // Verify with Apple
    const response = await fetch('https://buy.itunes.apple.com/verifyReceipt', {
      method: 'POST',
      body: JSON.stringify({
        'receipt-data': receipt,
        'password': Deno.env.get('APPLE_SHARED_SECRET')
      })
    });
    
    const data = await response.json();
    
    if (data.status === 0) {
      // Valid subscription
      await updateUserSubscription(userId, data.latest_receipt_info);
    }
  } else if (platform === 'android') {
    // Verify with Google
    const response = await fetch(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${productId}/tokens/${purchaseToken}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    const data = await response.json();
    
    if (data.paymentState === 1) {
      // Valid subscription
      await updateUserSubscription(userId, data);
    }
  }
  
  return new Response(JSON.stringify({ success: true }));
});
```

### Database Schema
```sql
-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  platform TEXT NOT NULL, -- 'ios' or 'android'
  product_id TEXT NOT NULL,
  tier TEXT NOT NULL, -- 'tier1' or 'tier2'
  status TEXT NOT NULL, -- 'active', 'cancelled', 'expired'
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  trial_end_date TIMESTAMPTZ,
  original_transaction_id TEXT,
  latest_receipt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

## Webhook Handling

### Apple Server Notifications
```typescript
// Handle Apple subscription events
export async function handleAppleWebhook(notification: any) {
  const { notification_type, unified_receipt } = notification;
  
  switch (notification_type) {
    case 'INITIAL_BUY':
      await activateSubscription(unified_receipt);
      break;
    case 'DID_RENEW':
      await renewSubscription(unified_receipt);
      break;
    case 'DID_FAIL_TO_RENEW':
      await handleRenewalFailure(unified_receipt);
      break;
    case 'CANCEL':
      await cancelSubscription(unified_receipt);
      break;
    case 'REFUND':
      await handleRefund(unified_receipt);
      break;
  }
}
```

### Google Play Notifications
```typescript
// Handle Google subscription events
export async function handleGoogleWebhook(notification: any) {
  const { subscriptionNotification } = notification;
  const { notificationType, purchaseToken } = subscriptionNotification;
  
  switch (notificationType) {
    case 1: // SUBSCRIPTION_RECOVERED
      await recoverSubscription(purchaseToken);
      break;
    case 2: // SUBSCRIPTION_RENEWED
      await renewSubscription(purchaseToken);
      break;
    case 3: // SUBSCRIPTION_CANCELED
      await cancelSubscription(purchaseToken);
      break;
    case 4: // SUBSCRIPTION_PURCHASED
      await activateSubscription(purchaseToken);
      break;
    case 13: // SUBSCRIPTION_EXPIRED
      await expireSubscription(purchaseToken);
      break;
  }
}
```

## Feature Gating

### Check Subscription Status
```typescript
export async function hasFeatureAccess(
  userId: string, 
  feature: string
): Promise<boolean> {
  const subscription = await supabase
    .from('subscriptions')
    .select('tier, status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  
  if (!subscription.data) return false;
  
  const tier = subscription.data.tier;
  
  // Feature access matrix
  const features = {
    'higher_limits': ['tier1', 'tier2'],
    'priority_support': ['tier1', 'tier2'],
    'zero_fees': ['tier1', 'tier2'],
    'analytics': ['tier1', 'tier2'],
    'api_access': ['tier2'],
    'white_label': ['tier2'],
    'dedicated_manager': ['tier2']
  };
  
  return features[feature]?.includes(tier) || false;
}
```

## Testing

### iOS Sandbox Testing
1. Create sandbox tester account in App Store Connect
2. Sign out of App Store on device
3. Install app and make purchase
4. Sign in with sandbox account when prompted

### Android Testing
1. Add test account in Play Console
2. Use license testing response
3. Test with real payment method (will not be charged)

## Troubleshooting

### Purchase Not Completing
- Check product IDs match exactly
- Verify app is signed correctly
- Ensure billing is set up in console
- Check network connectivity

### Receipt Validation Failing
- Verify shared secret (iOS)
- Check service account permissions (Android)
- Ensure receipt is base64 encoded
- Use correct environment (sandbox vs production)

---

**Ready to Launch?** Test thoroughly before going live!

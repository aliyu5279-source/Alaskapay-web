# 🔔 Push Notification Campaigns - Complete Guide

## Overview
AlaskaPay uses targeted push notification campaigns to engage users, drive retention, and increase feature adoption.

## Campaign Types

### 1. Onboarding Campaigns

#### Welcome Series (Days 0-7)
```
Day 0 - Welcome:
Title: "Welcome to AlaskaPay! 🎉"
Body: "Get started with ₦1,000 bonus. Complete your profile now!"
Action: Open app → Profile completion

Day 1 - First Transaction:
Title: "Ready to send money?"
Body: "Make your first transfer and earn ₦500 bonus!"
Action: Open app → Transfer screen

Day 3 - Feature Discovery:
Title: "Did you know? 💡"
Body: "Pay bills, buy airtime, and create virtual cards all in one app!"
Action: Open app → Features tour

Day 7 - Referral:
Title: "Share the love ❤️"
Body: "Invite friends and earn ₦500 per referral!"
Action: Open app → Referral screen
```

### 2. Engagement Campaigns

#### Transaction Reminders
```
Inactive 3 days:
Title: "We miss you!"
Body: "Your wallet is waiting. Send money in seconds!"
Action: Open app → Dashboard

Inactive 7 days:
Title: "Special offer inside 🎁"
Body: "Get 50% off transfer fees for the next 24 hours!"
Action: Open app → Promo screen

Inactive 14 days:
Title: "Your ₦1,000 bonus expires soon!"
Body: "Use it before it's gone. Tap to claim now!"
Action: Open app → Wallet
```

#### Feature Adoption
```
Virtual Cards:
Title: "Create your first virtual card"
Body: "Shop online safely with instant virtual cards!"
Action: Open app → Virtual cards

Bill Payments:
Title: "Pay bills in 30 seconds ⚡"
Body: "Airtime, data, electricity - all in one place!"
Action: Open app → Bills

QR Payments:
Title: "Scan to pay instantly"
Body: "Try contactless payments with QR codes!"
Action: Open app → QR scanner
```

### 3. Transactional Notifications

#### Real-time Alerts
```
Payment Received:
Title: "Payment received! 💰"
Body: "You received ₦5,000 from John Doe"
Action: Open app → Transaction details

Payment Sent:
Title: "Payment successful ✓"
Body: "₦2,000 sent to Jane Smith"
Action: Open app → Receipt

Low Balance:
Title: "Low balance alert"
Body: "Your wallet balance is below ₦500. Top up now?"
Action: Open app → Top up

Bill Payment Due:
Title: "Bill payment reminder"
Body: "Your electricity bill is due tomorrow (₦3,000)"
Action: Open app → Pay bill
```

### 4. Promotional Campaigns

#### Seasonal Offers
```
Holiday Special:
Title: "Holiday bonus! 🎄"
Body: "Send money with 0% fees this weekend only!"
Action: Open app → Transfer
Schedule: Dec 24-26

New Year:
Title: "New Year, New Goals 🎊"
Body: "Start 2024 with Premium - 50% off first month!"
Action: Open app → Subscription
Schedule: Jan 1-7

Valentine's:
Title: "Spread the love ❤️"
Body: "Send gifts instantly. Free transfers all day!"
Action: Open app → Transfer
Schedule: Feb 14
```

#### Referral Campaigns
```
Referral Boost:
Title: "2x referral bonus this week!"
Body: "Earn ₦1,000 per friend instead of ₦500!"
Action: Open app → Referral
Duration: 7 days

Milestone Celebration:
Title: "You've referred 5 friends! 🎉"
Body: "Claim your ₦5,000 bonus now!"
Action: Open app → Rewards
Trigger: 5 referrals
```

### 5. Retention Campaigns

#### Win-back Series
```
Week 2 Inactive:
Title: "Come back for ₦500 bonus!"
Body: "We've added new features you'll love!"
Action: Open app → What's new

Week 4 Inactive:
Title: "Your friends are using AlaskaPay"
Body: "Join them and get ₦1,000 welcome back bonus!"
Action: Open app → Dashboard

Week 8 Inactive:
Title: "We want you back! 💙"
Body: "Here's ₦2,000 to get you started again!"
Action: Open app → Claim bonus
```

## User Segmentation

### Segments
```typescript
export const userSegments = {
  new_users: {
    condition: 'created_at > NOW() - INTERVAL \'7 days\'',
    campaigns: ['onboarding', 'welcome_series']
  },
  
  active_users: {
    condition: 'last_transaction_at > NOW() - INTERVAL \'7 days\'',
    campaigns: ['feature_adoption', 'promotional']
  },
  
  inactive_users: {
    condition: 'last_transaction_at < NOW() - INTERVAL \'14 days\'',
    campaigns: ['win_back', 'special_offers']
  },
  
  high_value: {
    condition: 'total_transaction_volume > 100000',
    campaigns: ['premium_offers', 'vip_features']
  },
  
  low_engagement: {
    condition: 'transaction_count < 5 AND created_at < NOW() - INTERVAL \'30 days\'',
    campaigns: ['engagement_boost', 'tutorial_reminders']
  }
};
```

## Campaign Scheduling

### Optimal Send Times
```typescript
export const sendTimes = {
  weekday_morning: '09:00', // Best for transactional
  weekday_afternoon: '14:00', // Good for promotional
  weekday_evening: '18:00', // Best for engagement
  weekend_morning: '10:00', // Good for leisure
  weekend_afternoon: '15:00' // Best for promotional
};

// Avoid sending:
// - Late night (22:00 - 07:00)
// - During work hours (10:00 - 12:00)
// - Public holidays
```

### Frequency Caps
```typescript
export const frequencyCaps = {
  max_per_day: 3,
  max_per_week: 10,
  min_interval_hours: 4,
  
  // By type
  transactional: 'unlimited', // Always send
  promotional: 2, // Max 2 per day
  engagement: 1 // Max 1 per day
};
```

## Implementation

### Campaign Database Schema
```sql
CREATE TABLE notification_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'onboarding', 'engagement', 'promotional'
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  target_segment TEXT,
  schedule_type TEXT, -- 'immediate', 'scheduled', 'triggered'
  schedule_time TIMESTAMPTZ,
  trigger_event TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES notification_campaigns(id),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  error TEXT
);
```

### Send Campaign Function
```typescript
export async function sendCampaign(campaignId: string) {
  const campaign = await getCampaign(campaignId);
  const users = await getTargetUsers(campaign.target_segment);
  
  for (const user of users) {
    // Check frequency cap
    if (await shouldSendToUser(user.id, campaign.type)) {
      await sendPushNotification({
        userId: user.id,
        title: campaign.title,
        body: campaign.body,
        data: {
          campaign_id: campaignId,
          action_url: campaign.action_url
        }
      });
      
      // Log notification
      await logNotification({
        campaign_id: campaignId,
        user_id: user.id,
        title: campaign.title,
        body: campaign.body
      });
    }
  }
  
  // Update campaign stats
  await updateCampaignStats(campaignId);
}
```

### Triggered Campaigns
```typescript
// Trigger on specific events
export async function onTransactionComplete(transaction: Transaction) {
  await sendPushNotification({
    userId: transaction.user_id,
    title: 'Payment successful ✓',
    body: `₦${transaction.amount.toLocaleString()} sent to ${transaction.recipient_name}`,
    data: {
      type: 'transaction',
      transaction_id: transaction.id,
      action_url: `/transactions/${transaction.id}`
    }
  });
}

export async function onLowBalance(userId: string, balance: number) {
  await sendPushNotification({
    userId,
    title: 'Low balance alert',
    body: `Your balance is ₦${balance}. Top up now?`,
    data: {
      type: 'low_balance',
      action_url: '/wallet/topup'
    }
  });
}
```

## Analytics & Optimization

### Track Campaign Performance
```typescript
export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  conversion: number;
  
  // Rates
  delivery_rate: number; // delivered / sent
  open_rate: number; // opened / delivered
  click_rate: number; // clicked / opened
  conversion_rate: number; // conversion / clicked
}

export async function getCampaignMetrics(
  campaignId: string
): Promise<CampaignMetrics> {
  const logs = await supabase
    .from('notification_logs')
    .select('*')
    .eq('campaign_id', campaignId);
  
  const sent = logs.data.length;
  const delivered = logs.data.filter(l => l.delivered_at).length;
  const opened = logs.data.filter(l => l.opened_at).length;
  const clicked = logs.data.filter(l => l.clicked_at).length;
  
  return {
    sent,
    delivered,
    opened,
    clicked,
    conversion: 0, // Calculate based on goal
    delivery_rate: delivered / sent,
    open_rate: opened / delivered,
    click_rate: clicked / opened,
    conversion_rate: 0
  };
}
```

### A/B Testing
```typescript
export async function createABTest(
  campaignA: Campaign,
  campaignB: Campaign,
  splitPercentage: number = 50
) {
  const users = await getTargetUsers(campaignA.target_segment);
  const splitIndex = Math.floor(users.length * (splitPercentage / 100));
  
  const groupA = users.slice(0, splitIndex);
  const groupB = users.slice(splitIndex);
  
  await sendCampaignToUsers(campaignA, groupA);
  await sendCampaignToUsers(campaignB, groupB);
  
  // Track and compare results
  setTimeout(async () => {
    const metricsA = await getCampaignMetrics(campaignA.id);
    const metricsB = await getCampaignMetrics(campaignB.id);
    
    const winner = metricsA.conversion_rate > metricsB.conversion_rate 
      ? campaignA 
      : campaignB;
    
    console.log('Winner:', winner.name);
  }, 24 * 60 * 60 * 1000); // Check after 24 hours
}
```

## Best Practices

### Do's
✓ Personalize messages with user's name
✓ Use emojis sparingly and appropriately
✓ Keep messages short and actionable
✓ Test different times and days
✓ Segment users for relevance
✓ Track and optimize performance
✓ Respect user preferences
✓ Provide value in every message

### Don'ts
✗ Send too frequently (spam)
✗ Use ALL CAPS or excessive punctuation!!!
✗ Send at inappropriate times
✗ Ignore opt-out requests
✗ Use misleading titles
✗ Send without clear action
✗ Forget to test before sending
✗ Ignore analytics data

## Compliance

### User Consent
- Request permission on first app open
- Explain benefits of notifications
- Allow granular control (types of notifications)
- Easy opt-out mechanism
- Respect "Do Not Disturb" settings

### Privacy
- Don't include sensitive data in notifications
- Use secure deep links
- Encrypt notification payloads
- Log only necessary data
- Comply with GDPR/local regulations

---

**Ready to Launch Campaigns?** Start with onboarding series!

# Referral Program System

Comprehensive referral program with tiered rewards, tracking, and analytics.

## Features

### User Features
- **Unique Referral Codes**: Auto-generated 8-character codes
- **Social Sharing**: Share via Facebook, Twitter, Email
- **Tiered Rewards**: Bronze, Silver, Gold, Platinum tiers
- **Real-time Stats**: Track referrals, earnings, success rate
- **Referral History**: View all referrals and their status

### Admin Features
- **Referral Management**: View top referrers and statistics
- **Tier Configuration**: Manage reward amounts per tier
- **Analytics Dashboard**: Track program performance
- **Reward Management**: Approve and process rewards

## Database Tables

### referral_codes
- Stores unique referral codes per user
- Tracks total referrals and earnings
- Manages tier progression

### referrals
- Tracks referee signups
- Links referrer to referee
- Manages referral status (pending, completed, rewarded)

### referral_rewards
- Records all reward transactions
- Tracks payment status
- Supports multiple reward types

### referral_tiers
- Defines tier requirements
- Sets reward amounts
- Configures bonus percentages

## Edge Functions

### manage-referral-code
- GET: Retrieve or create referral code
- STATS: Get referral statistics

### track-referral
- SIGNUP: Track new referral signup
- COMPLETE: Complete referral on qualifying transaction

## Usage

### User Dashboard
Navigate to `/dashboard` and access "Referral Program" to:
1. View your referral code and stats
2. Share your referral link
3. Track referral history
4. See tier progression

### Admin Panel
Access admin dashboard → Referral Program to:
1. View program statistics
2. Manage top referrers
3. Configure tier settings
4. Process rewards

## Reward Tiers

- **Bronze**: 0+ referrals - $10 referrer, $5 referee
- **Silver**: 5+ referrals - $15 referrer, $7.50 referee (+10% bonus)
- **Gold**: 15+ referrals - $25 referrer, $10 referee (+20% bonus)
- **Platinum**: 50+ referrals - $50 referrer, $15 referee (+30% bonus)

## Integration

Referral tracking automatically triggers on:
1. User signup with referral code
2. First qualifying transaction (default: $50+)
3. Reward distribution to both parties

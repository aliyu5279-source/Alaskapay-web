# AlaskaPay Database Setup Guide

## Quick Setup

### 1. Prerequisites
- Node.js 18+ installed
- Supabase CLI installed (`npm install -g supabase`)
- Supabase project created
- `.env` file configured with Supabase credentials

### 2. Automated Setup
```bash
# Make script executable
chmod +x scripts/setup-database.sh

# Run setup
./scripts/setup-database.sh
```

This will:
- Link to your Supabase project
- Run all migrations
- Seed initial data (currencies, banks)
- Set up all tables and policies

### 3. Manual Setup (Alternative)

#### Link Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

#### Run Migrations
```bash
supabase db push
```

#### Seed Data
```bash
node scripts/seed-database.js
```

## Database Structure

### Core Tables

**Users & Authentication**
- `users` - User accounts and profiles
- `profiles` - Extended user profile data
- `sessions` - Active user sessions
- `mfa_methods` - Multi-factor authentication
- `trusted_devices` - Trusted device tracking
- `biometric_devices` - Biometric authentication

**Wallet & Transactions**
- `wallets` - User wallet balances
- `transactions` - All financial transactions
- `payment_methods` - Saved payment methods
- `wallet_accounts` - Multi-currency wallets

**KYC & Verification**
- `kyc_submissions` - KYC verification requests
- `kyc_tier_limits` - Transaction limits by tier
- `transaction_limits` - User-specific limits

**Payments**
- `bill_payments` - Bill payment transactions
- `bill_payees` - Available billers
- `saved_billers` - User saved billers
- `scheduled_bill_payments` - Recurring payments
- `bank_transfers` - Bank transfer records
- `saved_beneficiaries` - Saved transfer recipients

**Virtual Cards**
- `virtual_cards` - User virtual cards
- `virtual_card_funding` - Card funding history

**Referrals & Commissions**
- `referral_codes` - User referral codes
- `referral_reward_rules` - Reward configuration
- `commission_rules` - Commission calculation rules

**Support**
- `support_tickets` - Customer support tickets
- `support_messages` - Ticket messages
- `chat_conversations` - Live chat sessions
- `chat_messages` - Chat message history

**Admin & Monitoring**
- `admin_audit_logs` - Admin action tracking
- `admin_notifications` - Admin alerts
- `fraud_alerts` - Fraud detection alerts
- `webhook_endpoints` - Webhook configurations
- `webhook_delivery_logs` - Webhook delivery tracking

**Email & Notifications**
- `email_templates` - Email template library
- `email_sends` - Email delivery tracking
- `email_campaigns` - Marketing campaigns
- `user_segments` - User segmentation
- `push_subscriptions` - Push notification subscriptions

**Subscriptions**
- `subscription_plans` - Available plans
- `subscriptions` - User subscriptions
- `subscription_invoices` - Billing invoices
- `dunning_management` - Failed payment handling

**Compliance**
- `compliance_requirements` - Regulatory requirements
- `regulatory_submissions` - Compliance reports
- `three_ds_authentications` - 3D Secure records

## Verification

Check if setup was successful:

```bash
# List all tables
supabase db list

# Check specific table
supabase db query "SELECT COUNT(*) FROM users;"
```

## Troubleshooting

### Migration Errors
If migrations fail:
```bash
# Reset database (WARNING: Deletes all data)
supabase db reset

# Re-run setup
./scripts/setup-database.sh
```

### Connection Issues
Verify `.env` configuration:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Seed Data Issues
Run seed script manually:
```bash
node scripts/seed-database.js
```

## Next Steps

After database setup:
1. Start development server: `npm run dev`
2. Create admin user in Supabase dashboard
3. Test authentication flow
4. Configure payment gateways (see `PAYMENT_GATEWAY_SETUP.md`)

## Support

For issues:
- Check logs: `supabase logs`
- View migrations: `supabase migration list`
- Documentation: `QUICK_START.md`

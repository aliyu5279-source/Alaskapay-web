# Supabase Setup Commands

## Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Or using homebrew (Mac)
brew install supabase/tap/supabase
```

## Login to Supabase

```bash
supabase login
```

This opens browser for authentication.

## Link Your Project

```bash
supabase link --project-ref psafbcbhbidnbzfsccsu
```

Enter your database password when prompted.

## Run Database Migrations

```bash
# Push all migrations to Supabase
supabase db push

# Or run specific migration
supabase migration up
```

## Seed Database

```bash
# Run seed script
node scripts/seed-database.js
```

This adds:
- Nigerian banks (including Taj Bank)
- Currencies (NGN, USD, EUR, GBP)
- Bill payment providers
- Commission rules

## Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy verify-paystack-payment
supabase functions deploy paystack-webhook
supabase functions deploy process-bill-commission
supabase functions deploy settle-commission-paystack
supabase functions deploy send-push-notification
supabase functions deploy send-transactional-email
```

## Set Function Secrets

```bash
# Paystack secret key
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_key

# VAPID keys for push notifications
supabase secrets set VAPID_PUBLIC_KEY=your_public_key
supabase secrets set VAPID_PRIVATE_KEY=your_private_key

# SendGrid for emails
supabase secrets set SENDGRID_API_KEY=your_sendgrid_key
```

## View Function Logs

```bash
# View logs for specific function
supabase functions logs paystack-webhook

# Follow logs in real-time
supabase functions logs paystack-webhook --follow
```

## Test Functions Locally

```bash
# Serve function locally
supabase functions serve verify-paystack-payment

# Test with curl
curl -X POST http://localhost:54321/functions/v1/verify-paystack-payment \
  -H "Content-Type: application/json" \
  -d '{"reference": "test_123"}'
```

## Database Commands

```bash
# List all tables
supabase db list

# Run SQL query
supabase db query "SELECT * FROM users LIMIT 5;"

# Reset database (WARNING: Deletes all data)
supabase db reset

# Create new migration
supabase migration new add_new_table
```

## Check Status

```bash
# View project status
supabase status

# List all functions
supabase functions list

# List all migrations
supabase migration list
```

## Troubleshooting

**Error: "Not linked to any project"**
```bash
supabase link --project-ref psafbcbhbidnbzfsccsu
```

**Error: "Migration failed"**
```bash
# Check migration status
supabase migration list

# Reset and retry
supabase db reset
supabase db push
```

**Error: "Function not found"**
```bash
# Verify function deployed
supabase functions list

# Redeploy
supabase functions deploy function-name
```

## Quick Reference

```bash
# Complete setup in one go
supabase login
supabase link --project-ref psafbcbhbidnbzfsccsu
supabase db push
node scripts/seed-database.js
supabase functions deploy verify-paystack-payment
supabase functions deploy paystack-webhook
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_key
```

## Get Help

```bash
# View help
supabase --help

# Function-specific help
supabase functions --help

# Database help
supabase db --help
```

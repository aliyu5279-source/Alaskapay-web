# Quick Webhook Setup Guide

## Paystack Webhook Setup

### Step 1: Get Your Webhook URL
Your webhook URL will be:
```
https://[YOUR-PROJECT-ID].supabase.co/functions/v1/paystack-webhook
```

### Step 2: Configure in Paystack Dashboard
1. Go to https://dashboard.paystack.co/#/settings/developer
2. Scroll to "Webhook URL"
3. Enter your webhook URL
4. Click "Save Changes"

### Step 3: Test the Webhook
```bash
# Make a test payment
curl -X POST https://api.paystack.co/transaction/initialize \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "amount": 10000
  }'
```

## Flutterwave Webhook Setup

### Step 1: Get Your Webhook URL
```
https://[YOUR-PROJECT-ID].supabase.co/functions/v1/flutterwave-webhook
```

### Step 2: Configure in Flutterwave Dashboard
1. Go to https://dashboard.flutterwave.com/dashboard/settings/webhooks
2. Enter your webhook URL
3. Set a secret hash (save this as FLUTTERWAVE_WEBHOOK_SECRET)
4. Click "Save"

### Step 3: Add Secret to Supabase
```bash
supabase secrets set FLUTTERWAVE_WEBHOOK_SECRET=your_secret_hash
```

## Testing Webhooks Locally

### Using ngrok
```bash
# Install ngrok
npm install -g ngrok

# Start your local server
npm run dev

# In another terminal, expose it
ngrok http 3000

# Use the ngrok URL in your webhook settings
https://abc123.ngrok.io/api/webhooks/paystack
```

## Webhook Events to Handle

### Paystack Events
- `charge.success` - Payment successful
- `charge.failed` - Payment failed
- `transfer.success` - Transfer completed
- `transfer.failed` - Transfer failed

### Flutterwave Events
- `charge.completed` - Payment completed
- `transfer.completed` - Transfer completed

## Monitoring Webhooks

Check webhook delivery in:
- Paystack: Dashboard → Settings → Webhooks → Logs
- Flutterwave: Dashboard → Settings → Webhooks → Logs

## Troubleshooting

### Webhook Not Receiving Events
1. Check URL is correct and accessible
2. Verify signature validation
3. Check Supabase function logs
4. Ensure secrets are set correctly

### Signature Validation Failing
```typescript
// Paystack signature check
const hash = crypto
  .createHmac('sha512', secret)
  .update(JSON.stringify(body))
  .digest('hex');

// Flutterwave signature check
const signature = req.headers['verif-hash'];
if (signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### Database Not Updating
1. Check transaction reference exists
2. Verify user_id in metadata
3. Check RLS policies allow updates
4. Review Supabase logs

## Security Best Practices

✅ Always verify webhook signatures
✅ Use HTTPS only
✅ Store secrets securely
✅ Implement idempotency
✅ Log all webhook events
✅ Set up monitoring alerts
✅ Rate limit webhook endpoints

## Quick Test Script

```javascript
// test-webhook.js
const crypto = require('crypto');

const payload = {
  event: 'charge.success',
  data: {
    reference: 'test-ref-123',
    amount: 10000,
    metadata: { userId: 'user-123' }
  }
};

const secret = 'your_secret_key';
const hash = crypto
  .createHmac('sha512', secret)
  .update(JSON.stringify(payload))
  .digest('hex');

fetch('http://localhost:3000/api/webhooks/paystack', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-paystack-signature': hash
  },
  body: JSON.stringify(payload)
});
```

Run with: `node test-webhook.js`

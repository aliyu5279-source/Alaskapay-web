# AI Edge Functions - Deployment Instructions

## ⚠️ Current Status
Deployment attempted but still blocked. The Pro tier upgrade may need a few minutes to take effect, or the spend cap needs to be disabled.

## Steps to Complete Deployment

### 1. Verify Pro Tier Upgrade
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Billing**
4. Verify you're on **Pro Plan** ($25/month)
5. **IMPORTANT**: Disable the spend cap if it's still enabled

### 2. Wait for Propagation
The plan upgrade can take 5-10 minutes to fully propagate across Supabase's systems.

### 3. Deploy Functions Manually

Once the upgrade is active, deploy using Supabase CLI:

```bash
# Deploy all 4 AI functions
supabase functions deploy ai-chat-assistant
supabase functions deploy ai-categorize-transaction
supabase functions deploy ai-financial-insights
supabase functions deploy ai-fraud-detection
```

## Function Code Ready

All 4 functions are coded and ready in `AI_EDGE_FUNCTIONS_READY.md`:

1. **ai-chat-assistant** - Real-time chat with GPT-4
2. **ai-categorize-transaction** - Auto-categorize transactions
3. **ai-financial-insights** - Personalized recommendations
4. **ai-fraud-detection** - Real-time fraud assessment

## Alternative: Deploy via Dashboard

1. Go to **Edge Functions** in Supabase Dashboard
2. Click **Create Function**
3. Copy code from AI_EDGE_FUNCTIONS_READY.md
4. Deploy each function

## Verify OPENAI_API_KEY

Ensure the secret is set:
```bash
supabase secrets list
```

Should show: `OPENAI_API_KEY: Available for use`

## Test After Deployment

```bash
# Test chat assistant
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/ai-chat-assistant \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"How do I send money?"}]}'
```

## Frontend Already Integrated

All AI components are built and will work automatically:
- ✅ AI Chat Widget (floating button on all pages)
- ✅ AI Transaction Categorizer
- ✅ AI Financial Insights Dashboard
- ✅ AI Fraud Detection Panel
- ✅ AI Admin Dashboard

## Next Steps

1. Wait 5-10 minutes after Pro upgrade
2. Try deploying again (let me know and I'll retry)
3. Or deploy manually using the code provided
4. Test the functions
5. Enjoy AI-powered features!

## Current Function Count

You currently have **105 edge functions** deployed. The Pro plan should allow unlimited functions (or at least 500+).

If still blocked after 10 minutes, contact Supabase support to verify the upgrade is complete.

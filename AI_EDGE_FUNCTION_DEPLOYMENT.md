# AI Edge Function Deployment Guide

## ⚠️ Current Status
**Deployment Blocked**: Maximum number of edge functions reached for current Supabase plan.

## Solution Options

### Option 1: Upgrade Supabase Plan (Recommended)
```bash
# Visit Supabase Dashboard → Settings → Billing
# Upgrade to Pro plan for unlimited edge functions
```

### Option 2: Disable Spend Cap
```bash
# Visit Supabase Dashboard → Settings → Billing
# Disable spend cap to allow more functions
```

### Option 3: Manual Deployment (After Upgrade)

#### Deploy AI Chat Assistant Function
```bash
# Create function directory
mkdir -p supabase/functions/ai-chat-assistant

# Create index.ts with the code below
# Then deploy:
supabase functions deploy ai-chat-assistant
```

## AI Chat Assistant Function Code

Save this to `supabase/functions/ai-chat-assistant/index.ts`:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const systemPrompt = `You are a helpful financial assistant for AlaskaPay, a fintech platform. 
You help users with:
- Transaction queries and history
- Payment advice and guidance
- Bill payment assistance
- Wallet management tips
- Security and fraud prevention
- KYC verification questions
- General financial advice

Context: ${context ? JSON.stringify(context) : 'No additional context'}

Be concise, professional, and helpful. Always prioritize security and compliance.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response', details: error }),
        { status: response.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        message: data.choices[0].message.content,
        usage: data.usage,
        model: data.model
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Error in ai-chat-assistant:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
```

## Additional AI Functions to Deploy

### 1. AI Transaction Categorizer
Create `supabase/functions/ai-categorize-transaction/index.ts`

### 2. AI Financial Insights
Create `supabase/functions/ai-financial-insights/index.ts`

### 3. AI Fraud Detection
Create `supabase/functions/ai-fraud-detection/index.ts`

## Testing After Deployment

```bash
# Test the function
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/ai-chat-assistant \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "How do I send money?"}],
    "context": {"userId": "test"}
  }'
```

## Frontend Integration

The AI components are already built and ready:
- ✅ AIChatAssistant.tsx
- ✅ AITransactionCategorizer.tsx
- ✅ AIFinancialInsights.tsx
- ✅ AIFraudDetector.tsx
- ✅ AIAdminDashboard.tsx

They will automatically connect once the edge function is deployed.

## Next Steps

1. Upgrade Supabase plan or disable spend cap
2. Deploy AI edge functions manually
3. Verify OPENAI_API_KEY is set in Supabase secrets
4. Test the AI features in the application
5. Monitor usage and costs in OpenAI dashboard

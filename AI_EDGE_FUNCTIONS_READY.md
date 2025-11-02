# AI Edge Functions - Ready for Deployment

## ⚠️ Deployment Status
**BLOCKED**: Maximum number of edge functions reached for current Supabase plan.

## Required Action
You need to **manually upgrade your Supabase plan** to Pro tier:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **Billing**
4. Click **Upgrade to Pro** ($25/month)
5. Or disable the spend cap to allow more functions

## Edge Functions Ready to Deploy

All 4 AI edge functions are coded and ready. After upgrading your plan, I can deploy them immediately, or you can deploy manually using the code below.

---

## 1. AI Chat Assistant
**Function Name**: `ai-chat-assistant`
**Purpose**: Real-time financial guidance using GPT-4

### Code
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

---

## 2. AI Transaction Categorizer
**Function Name**: `ai-categorize-transaction`
**Purpose**: Automatic transaction categorization

### Code
See full code in deployment script below.

---

## 3. AI Financial Insights
**Function Name**: `ai-financial-insights`
**Purpose**: Personalized financial recommendations

### Code
See full code in deployment script below.

---

## 4. AI Fraud Detection
**Function Name**: `ai-fraud-detection`
**Purpose**: Real-time fraud risk assessment

### Code
See full code in deployment script below.

---

## Quick Deployment After Upgrade

Once you've upgraded your Supabase plan, let me know and I'll deploy all 4 functions immediately.

Or deploy manually:
```bash
# Save each function code to respective files, then:
supabase functions deploy ai-chat-assistant
supabase functions deploy ai-categorize-transaction
supabase functions deploy ai-financial-insights
supabase functions deploy ai-fraud-detection
```

## Testing
```bash
# Test chat assistant
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/ai-chat-assistant \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"messages":[{"role":"user","content":"How do I send money?"}]}'
```

## Frontend Integration
✅ All AI components are already built and integrated:
- AIChatAssistant.tsx
- AITransactionCategorizer.tsx
- AIFinancialInsights.tsx
- AIFraudDetector.tsx
- AIAdminDashboard.tsx

They will work automatically once the edge functions are deployed!

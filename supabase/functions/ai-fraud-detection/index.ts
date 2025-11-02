export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { transaction, userHistory, deviceInfo } = await req.json();

    if (!transaction) {
      return new Response(
        JSON.stringify({ error: 'Transaction data is required' }),
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

    const prompt = `Analyze this transaction for fraud risk:

Transaction: ${JSON.stringify(transaction)}
User History: ${JSON.stringify(userHistory || {})}
Device Info: ${JSON.stringify(deviceInfo || {})}

Assess fraud risk (0-100) and provide:
1. Risk score
2. Risk level (low/medium/high)
3. Reasons for the score
4. Recommended actions

Format as JSON: {"riskScore": 0-100, "riskLevel": "low|medium|high", "reasons": [], "actions": []}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: 'Failed to assess fraud risk', details: error }),
        { status: response.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const data = await response.json();
    const assessment = JSON.parse(data.choices[0].message.content);
    
    return new Response(
      JSON.stringify(assessment),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

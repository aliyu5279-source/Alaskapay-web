export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { transactions, balance, timeframe } = await req.json();

    if (!transactions || !Array.isArray(transactions)) {
      return new Response(
        JSON.stringify({ error: 'Transactions array is required' }),
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

    const prompt = `Analyze these financial transactions and provide 3-5 actionable insights:

Balance: ${balance || 'Not provided'}
Timeframe: ${timeframe || 'Last 30 days'}
Transactions: ${JSON.stringify(transactions.slice(0, 50))}

Provide insights on:
1. Spending patterns
2. Savings opportunities
3. Budget recommendations
4. Unusual activity
5. Financial health tips

Format as JSON array: [{"type": "warning|tip|insight", "title": "...", "description": "..."}]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: 'Failed to generate insights', details: error }),
        { status: response.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const data = await response.json();
    const insights = JSON.parse(data.choices[0].message.content);
    
    return new Response(
      JSON.stringify({ insights }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

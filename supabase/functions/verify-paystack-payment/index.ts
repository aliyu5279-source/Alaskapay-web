import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();
    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY');

    // Verify transaction with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${paystackSecret}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = await response.json();

    if (!result.status) {
      return new Response(
        JSON.stringify({ success: false, message: result.message }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const { data } = result;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Update transaction in database
    const { error: txError } = await supabase
      .from('transactions')
      .update({
        status: data.status === 'success' ? 'completed' : 'failed',
        amount: data.amount / 100,
        updated_at: new Date().toISOString()
      })
      .eq('reference', reference);

    if (txError) throw txError;

    // Credit wallet if successful
    if (data.status === 'success' && data.metadata?.userId) {
      const { error: walletError } = await supabase.rpc('credit_wallet', {
        p_user_id: data.metadata.userId,
        p_amount: data.amount / 100
      });

      if (walletError) throw walletError;
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

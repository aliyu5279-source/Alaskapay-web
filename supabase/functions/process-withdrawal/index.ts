import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error('Unauthorized');

    const { withdrawal_id } = await req.json();

    // Get withdrawal request
    const { data: withdrawal, error: wError } = await supabaseClient
      .from('withdrawal_requests')
      .select('*, linked_bank_accounts(*)')
      .eq('id', withdrawal_id)
      .eq('user_id', user.id)
      .single();

    if (wError || !withdrawal) throw new Error('Withdrawal not found');

    // Initiate Paystack transfer
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackKey) throw new Error('Paystack not configured');

    const transferData = {
      source: 'balance',
      amount: Math.round(withdrawal.net_amount * 100), // Convert to kobo
      recipient: withdrawal.linked_bank_accounts.recipient_code,
      reason: `Withdrawal: ${withdrawal.reference}`,
      reference: withdrawal.reference
    };

    const response = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transferData)
    });

    const result = await response.json();

    if (!result.status) {
      throw new Error(result.message || 'Transfer initiation failed');
    }

    // Update withdrawal status
    await supabaseClient
      .from('withdrawal_requests')
      .update({
        status: 'processing',
        transfer_code: result.data.transfer_code
      })
      .eq('id', withdrawal_id);

    return new Response(
      JSON.stringify({ success: true, transfer_code: result.data.transfer_code }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

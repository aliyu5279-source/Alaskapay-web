import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-paystack-signature');
    const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
    const body = await req.text();

    // Verify webhook signature using HMAC SHA-512
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex !== signature) {
      console.error('Invalid signature');
      return new Response('Invalid signature', { status: 401, headers: corsHeaders });
    }

    const event = JSON.parse(body);
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Webhook event:', event.event);

    // Handle successful charge
    if (event.event === 'charge.success') {
      const { reference, amount, metadata, customer } = event.data;
      
      // Update transaction status
      const { error: txError } = await supabase
        .from('transactions')
        .update({ 
          status: 'completed',
          amount: amount / 100,
          updated_at: new Date().toISOString()
        })
        .eq('reference', reference);

      if (txError) console.error('Transaction update error:', txError);
      
      // Credit wallet
      if (metadata?.userId) {
        const { error: walletError } = await supabase.rpc('credit_wallet', {
          p_user_id: metadata.userId,
          p_amount: amount / 100
        });

        if (walletError) console.error('Wallet credit error:', walletError);
      }
    }

    // Handle failed charge
    if (event.event === 'charge.failed') {
      const { reference } = event.data;
      
      await supabase
        .from('transactions')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('reference', reference);
    }

    // Handle transfer success (withdrawals)
    if (event.event === 'transfer.success') {
      const { reference, transfer_code } = event.data;
      
      await supabase
        .from('withdrawal_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('reference', reference);
    }

    // Handle transfer failed (withdrawals)
    if (event.event === 'transfer.failed') {
      const { reference, transfer_code } = event.data;
      
      await supabase
        .from('withdrawal_requests')
        .update({ 
          status: 'failed',
          failure_reason: event.data.reason || 'Transfer failed',
          updated_at: new Date().toISOString()
        })
        .eq('reference', reference);
      
      // Refund wallet - get withdrawal details and credit back
      const { data: withdrawal } = await supabase
        .from('withdrawal_requests')
        .select('user_id, amount, wallet_account_id')
        .eq('reference', reference)
        .single();
      
      if (withdrawal) {
        await supabase
          .from('wallets')
          .update({ balance: supabase.raw(`balance + ${withdrawal.amount}`) })
          .eq('id', withdrawal.wallet_account_id);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) throw new Error('Unauthorized');

    const { amount, recipient_code, recipient_id } = await req.json();

    // Check balance
    const { data: wallet } = await supabase
      .from('user_wallets')
      .select('commission_balance')
      .eq('user_id', user.id)
      .single();

    if (!wallet || wallet.commission_balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Initiate transfer on Paystack
    const transferResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'balance',
        amount: amount * 100, // Convert to kobo
        recipient: recipient_code,
        reason: 'Commission withdrawal'
      })
    });

    const result = await transferResponse.json();

    if (!result.status) {
      throw new Error(result.message || 'Transfer failed');
    }

    // Deduct from balance
    await supabase
      .from('user_wallets')
      .update({ commission_balance: wallet.commission_balance - amount })
      .eq('user_id', user.id);

    // Record withdrawal
    await supabase
      .from('commission_withdrawals')
      .insert({
        user_id: user.id,
        recipient_id,
        amount,
        status: 'pending',
        transfer_code: result.data.transfer_code,
        reference: result.data.reference
      });

    return new Response(
      JSON.stringify({ success: true, transfer_code: result.data.transfer_code }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
});

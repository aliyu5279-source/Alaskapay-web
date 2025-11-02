export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY')!;

    // Get all pending dunning records ready for retry
    const dunningRes = await fetch(
      `${supabaseUrl}/rest/v1/dunning_management?status=eq.pending&next_retry_at=lte.${new Date().toISOString()}`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
    );
    const dunningRecords = await dunningRes.json();

    const results = [];

    for (const record of dunningRecords) {
      // Get subscription details
      const subRes = await fetch(
        `${supabaseUrl}/rest/v1/subscriptions?id=eq.${record.subscription_id}&select=*,subscription_plans(*)`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const [subscription] = await subRes.json();

      if (!subscription) continue;

      // Get payment method
      const pmRes = await fetch(
        `${supabaseUrl}/rest/v1/payment_methods?user_id=eq.${subscription.user_id}&is_default=eq.true`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const [paymentMethod] = await pmRes.json();

      if (!paymentMethod?.paystack_auth_code) continue;

      // Retry payment
      const charge = await fetch('https://api.paystack.co/transaction/charge_authorization', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paystackKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorization_code: paymentMethod.paystack_auth_code,
          email: subscription.user_email,
          amount: subscription.subscription_plans.price * 100
        })
      });

      const result = await charge.json();
      const success = result.status && result.data?.status === 'success';

      if (success) {
        // Payment successful - update subscription
        await fetch(`${supabaseUrl}/rest/v1/subscriptions?id=eq.${subscription.id}`, {
          method: 'PATCH',
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'active' })
        });

        // Mark dunning as resolved
        await fetch(`${supabaseUrl}/rest/v1/dunning_management?id=eq.${record.id}`, {
          method: 'PATCH',
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'resolved', resolved_at: new Date().toISOString() })
        });
      } else {
        // Increment retry count
        const newAttemptCount = record.attempt_count + 1;
        const maxAttempts = 4;

        if (newAttemptCount >= maxAttempts) {
          // Cancel subscription after max attempts
          await fetch(`${supabaseUrl}/rest/v1/subscriptions?id=eq.${subscription.id}`, {
            method: 'PATCH',
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'canceled', canceled_at: new Date().toISOString() })
          });

          await fetch(`${supabaseUrl}/rest/v1/dunning_management?id=eq.${record.id}`, {
            method: 'PATCH',
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'failed', failed_at: new Date().toISOString() })
          });
        } else {
          // Schedule next retry (exponential backoff: 3, 7, 14 days)
          const retryDays = [3, 7, 14][newAttemptCount - 1] || 14;
          await fetch(`${supabaseUrl}/rest/v1/dunning_management?id=eq.${record.id}`, {
            method: 'PATCH',
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              attempt_count: newAttemptCount,
              next_retry_at: new Date(Date.now() + retryDays * 86400000).toISOString()
            })
          });
        }
      }

      results.push({ subscription_id: subscription.id, success });
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { subscriptionId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Get subscription with plan details
    const subRes = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?id=eq.${subscriptionId}&select=*,subscription_plans(*)`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
    );
    const [subscription] = await subRes.json();

    if (!subscription || subscription.status === 'canceled') {
      throw new Error('Invalid subscription');
    }

    const plan = subscription.subscription_plans;
    const amount = plan.price;

    // Get user payment method
    const pmRes = await fetch(
      `${supabaseUrl}/rest/v1/payment_methods?user_id=eq.${subscription.user_id}&is_default=eq.true`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
    );
    const [paymentMethod] = await pmRes.json();

    if (!paymentMethod) {
      throw new Error('No payment method found');
    }

    let paymentSuccess = false;
    let paymentId = null;

    // Process payment via Stripe or Paystack
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');

    if (paymentMethod.provider === 'stripe' && stripeKey) {
      const paymentIntent = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          amount: (amount * 100).toString(),
          currency: plan.currency.toLowerCase(),
          customer: paymentMethod.stripe_customer_id,
          payment_method: paymentMethod.stripe_payment_method_id,
          confirm: 'true',
          off_session: 'true'
        })
      });

      const payment = await paymentIntent.json();
      paymentSuccess = payment.status === 'succeeded';
      paymentId = payment.id;
    } else if (paymentMethod.provider === 'paystack' && paystackKey) {
      const charge = await fetch('https://api.paystack.co/transaction/charge_authorization', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paystackKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorization_code: paymentMethod.paystack_auth_code,
          email: subscription.user_id,
          amount: amount * 100,
          currency: plan.currency
        })
      });

      const result = await charge.json();
      paymentSuccess = result.status && result.data.status === 'success';
      paymentId = result.data?.reference;
    }

    // Create invoice
    const invoice = {
      subscription_id: subscriptionId,
      user_id: subscription.user_id,
      amount,
      currency: plan.currency,
      status: paymentSuccess ? 'paid' : 'failed',
      payment_method_id: paymentMethod.id,
      payment_gateway_id: paymentId,
      due_date: new Date().toISOString(),
      paid_at: paymentSuccess ? new Date().toISOString() : null
    };

    await fetch(`${supabaseUrl}/rest/v1/subscription_invoices`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invoice)
    });

    if (paymentSuccess) {
      // Update subscription period
      const now = new Date();
      let nextBilling = new Date(now);
      
      if (plan.billing_cycle === 'monthly') {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      } else if (plan.billing_cycle === 'yearly') {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      } else if (plan.billing_cycle === 'weekly') {
        nextBilling = new Date(nextBilling.getTime() + 7 * 86400000);
      } else if (plan.billing_cycle === 'daily') {
        nextBilling = new Date(nextBilling.getTime() + 86400000);
      }

      await fetch(`${supabaseUrl}/rest/v1/subscriptions?id=eq.${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: nextBilling.toISOString()
        })
      });
    } else {
      // Start dunning process
      await fetch(`${supabaseUrl}/rest/v1/dunning_management`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription_id: subscriptionId,
          status: 'pending',
          attempt_count: 0,
          next_retry_at: new Date(Date.now() + 3 * 86400000).toISOString()
        })
      });
    }

    return new Response(JSON.stringify({ success: paymentSuccess, paymentId }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

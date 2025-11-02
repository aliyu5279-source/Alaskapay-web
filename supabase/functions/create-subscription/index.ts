export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, plan_id, payment_method_id, authorization_code, trial_days = 0 } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY')!;

    // Get plan details
    const planRes = await fetch(
      `${supabaseUrl}/rest/v1/subscription_plans?id=eq.${plan_id}`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
    );
    const [plan] = await planRes.json();

    if (!plan) throw new Error('Plan not found');

    // Check for existing active subscription
    const existingRes = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${user_id}&status=eq.active`,
      { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
    );
    const existing = await existingRes.json();

    if (existing.length > 0) {
      throw new Error('User already has an active subscription');
    }

    // Calculate billing dates
    const now = new Date();
    const trialEnd = trial_days > 0 ? new Date(now.getTime() + trial_days * 86400000) : now;
    let nextBilling = new Date(trialEnd);

    if (plan.billing_cycle === 'monthly') {
      nextBilling.setMonth(nextBilling.getMonth() + 1);
    } else if (plan.billing_cycle === 'yearly') {
      nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    }

    // Create subscription in Paystack if plan has code
    let paystackSubscriptionCode = null;
    if (plan.paystack_plan_code && authorization_code) {
      const paystackSub = await fetch('https://api.paystack.co/subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paystackKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: user_id,
          plan: plan.paystack_plan_code,
          authorization: authorization_code,
          start_date: trialEnd.toISOString()
        })
      });

      const result = await paystackSub.json();
      if (result.status) {
        paystackSubscriptionCode = result.data.subscription_code;
      }
    }

    // Create subscription record
    const subscription = {
      user_id,
      plan_id,
      status: trial_days > 0 ? 'trialing' : 'active',
      current_period_start: now.toISOString(),
      current_period_end: nextBilling.toISOString(),
      trial_end: trial_days > 0 ? trialEnd.toISOString() : null,
      paystack_subscription_code: paystackSubscriptionCode,
      payment_method_id
    };

    const subRes = await fetch(`${supabaseUrl}/rest/v1/subscriptions`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(subscription)
    });

    const [newSubscription] = await subRes.json();

    // Create first invoice if not in trial
    if (trial_days === 0) {
      await fetch(`${supabaseUrl}/rest/v1/subscription_invoices`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription_id: newSubscription.id,
          user_id,
          amount: plan.price,
          currency: plan.currency,
          status: 'paid',
          due_date: now.toISOString(),
          paid_at: now.toISOString()
        })
      });
    }

    return new Response(JSON.stringify({ success: true, subscription: newSubscription }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
